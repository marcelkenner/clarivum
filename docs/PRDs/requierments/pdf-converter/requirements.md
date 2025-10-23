# Feature Requirements — PDF & EPUB Generation

> **Canonical decision:** Align implementation with `docs/adr/ADR-024-ebooks-and-digital-products.md`, which codifies the dual-path export strategy (Playwright for replicas, React-PDF for bespoke documents) and EPUB 3 support.

## Objective
- Deliver downloadable PDFs and EPUB 3 e-books generated from Clarivum’s React/Next.js content without sacrificing fidelity or accessibility.
- Support both “pixel-perfect” exports of existing pages (lead magnets, gated guides) and bespoke printable layouts for digital products.

## Target Outcomes
- Business: enable marketing and ecommerce teams to launch polished lead magnets and paid digital products with minimal engineering turnaround.
- Experience: PDFs must mirror the intended layout, while EPUB output remains fully accessible and reflowable across reading systems.

## Decision Snapshot
- **Rendering defaults (per ADR-024):**
  - Use **Playwright** (Chromium) for exports that must mirror live pages with Tailwind styling or interactive charts.
  - Use **`@react-pdf/renderer`** for bespoke printable guides assembled from reusable React components with controlled pagination.
- **EPUB output:** Produce EPUB 3 via scripted conversion (Pandoc/`epub-gen`) from semantic HTML/Markdown so accessibility is preserved alongside PDFs.

## Generation Strategies

| Strategy | Ideal use cases | Implementation notes |
| --- | --- | --- |
| **Headless browser rendering** (Playwright or Puppeteer) | Exact reproduction of rendered pages, including Tailwind styles, SVG, responsive layouts, and charts. | Launch a headless browser inside a server-only module or API route, navigate to the target URL or inject HTML via `page.setContent`, wait for `networkidle`, then call `page.pdf()`. Ensure the browser instance is closed to avoid leaks. Bundle Chromium dependencies for the deployment target (container or AWS Lambda). |
| **React-PDF (`@react-pdf/renderer`)** | Programmatic composition with React components, custom printable layouts, repeating headers/footers, dynamic data. | Render `<Document>` / `<Page>` component trees with Tailwind-inspired utility objects. Stream the result from an API route using `renderToStream()` or write to storage with `renderToFile()`. Disable wrapping with `wrap={false}` or insert page breaks with `break` as needed; apply `fixed` for persistent header/footer content. |
| **Declarative builders (PDFMake)** | Structured reports generated from data models (analytics summaries, invoices). | Compose JSON-based document definitions, then call `pdfMake.createPdf(docDefinition).getBuffer()` (Node) to return the binary. Requires re-implementing layout in the JSON DSL; limited React reuse. |
| **Low-level libraries (PDFKit, jsPDF)** | Lightweight tickets/receipts where manual drawing is acceptable. | Use drawing primitives for text/images. These libraries do not interpret CSS; avoid for marketing material. |
| **Cloud APIs (e.g., PDFBolt)** | Avoid shipping headless browsers or when workloads spike unpredictably. | Evaluate cost, latency, and data residency. Ensure DPAs cover uploaded content before adoption. |

## Implementation Guidelines

### Headless Browser Pipeline
1. Install Playwright (`npm i playwright`) or Puppeteer (`npm i puppeteer`).
2. Provide a server-side helper (e.g., `PdfGenerationManager`) scoped to API routes or background jobs.
3. Navigate to a live route or inject a static HTML string. For dynamic data, build the HTML using the same design tokens as the web experience.
4. Wait for asynchronous data (e.g., `await page.waitForLoadState('networkidle')` in Playwright).
5. Generate the PDF with customised `format`, `margin`, `preferCSSPageSize`, and `printBackground` flags.
6. Stream the binary to the response (`res.setHeader('Content-Type', 'application/pdf')`) or upload to Supabase Storage via signed URLs.
7. Close the browser and recycle the instance to avoid exceeding memory limits.

### React-PDF Pipeline
1. Install `@react-pdf/renderer` and whitelist it via `experimental.serverComponentsExternalPackages` if using App Router.
2. Encapsulate document layout as view models and components (`DocumentViewModel`, `PdfLayoutCoordinator`) that mirror OOP guidelines.
3. Bind dynamic data via props and reuse shared design tokens; define Tailwind-like utility objects for spacing/typography.
4. Generate output using `renderToStream(<MyDocument />)` for direct HTTP streaming or `renderToFile()` for background jobs.
5. Use `fixed` elements for headers/footers, `wrap={false}` to prevent unwanted pagination, and `break` props to force new pages.
6. Cache expensive assets (fonts, images) and preload them to prevent repeated downloads.

### Shared Concerns
- **Deployment:** Package Playwright/Puppeteer binaries in the CI pipeline; for serverless, prefer containerised functions or queue-triggered workers.
- **Security:** Sanitize user input before injecting into PDFs. Ensure temporary files are deleted immediately after use.
- **Performance:** For high-traffic exports, offload generation to background jobs and email links to users once ready.
- **Monitoring:** Emit telemetry (`PdfGenerationManager.create`) and capture duration, success/failure, and page count for observability dashboards.

## Accessibility Requirements for PDFs
- Use semantic source templates—`<h1>`…`<h6>`, lists, and landmark roles—to allow the headless renderer to emit tagged PDFs.[^equidox]
- Apply descriptive `alt` text for images that convey meaning; purely decorative images should be marked as artifacts.[^equidox]
- Maintain strong colour contrast and prefer sans-serif fonts for readability.[^equidox]
- Include document metadata (title, language) and – where possible – add bookmarks that mirror the heading structure.[^equidox]
- Avoid large, complex tables; provide summaries in body copy if dense data is unavoidable.[^equidox]

## Accessible EPUB Guidelines
- Use EPUB 3 for reflowable e-books; it is HTML-based and retains semantic structure.[^international]
- Format the source manuscript with consistent styled headings before conversion (Pandoc, `epub-gen`, or custom scripts can ingest semantic HTML).[^international]
- Provide `alt` text, captions, and descriptive link text across assets.[^international]
- Validate EPUB output against retailer requirements (Kindle, Apple Books, Kobo) to confirm accessible navigation and DRM impact.[^international]
- Supply alternatives for multimedia (transcripts, audio descriptions) and document any DRM constraints that hinder assistive technologies.[^international]

## Recommended Workflow
1. **Content preparation:** Ensure Strapi/Markdown content uses semantic HTML, alt text, and accessible tables.
2. **EPUB export:** Transform the prepared content into EPUB 3 using `epub-gen`, Pandoc, or another pipeline aligned with ADR-024. Run ACE by DAISY or similar validators.
3. **PDF export:**  
   - For page replicas (e.g., marketing landing pages), call the headless browser pipeline to render the existing route.  
   - For bespoke printable guides, render with React-PDF components.
4. **Asset storage:** Persist generated files in Supabase Storage with lifecycle rules and signed URLs.
5. **Quality checks:**  
   - Verify layout fidelity (visual QA).  
   - Run accessibility audits (screen reader spot checks, tagged PDF validation).  
   - Confirm metadata (title, language, author) is present.
6. **Distribution:** Provide both PDF and EPUB download options with clear descriptions; update marketing flows and emails accordingly.

## Validation Checklist
- [ ] Implementation adheres to ADR-024 dual-path rendering defaults.
- [ ] API routes/background jobs implement `PdfGenerationManager` and writer classes with proper dependency injection.
- [ ] Accessibility automated checks (PDF/UA where possible, ACE for EPUB) pass; manual spot checks completed.
- [ ] Supabase Storage paths versioned and protected; download links tested behind authentication where required.
- [ ] Observability metrics and alerts configured for generation failures or long runtimes.

## Open Questions & Next Steps
- Determine hosting constraints (Vercel serverless vs. dedicated workers) for Playwright workloads.
- Decide whether to run EPUB generation synchronously with PDF exports or move it to background jobs for large batches.
- Scope a task for retailer submission tooling (metadata packaging, ISBN handling) if Clarivum distributes through third-party stores.

[^equidox]: Equidox, “PDF Accessibility Checklist” — https://equidox.com/blog/pdf-accessibility-checklist/
[^international]: International Authors Forum summarising the Accessible Books Consortium guidance — https://internationalauthors.org/wp-content/uploads/Accessible-Publishing-Best-Practice-Guidelines.pdf
