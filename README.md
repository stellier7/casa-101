# Casa 101 — catálogo digital NFC

Single-page rental brochure for **Casa 101** (Residencial San Ignacio). Designed for NFC tap on a phone: one clean scroll from hero to WhatsApp contact. No forms, no navigation.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (scroll-triggered photo reveals)
- Deploy-ready for [Vercel](https://vercel.com)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start
```

## Reuse as a template

All listing data lives in [`lib/property.ts`](lib/property.ts):

| Field | Purpose |
|-------|---------|
| `name`, `location`, `price` | Hero + titles |
| `availability`, `includes`, `visits` | Mid-page facts |
| `whatsappNumber` / `whatsappDisplay` | CTA (`wa.me` digits only) |
| `facts` | Bedrooms, baths, m², parking (**placeholders**) |
| `map.lat` / `map.lng` | Google Maps link + embed (**placeholders**) |
| `photos` | Paths + Spanish alt text under `/public/photos` |

The WhatsApp message is built from `name`:

`Hola, estoy interesado en alquilar la {name}`

### Swap photos

Replace files in `public/photos/` (keep filenames or update `PROPERTY.photos`). Hero uses the first photo.

## Deploy

Connect the repo to Vercel — no extra env vars required.
