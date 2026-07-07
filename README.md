# PSP Candidate Pack Generator

A reusable Public Sector People candidate pack builder with guided content entry, live A4 preview, section toggles, page-count recommendations, image handling and Puppeteer PDF export.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

The dev command starts:

- Vite front-end on `5173`
- Express/Puppeteer PDF server on `4174`
- Vite proxy from `/api/pdf` to the PDF server

For a production-style local run:

```bash
npm run serve
```

This builds the static app into `dist/` and serves it with the PDF endpoint.

## What Is Included

- Step-by-step consultant UI
- Mandatory validation for council name, council logo, job title and consultant contact details
- Locked PSP branding in the output
- Optional include/exclude toggles for candidate pack sections
- Target page count from 3 to 10 pages
- Recommended page count based on word count, sections and images
- Live PDF-style A4 preview
- Print-ready A4 portrait PDF export using Puppeteer
- Selectable PDF text where browser PDF rendering permits
- Demo content and placeholder PSP/council/profile/cover assets

## PDF Export

The export button sends the structured pack data to `POST /api/pdf`.

The server launches Puppeteer, opens the app in PDF mode, injects the pack data into local storage, waits for the print document to render, then exports with:

```css
@page {
  size: A4;
  margin: 0;
}
```

Exported filenames follow:

```text
PSP_Candidate_Pack_[Council_Name]_[Job_Title]_[Month_Year].pdf
```

Invalid filename characters are removed.

## Updating PSP Branding

The PSP logo URL is centralised in:

```text
src/utils/assets.js
```

`PSP_LOGO_URL` points to the approved Public Sector People logo. The app treats the PSP logo as mandatory and does not expose a remove toggle. If the remote logo cannot load, the builder shows a warning and the renderer falls back to the local SVG fallback in the same file.

## Hosting Or Embedding

The front-end is a normal React/Vite app and can be embedded in a website page or hosted as a small standalone tool.

Recommended hosting pattern:

1. Build the front-end with `npm run build`.
2. Host the `dist/` assets.
3. Host `server.js` or an equivalent Puppeteer function behind `/api/pdf`.
4. Keep request body limits high enough for base64 image uploads.

If embedding inside an existing site, mount the built app in a contained page or iframe and point `/api/pdf` to the export service.

## Layout Logic

`src/layouts/layoutEngine.js` maps selected page counts to designed section groups. It protects the final page for application and consultant contact content, then distributes remaining optional sections across earlier pages.

Density classes:

- `density-compact`: 3-4 pages
- `density-standard`: 5-7 pages
- `density-spacious`: 8-10 pages

The renderer uses cards, two-column grids, role-at-a-glance tables, statement panels and consistent footers rather than dumping raw form text.

## Content Parsing

`src/utils/contentParser.js` formats pasted content:

- Short line-separated content becomes bullets.
- `Label: detail` lines become key-value cards.
- Long text becomes readable paragraphs.
- Obvious heading plus body blocks are preserved.

## Known Limitations

- Image cropping is controlled by fit mode (`cover`, `contain`, `scale-down`), but there is no drag-to-reposition crop UI yet.
- The low-resolution image warning is intentionally simple.
- Very long pasted content can still require a higher recommended page count; the app warns but does not rewrite or cut the consultant's wording.
- Browser PDF rendering controls widows/orphans only partially.
- There is no database, authentication or draft saving by design.

## QA Notes

Tested locally with demo data for:

- 3-page, 5-page, 8-page, 9-page and 10-page PDF exports
- A4 portrait media size
- Page number/footer rendering
- Mandatory field validation
- PSP logo and council logo presence
- Selectable text extraction
- Contact page fit after compact layout adjustments

Useful checks:

```bash
npm run build
npm run lint
```

The seeded demo content is in `src/data/demoPack.js`, so the app is usable immediately after launch.
