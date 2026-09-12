# Visitor tracker and room color preview

## Goal
Add a privacy-friendly visitor counter with a private owner dashboard, and make the existing AI room-color preview easy to open from every paint product.

## Visitor tracking
- Store page visits in Lovable Cloud without collecting names, phone numbers, or exact location.
- Count total visits and unique browsers using a randomly generated browser identifier; also record the visited page, referral source, device type, and date for useful summaries.
- Update the current tracking helper so page views and existing actions are recorded reliably without slowing the site.
- Prevent obvious duplicate counts from page refreshes and validate all public tracking input on the server.

## Private owner dashboard
- Add Google sign-in and restrict the reports page to `prakharbatwal98@gmail.com` with checks on both the page and its data requests.
- Add a simple private dashboard showing total visitors, unique visitors, today’s activity, popular pages, traffic sources, device split, and recent daily trends.
- Keep dashboard access out of the customer navigation; the owner can open its direct URL and sign out safely.

## AI room color preview
- Reuse the existing working room-photo visualizer and the real Terracotta, Olive, and Sand shades.
- Add a clear “Try in my room” action on every paint product that has a color shade.
- Open the visualizer with that product’s shade already selected, while keeping camera/gallery upload, photo preview, loading, result, and error states.
- Improve AI gateway failure handling so specific errors are shown clearly and only temporary rate/server failures receive limited delayed retries.

## Verification
- Apply and verify the visitor-data tables, permissions, and owner-only access.
- Test a real visitor event, confirm repeat visits produce correct total-versus-unique counts, and verify the dashboard summaries.
- Invoke the AI visualizer with a room photo and confirm a returned preview is displayed.
- Check the customer and owner flows on mobile and desktop, including Google sign-in, sign-out, navigation, and error states.

## Technical details
- Use Lovable Cloud tables with row-level security; customers cannot read analytics data directly.
- Use server functions for event recording, dashboard queries, and AI image editing; secrets remain server-side.
- Configure Google authentication during implementation and enforce the approved owner email server-side.
- Preserve the existing mobile-first visual style and compact controls.
