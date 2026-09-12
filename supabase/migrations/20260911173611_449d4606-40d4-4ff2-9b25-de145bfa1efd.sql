GRANT SELECT ON public.visitor_events TO authenticated;

CREATE POLICY "Approved owner can view visitor analytics"
ON public.visitor_events
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email') = 'prakharbatwal98@gmail.com');