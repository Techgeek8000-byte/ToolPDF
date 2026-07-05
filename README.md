# ToolPDF — A Project by Osama

Every PDF Tool You'll Ever Need. Free, fast, and private.

## Quick Start

```bash
npm install
npx next dev
```

Open http://localhost:3000

## 10 Tools
Merge, Split, Compress, PDF-to-Word, Word-to-PDF, PDF-to-Image, Image-to-PDF, Rotate, Protect, Watermark

## Pages
- `/` — Home (all tools)
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/sitemap.xml` — Auto-generated sitemap
- `/robots.txt` — SEO robots file

## Setup After Deploy

### Google Analytics
1. Go to https://analytics.google.com
2. Create a Property → Web → Enter your domain
3. Copy the Measurement ID (G-XXXXXXXXXX)
4. Replace `G-XXXXXXXXXX` in `src/app/layout.tsx` (2 places)

### Google AdSense
1. Go to https://www.google.com/adsense
2. Apply with your site URL
3. Get your publisher ID (ca-pub-XXXXXXX)
4. Replace placeholders in `src/components/toolpdf/AdBanner.tsx`

### Stripe Payments
1. Go to https://stripe.com and create an account
2. Create 2 Price objects (monthly $5, lifetime $120)
3. Create `/api/create-checkout-session` API route
4. Update `src/components/toolpdf/CheckoutModal.tsx`

## Deploy to Vercel
```bash
npx vercel
```
