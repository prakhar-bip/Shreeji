CREATE OR REPLACE FUNCTION public.get_visitor_analytics()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
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
    ), '[]'::jsonb)
  ) INTO result
  FROM public.visitor_events;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_visitor_analytics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_visitor_analytics() TO authenticated;