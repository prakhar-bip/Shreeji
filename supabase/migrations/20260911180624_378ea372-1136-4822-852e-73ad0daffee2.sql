CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 20),
  message text NOT NULL CHECK (char_length(message) BETWEEN 5 AND 1000),
  source_page text NOT NULL DEFAULT '/contact' CHECK (char_length(source_page) BETWEEN 1 AND 240),
  notification_status text NOT NULL DEFAULT 'pending' CHECK (notification_status IN ('pending', 'sent', 'failed')),
  notified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.contact_inquiries TO authenticated;
GRANT ALL ON public.contact_inquiries TO service_role;

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved owner can view contact inquiries"
ON public.contact_inquiries
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email') = 'prakharbatwal98@gmail.com');

CREATE INDEX contact_inquiries_created_at_idx ON public.contact_inquiries (created_at DESC);

CREATE OR REPLACE FUNCTION public.set_contact_inquiries_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_contact_inquiries_updated_at
BEFORE UPDATE ON public.contact_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.set_contact_inquiries_updated_at();

CREATE OR REPLACE FUNCTION public.get_owner_reports()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF (auth.jwt() ->> 'email') IS DISTINCT FROM 'prakharbatwal98@gmail.com' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT jsonb_build_object(
    'totalVisits', COUNT(*) FILTER (WHERE event_name = 'page_view'),
    'uniqueVisitors', COUNT(DISTINCT visitor_hash) FILTER (WHERE event_name = 'page_view'),
    'todayVisits', COUNT(*) FILTER (WHERE event_name = 'page_view' AND created_at >= date_trunc('day', now())),
    'todayUnique', COUNT(DISTINCT visitor_hash) FILTER (WHERE event_name = 'page_view' AND created_at >= date_trunc('day', now())),
    'productViews', COUNT(*) FILTER (WHERE event_name = 'product_view'),
    'whatsappClicks', COUNT(*) FILTER (WHERE event_name = 'whatsapp_click'),
    'topPages', COALESCE((
      SELECT jsonb_agg(row_to_json(p) ORDER BY p.visits DESC)
      FROM (
        SELECT page, COUNT(*)::int AS visits
        FROM public.visitor_events
        WHERE event_name = 'page_view'
        GROUP BY page ORDER BY visits DESC LIMIT 8
      ) p
    ), '[]'::jsonb),
    'sources', COALESCE((
      SELECT jsonb_agg(row_to_json(s) ORDER BY s.visits DESC)
      FROM (
        SELECT CASE WHEN referrer_host = '' THEN 'Direct' ELSE referrer_host END AS source, COUNT(*)::int AS visits
        FROM public.visitor_events
        WHERE event_name = 'page_view'
        GROUP BY source ORDER BY visits DESC LIMIT 8
      ) s
    ), '[]'::jsonb),
    'devices', COALESCE((
      SELECT jsonb_agg(row_to_json(d) ORDER BY d.visits DESC)
      FROM (
        SELECT device_type AS device, COUNT(*)::int AS visits
        FROM public.visitor_events
        WHERE event_name = 'page_view'
        GROUP BY device_type ORDER BY visits DESC
      ) d
    ), '[]'::jsonb),
    'daily', COALESCE((
      SELECT jsonb_agg(row_to_json(day_row) ORDER BY day_row.day)
      FROM (
        SELECT to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day,
          COUNT(*)::int AS visits,
          COUNT(DISTINCT visitor_hash)::int AS visitors
        FROM public.visitor_events
        WHERE event_name = 'page_view' AND created_at >= now() - interval '30 days'
        GROUP BY 1 ORDER BY 1
      ) day_row
    ), '[]'::jsonb),
    'recentWhatsappClicks', COALESCE((
      SELECT jsonb_agg(row_to_json(w) ORDER BY w.created_at DESC)
      FROM (
        SELECT page, COALESCE(properties ->> 'context', 'general') AS context, created_at
        FROM public.visitor_events
        WHERE event_name = 'whatsapp_click'
        ORDER BY created_at DESC LIMIT 30
      ) w
    ), '[]'::jsonb),
    'inquiries', COALESCE((
      SELECT jsonb_agg(row_to_json(i) ORDER BY i.created_at DESC)
      FROM (
        SELECT id, name, phone, message, source_page, notification_status, created_at
        FROM public.contact_inquiries
        ORDER BY created_at DESC LIMIT 50
      ) i
    ), '[]'::jsonb)
  ) INTO result
  FROM public.visitor_events;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_owner_reports() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_owner_reports() TO authenticated;