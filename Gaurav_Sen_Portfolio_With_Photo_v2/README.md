# Gaurav Sen — Marketing & Growth Portfolio (Review Build)

This is a complete static website based on the original Portfolio Website Builder v1.0 kit. The original MIT license is preserved.

## Preview

Open `index.html` in a browser, or serve this folder locally using `python3 -m http.server 8000` and visit `http://localhost:8000`.

## Included content

- Results-led split hero with the user-provided stage photograph on the right and a four-metric proof strip.
- Seven projects: Greystar, Zepto, Fireflies CommitLoop, LinkedIn AI Content Automation, Uber, Twitter/X and Swiggy.
- Five professional roles, education, credentials, skills and public contacts.
- Native responsive design, projects filter, expandable case studies, system/light/dark theme with user override.

## Exclusions and limitations

- The user-supplied speaking-on-stage portrait is included as `assets/gaurav-sen-speaking.webp` and displayed on the right of the desktop homepage hero. Project screenshots have not been supplied; the project cards use geometric design placeholders.
- No downloadable resume is included: explicit public-download approval wasn't supplied.
- No confidential Drive PDFs are included or linked. The connected Drive files may not be public.
- Spotify Collaborative Playlist is omitted because a completed evidence-backed case study could not be recovered.
- Swiggy and the AI content app are described conservatively; no speculative performance achievements are claimed.
- This is a **review build**. Proofread content and verify facts before publishing.

## Deploy with GitHub and Vercel

1. Unzip and upload the **contents** of this folder to a GitHub repository. `index.html` should be at the repository root.
2. In Vercel, import the repository; Framework Preset: `Other`; Root Directory: `./` (directory containing `index.html`); Build Command: empty; Output Directory: `.`.
3. No npm install, server, paid font, API key or environment variables are required.
4. Set the final URL in `portfolio.js > profile.siteUrl` and add matching static canonical and `og:url` tags to `index.html` only **after** the site URL exists. Add `og:image` only if you have a real public preview image.

## Edit content

All portfolio content lives in `portfolio.js`. All layout and design styling lives in `styles.css`. Renderer logic is in `app.js`. Section structure is in `index.html`.

MIT license from the source kit: copyright (c) 2026 Gaurav Sen.
