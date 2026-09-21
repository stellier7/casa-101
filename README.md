# Casa 101 — catálogo digital NFC

Single-page rental brochure for **Casa 101** (Residencial San Ignacio). Designed for NFC tap on a phone: one clean scroll from hero to WhatsApp contact.

## Live site

Open the Vercel project → **Deployments** → latest **Production** → **Visit**:

https://vercel.com/santiago-telliers-projects/casa-101

(`casa-101.vercel.app` is not assigned — use the Visit link from the dashboard.)

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (scroll-triggered photo reveals)
- Hosted on Vercel

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit listing data

All property info lives in [`lib/property.ts`](lib/property.ts). Swap photos under `public/photos/`.
