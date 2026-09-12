# Combined Room Color Visualizer

## What will change

- Replace the separate small shade picker and upload area with one mobile-first color studio.
- Show a realistic furnished 3D room by default, with its main wall changing instantly when a shade is selected.
- Include the complete Asian Paints shade catalogue with search, shade code, color family filters, and a compact scrollable swatch grid.
- Keep the selected shade name and code visible beside the room so customers know exactly what they chose.
- Put “Default room” and “My room photo” choices in the same area. Customers can explore colors immediately, then upload or photograph their own room for an AI-generated preview.
- Preserve the existing AI image processing, loading, result, error, and analytics behavior for customer photos.

## Mobile layout

```text
Room preview
├── Default room / My room photo
├── Large room image
├── Selected shade name + code
├── Search all Asian Paints colors
├── Color family filters
├── Scrollable swatch grid
└── Upload photo / Preview my room
```

## Technical details

- Generate and store one realistic 3D-style living-room image with a clean, clearly bounded feature wall.
- Use a layered wall mask so shade changes on the default room are immediate and do not consume AI credits.
- Use the existing 2,200-shade Asian Paints dataset rather than the current three product swatches.
- Continue using the existing AI service only after a customer uploads their own room photo.
- Verify shade search, instant default-room recoloring, photo upload, and the AI action on mobile and desktop.
