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
