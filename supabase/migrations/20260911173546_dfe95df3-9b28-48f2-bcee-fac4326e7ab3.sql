CREATE TABLE public.visitor_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE,
  event_name text NOT NULL CHECK (char_length(event_name) BETWEEN 1 AND 60),
  page text NOT NULL CHECK (char_length(page) BETWEEN 1 AND 240),
  visitor_hash text NOT NULL CHECK (char_length(visitor_hash) = 64),
  referrer_host text NOT NULL DEFAULT '' CHECK (char_length(referrer_host) <= 255),
  device_type text NOT NULL CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.visitor_events TO service_role;

ALTER TABLE public.visitor_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX visitor_events_created_at_idx ON public.visitor_events (created_at DESC);
CREATE INDEX visitor_events_name_created_idx ON public.visitor_events (event_name, created_at DESC);
CREATE INDEX visitor_events_visitor_idx ON public.visitor_events (visitor_hash);
CREATE INDEX visitor_events_page_idx ON public.visitor_events (page);