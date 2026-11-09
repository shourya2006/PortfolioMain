# Shourya Bafna — Portfolio

A résumé-based portfolio reconstructed from the observed layout and shipped styles of devxsubh.com. The hero uses the illustration supplied by Shourya. Project previews for NextFlow and Vortex were captured from their live demo sites with REA; the waste-classifier preview is an evaluation summary based on the résumé.

## Run locally

```sh
npm install
npm run dev
```

Local preview: http://127.0.0.1:5173

## Build

```sh
npm run build
```

## Update content

- `app/page.tsx`: intro, skills strip, coding profiles
- `lib/home-sections.ts`: about, education, work history, skill areas
- `lib/projects.ts`: project details and source/demo links
- `public/images/shourya-hero.png`: supplied hero illustration
- `public/shourya-bafna-resume.pdf`: downloadable résumé
- `components/reference-header.tsx` and `reference-footer.tsx`: navigation and contact

No email address was supplied in the résumé, so contact links use the supplied LinkedIn profile.

## Motion and interactions

The reference motion was checked against its shipped components and REA browser captures. The portfolio includes the portrait/counting preloader, portrait-to-hero expansion, name reveal and hero handoff, rolling character labels, staggered mobile menu, category bottom sheet, masked scroll reveals, timeline accordions, portrait crossfades, image-fan hover, carousel controls, research metric flips, spring-driven service previews, screenshot lightboxes, and clipboard feedback. Keyboard controls and reduced-motion alternatives are included.

The technology strip uses local SVG logos. Pinecone’s white lockup comes from its official brand assets; the other technology marks use Simple Icons. Education transitions reuse the supplied illustration because no separate school photos were provided.

## Account previews

The four profile cards reveal account snapshots on hover or keyboard focus and show previews on touch devices. Snapshot date: 9 November 2026. LeetCode totals and Codeforces/CodeChef histories come from their official public account data. Their preview graphics visualize those responses because profile-page charts could not be captured reliably. The GitHub heat map is fetched from ghchart and cross-checked against public contribution data; it covers the trailing year, not calendar-year 2026.

## Contact form

All internal contact calls to action open the same accessible modal. `POST /api/contact` is handled in the Worker before the application router. The Resend key and delivery configuration are server-only runtime bindings: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_TO_EMAIL`. No key is included in the client bundle or source. Configure values in the hosted Site settings and redeploy to apply changes.

Validation, origin checks, a honeypot, bounded request sizes, transient rate limiting, timeout handling, escaped message HTML and idempotent retries are included. The UI reports success only after Resend returns a message id. Provider errors retain the form and show a retry path. Source tests never send email:

```sh
node --experimental-strip-types --test tests/contact-server.test.mjs
```
