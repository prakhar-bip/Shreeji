# Dedicated Colors and Materials Sections

## What will change

- Add a dedicated **Colors** page focused only on Asian Paints, with the official logo, paint products, searchable shade catalogue, and the room color visualizer together in one place.
- Add a dedicated **Other Materials** page for plywood, laminates, hardware, Fevicol/adhesives, and furniture accessories.
- Replace the generic adhesive renders with genuine Fevicol product photos from official product sources, while keeping product names and imagery accurate.
- Make **Colors** and **Materials** the two clear choices on the home page, Products page, header, footer, and mobile navigation so visitors do not need to dig through mixed categories.
- Keep existing category and product links working; they will be reached through the correct dedicated section.

## Page structure

```text
Home
├── Colors
│   ├── Asian Paints products
│   ├── Search all shades
│   └── See this color in your room
└── Other Materials
    ├── Plywood & Boards
    ├── Mica & Laminates
    ├── Hinges & Hardware
    ├── Fevicol & Adhesives
    └── Furniture Accessories
```

## Technical details

- Create separate `/colors` and `/materials` routes with unique page titles and social metadata.
- Reuse the existing shade data, paint cards, and AI room preview rather than duplicating their logic.
- Update catalog grouping helpers and navigation links while preserving current URLs.
- Download, optimize, and store authentic Fevicol imagery locally through the project asset system; include accurate alternative text.
- Verify both new pages and navigation at mobile and desktop sizes, including image loading and color-tool interaction.
