# Real inventory, inquiries, and reporting

## What will be built

- Replace the sample catalog with the real product list supplied in chat, including brand, price, sizes, category, description, and matching uploaded photos.
- Keep every product connected to a prefilled WhatsApp inquiry containing the product name and page context.
- Add a mobile-first `/inventory` page with fast search across product names, brands, categories, sizes, and descriptions, plus simple category filtering.
- Link the searchable inventory clearly from the Products section.
- Extend the private `/reports` page with visitor totals, product views, WhatsApp click history, and saved contact inquiries.
- Add a short contact form for name, phone/WhatsApp number, and message. Save each valid submission before confirming success.
- Send the shop owner an automatic WhatsApp alert for each new contact inquiry through Twilio’s approved WhatsApp Business messaging service.

## Safety and privacy

- Validate and limit every form field in the browser and on the server.
- Keep inquiry details owner-only and never expose them through public reads.
- Store privacy-friendly visitor identifiers rather than names or exact locations.
- Protect reporting and inquiry reads with the existing owner sign-in and approved email.
- Add basic abuse protection for public contact submissions and tracking events.

## Technical details

- Add an owner-only inquiries table and explicit access grants/policies in Lovable Cloud.
- Extend visitor reporting to return event counts and recent WhatsApp click records.
- Add validated server functions for contact submission and owner report retrieval.
- Use the Twilio project connection only on the server; no credentials reach visitors’ browsers.
- Keep product data centralized in `products.ts` as requested, with bundled photos and existing detail pages.
- Verify mobile search, product inquiry links, contact submission, owner-only reports, and metadata.

## Inputs still needed

- The real product list: product name, category, brand, price, sizes, short description, and optional specifications.
- Matching product photos attached in chat, with filenames that make the matching product clear.
- A connected Twilio account with WhatsApp Business sending configured; the connection prompt will be opened during implementation.
