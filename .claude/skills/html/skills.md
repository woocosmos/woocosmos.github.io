# HTML — Markup Skills

## How HTML Works in This Project

HTML is authored through **Jekyll layouts, includes, and page files** using Liquid templating. The final HTML is generated at build time.

### Template Hierarchy

```
_layouts/default.html          <-- every page starts here
  ├── _includes/head.html      <-- <head> tag
  ├── _includes/nav.html       <-- masthead + navigation
  ├── {{ content }}             <-- page-specific content injected here
  │     ├── _layouts/post.html         (for blog posts)
  │     ├── _layouts/page.html         (for Tags, Timeline, Search, About)
  │     └── index.html                 (for home page)
  ├── _includes/footer.html    <-- social icons + copyright
  ├── _includes/analytics.html <-- Google Analytics (inactive)
  └── _includes/top.html       <-- back-to-top button
```

### Includes Reference

| File | What It Renders |
|---|---|
| `head.html` | `<head>`: charset, viewport, title, CSS link, KaTeX CDN, cookie |
| `meta.html` | SEO meta tags, Open Graph (`og:title`, `og:description`) |
| `fonts.html` | Async font loading via WebFont.js (Spoqa Han Sans) |
| `nav.html` | Header: avatar image, site name, description, nav links, search SVG icon |
| `footer.html` | Calls `svg-icons.html` + copyright text from `_config.yml` |
| `svg-icons.html` | Inline SVG icons for social links (GitHub, LinkedIn, email, etc.) |
| `top.html` | Back-to-top floating button (inline minified JS) |
| `disqus.html` | Disqus comment embed script |
| `analytics.html` | Google Analytics (no tracking ID configured) |

---

## Page Files

| File | Layout | Content |
|---|---|---|
| `index.html` | `default` | Paginated post list with excerpts, tags, dates |
| `about.md` | `page` | Profile, horizontal timeline component, contact info |
| `tags/index.html` | `page` | Tag cloud + posts grouped by each tag |
| `timeline/index.html` | `page` | Posts grouped by year |
| `search/index.html` | `page` | Keyword chips + search input + results container |

---

## External Resources Loaded

| Resource | Where | Purpose |
|---|---|---|
| KaTeX CSS + JS | `head.html` | Math rendering (`$`, `$$`, `\[` delimiters) |
| WebFont.js | `fonts.html` | Async Spoqa Han Sans Korean font loading |
| Font Awesome CSS | `search/index.html` only | Icons in search results (`fa-book`, `fa-clock`, `fa-tag`, `fa-pencil-alt`) |
| Disqus embed.js | `disqus.html` | Comment system on posts |

---

## SVG Usage

SVGs are used inline (not as external files):

- **Search icon** — `nav.html`: magnifying glass SVG in the navigation bar
- **Social icons** — `svg-icons.html`: GitHub, LinkedIn, email, Dribbble, etc. (conditionally rendered based on `_config.yml` footer-links)
- **Tag icon** — `tags/index.html`: feather tag icon next to each tag heading
- **Info icon** — `present-keywords.js`: question-mark circle SVG for keyword tooltip

---

## Known Issues

| Issue | Location | Detail |
|---|---|---|
| Invalid nesting | `search/index.html` | `<ul class="search">` wraps `<div>` and `<input>` — `<ul>` should only contain `<li>` |
| IE9 conditionals | `head.html` | `<!--[if lt IE 9]>` html5shiv — dead code in 2026 |
| IE9 fallbacks | `svg-icons.html` | `<!--[if lt IE 9]><em>...</em><![endif]-->` on every social icon |
| HTTP in head.html | `head.html:8` | html5shiv loaded over `http://` not `https://` |
| Duplicate class attr | `tags/index.html:27,37` | SVG has `class` attribute declared twice |
| `top.html` double include | `default.html` + `post.html` | Back-to-top button rendered twice on post pages |
