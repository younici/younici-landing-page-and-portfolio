# Younici — landing page & portfolio

One page, two views: a short landing page about me and a portfolio grid whose
projects are pulled live from the GitHub API. Design language is iOS-style
liquid glass over a photo background.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the build
```

## What is where

| Path | What it does |
| --- | --- |
| `src/config/profile.js` | **everything personal**: GitHub login, birth date, email, social links, pinned/hidden repos |
| `src/i18n/translations.js` | all UI copy in `en` / `ru` / `ua` (name, role, tagline included) |
| `src/i18n/index.jsx` | language detection (saved choice → browser language → English) |
| `src/hooks/useGitHub.js` | repo list + README fetching, session cache, language colours |
| `src/components/GlassSegmented.jsx` | the draggable slider used by both the header and the footer |
| `src/styles/glass.css` | the glass material (`.glass`, `.gloss`, hairlines, sheen) |
| `src/styles/base.css` | tokens, background layers, view stack |
| `images/first_bg.jpeg` | background photo |

## How the switching works

`--vp` ("view progress") is a registered CSS custom property that goes from
`0` (landing) to `1` (portfolio):

- at rest it is set by `html[data-view]` and animated by a CSS transition;
- while the header thumb is dragged, JS writes it every pointer move, so the
  cross-fade, the slide and the accent colour follow the finger;
- accents are `color-mix()` of a cool and a warm colour driven by the same
  number, which is why the whole page warms up on the portfolio side.

Fading is applied per glass surface (`.vfade`) instead of on a wrapper: an
ancestor with `opacity` would become a backdrop root and the panels would lose
their refraction mid-transition.

## Things worth knowing

- The GitHub API is called without a token: 60 requests/hour per IP. Results
  are cached in `sessionStorage` for 30 minutes, READMEs are fetched only when
  a project is opened.
- Content coming from GitHub (repo names, descriptions, READMEs) is never
  translated — only the interface is.
- Age is calculated from `birthDate`; the date itself is never rendered.

## SEO

The site is meant to be found by **Kostiantyn Reksha / Костянтин Рекша / younici** on
`https://younici.com/`.

What is already in place:

- `index.html` — title, description and keywords built around the name, the surname
  and the nick; canonical URL; `robots` with `max-image-preview:large`.
- Open Graph + Twitter card with `public/og-image.jpg` (1200×630, generated from the
  background photo), so links look right in Google previews, Telegram, Discord and
  LinkedIn.
- JSON-LD `@graph` with `Person` (all name spellings in `alternateName`, `sameAs` to
  GitHub / LinkedIn / Instagram), `WebSite` and `ProfilePage` — this is what feeds
  Google's entity understanding of "who is younici".
- `public/robots.txt` + `public/sitemap.xml`.
- `<noscript>` block with the same facts, for crawlers that do not execute JS.
- One `<h1>` (the name), `<h2>` for the projects section, `<h3>` per project, `alt` on
  every image.
- `public/CNAME` for GitHub Pages on a custom domain.

Still to do by hand, outside the code — these matter more than markup for a brand-new
domain:

1. Serve the site over HTTPS on `younici.com` and redirect `www` → apex (the canonical
   points at `https://younici.com/`).
2. Add the site in [Google Search Console](https://search.google.com/search-console),
   submit `https://younici.com/sitemap.xml`, then "Request indexing" for the homepage.
3. Link back to `younici.com` from the places Google already trusts — GitHub profile
   (Website field), LinkedIn (contact info), Instagram bio. Reciprocal links are what
   confirm the `sameAs` claims.
4. Set the full name "Kostiantyn Reksha" on the GitHub profile, so the nick and the
   name are connected on a high-authority page too.
5. If the OG image or the copy changes, regenerate/update `sitemap.xml`'s `lastmod`.
