# Shop website — handover notes (Version 1)

## Structure

```
src/
  data/
    business.ts      shop name, phone, WhatsApp, address, map link, timings, analytics domain
    categories.ts    the 6 product categories
    products.ts      product list (sample data)
    reviews.ts       customer reviews (marked as samples)
    gallery.ts       gallery photos + captions
  lib/
    whatsapp.ts      WhatsApp link builder + message templates
    analytics.ts     event tracking wrapper
  components/
    Header, BottomNav, Footer          site chrome (in src/routes/__root.tsx)
    ContactActions.tsx                 WhatsAppButton, CallButton, DirectionsButton,
                                       ProductRequestButton, WhatsAppFloat
    Hero.tsx                           hero with light parallax + floating cards
    CategoryCard, ProductCard          catalog cards
    HomeSections.tsx                   WhyUs, Reviews, Request, Location, ContactStrip
    GalleryGrid, SectionHeading, PriceNote, Reveal, Icons
  routes/
    index.tsx                /            home
    products.index.tsx       /products    categories + full list
    products.$category.tsx   /products/plywood-boards etc.
    product.$slug.tsx        /product/commercial-plywood-19mm etc.
    gallery.tsx              /gallery
    why-us.tsx               /why-us
    location.tsx             /location
    contact.tsx              /contact
  styles.css                 design tokens (colours, fonts, buttons, cards, motion)
```

## Where to replace things

- **Shop info** → `src/data/business.ts` (name, phone, WhatsApp number, address, Google Maps
  link, Google Maps *embed* URL, timings, Facebook/Instagram).
- **Products** → `src/data/products.ts`. Only `id`, `slug`, `name`, `category`,
  `shortDescription`, `image`, `imageAlt` are required. `price` is optional and always shown
  with the "prices may vary" note. `swatch` renders a colour tile for paint shades.
- **Categories** → `src/data/categories.ts`.
- **Reviews** → `src/data/reviews.ts`. Delete `isPlaceholder: true` once a review is real;
  the "Sample" tag and the note above the section disappear automatically.
- **Images** → drop files into `src/assets/` and import them in the data file. Keeping the same
  filenames (`cat-plywood.jpg`, `shop-exterior.jpg`, …) means no code change at all.

## WhatsApp

One number, in `business.whatsappNumber` (+ `countryCode`). All buttons come from
`src/components/ContactActions.tsx` and messages from `waMessages` in `src/lib/whatsapp.ts`:
general, product (`"…I found <product> on your website…"`), category, product request, visit.

## Analytics

`track()` in `src/lib/analytics.ts` fires: `page_view`, `product_view`, `category_view`,
`whatsapp_click`, `phone_click`, `directions_click`, `product_request_click`, `gallery_open`.
Set `plausibleDomain` in `business.ts` to start collecting (script is added automatically).
Google Analytics also works if you paste a gtag snippet into `src/routes/__root.tsx`.

## SEO

Per-page titles, descriptions, Open Graph tags and canonical links; local-business JSON-LD on
the home page (address, phone, hours, map). Semantic headings and alt text throughout. Add
location keywords later by editing the page titles/descriptions in each route file.

## Performance notes

- No 3D/WebGL and no icon or animation library — icons are inline SVG, motion is CSS plus one
  rAF-throttled scroll handler, and all effects respect "reduce motion".
- Images are lazy-loaded with fixed dimensions; the hero image is the only eager one.
- The generated placeholder photos are large-ish JPEGs. When you swap in real photos, export
  them around 1200px wide and use WebP for the smallest payload.
- Google Fonts adds one external request; self-hosting the two fonts would shave a little more.

## Deploy

Publish from Lovable (Publish button) — that builds and hosts the site and gives you a URL you
can share on WhatsApp/Facebook. Add a custom domain later in project settings.

## Ideas for Version 2 (not built)

Room colour visualiser, WhatsApp catalogue export, brand filters and search, stock/price sheet
loaded from a spreadsheet, Hindi language toggle, real customer photos and Google review embed.
