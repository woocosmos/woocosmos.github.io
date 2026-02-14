# YunsooLog — Project Overview & Workflow

## What This Is

Jekyll blog (Jekyll Now v1.2.0, kiko-now theme) deployed via GitHub Actions to GitHub Pages.

- **Site name:** YunsooLog
- **Author:** Yunsoo Woo (ML Engineer)
- **Source branch:** `master`
- **Deploy branch:** `gh-pages` (auto-built by `jeffreytse/jekyll-deploy-action`)
- **URL:** https://woocosmos.github.io
- **Push to master = auto deploy.** Every push triggers two GitHub Actions: site build and keyword update.

---

## Architecture

```
_config.yml              # Site metadata, navigation, plugins, pagination
index.html               # Home (paginated post list)
about.md                 # About page with timeline component
_layouts/
  default.html           # Master shell (head + nav + content + footer)
  post.html              # Single post (title, date, tags, TOC, prev/next, Disqus)
  page.html              # Static pages (About, Tags, Timeline, Search)
_includes/
  head.html              # <head>: meta, CSS, KaTeX math
  nav.html               # Top masthead: avatar, site name, nav links, search icon
  footer.html            # SVG social icons + copyright
  fonts.html             # Async Spoqa Han Sans font loading
  meta.html              # SEO + Open Graph meta tags
  top.html               # Back-to-top button (inline JS)
  disqus.html            # Disqus comments
  svg-icons.html         # Social link SVG icons
  analytics.html         # Google Analytics (inactive)
_sass/
  _variables.scss        # Design tokens: colors, fonts, sizes, breakpoint (768px), mixins
  _reset.scss            # Meyer CSS reset
  _open-color.scss       # Open Color palette ($oc-* variables)
  _highlights.scss       # Syntax highlighting
style.scss               # ALL visual CSS (~1178 lines, monolithic)
assets/
  scroll-spy.js          # TOC scroll spy for post sidebar
  jekyll-search.js       # Simple-Jekyll-Search v1.7.4 (bundled)
  search-and-return.js   # Search init: result template, highlight, match counter
  present-keywords.js    # Renders keyword chips from keywords.json with tooltips
  recommend.py           # TF-IDF keyword scoring script (run by GitHub Actions)
search/index.html        # Search page
tags/index.html          # Tag cloud + posts by tag
timeline/index.html      # Year-grouped archive
search.json              # Jekyll-generated search index
keywords.json            # Auto-generated keyword scores
```

---

## Deploy Pipeline

```
You write/edit _posts/YYYY-MM-DD-slug.md
        |
        v
   git push master  (or merge PR from post/* branch)
        |
        +---------------------------+
        v                           v
  build-jekyll.yml           update-keywords.yml
  (jekyll build)             (python recommend.py)
        |                           |
        v                           v
  Push _site/ ->              Commit updated
  gh-pages branch             keywords.json -> master
        |                           |
        v                           +-> re-triggers build-jekyll.yml
  GitHub Pages serves
  gh-pages branch
        |
        v
  Live at woocosmos.github.io
```

---

## Skill: new-post

Create a new blog post with the correct naming convention and front matter.

**Steps:**
1. Generate filename as `_posts/YYYY-MM-DD-<slug>.md` using today's date
2. Ask for title, tags, and whether TOC is needed
3. Write the file with this front matter:

```yaml
---
layout: post
title: "<title>"
tags: [<tags>]
comments: True
toc: True
---
```

**Existing tags for reference** (check `tags/index.html` or run `grep -h "^tags:" _posts/*.md | sort -u`):
Use existing tag names when possible to avoid fragmentation.

**Notes:**
- Slug should be lowercase, hyphen-separated, ASCII-friendly
- Posts dated in the future will not appear until that date
- Posts with `1996-*` dates are test/template files — don't use that pattern

---

## Skill: serve

Build and preview the site locally before pushing.

**Command:**
```bash
bundle exec jekyll serve --livereload
```

**With drafts (files in `_drafts/`):**
```bash
bundle exec jekyll serve --livereload --drafts
```

**Notes:**
- Site is built to `_site/` (gitignored from deploy via `exclude` in `_config.yml`)
- Default local URL: `http://127.0.0.1:4000`
- If `bundle` fails, run `bundle install` first
- Changes to `_config.yml` require a restart; all other files hot-reload

---

## Skill: deploy-check

Pre-push verification before deploying.

**Checks to run:**

1. **Build succeeds locally:**
   ```bash
   bundle exec jekyll build
   ```
   If this fails, the GitHub Action will also fail.

2. **No secrets or unintended files staged:**
   ```bash
   git status
   git diff --cached --name-only
   ```
   Watch for: `.env`, credentials, `_site/` directory, large binary files.

3. **Config validity:**
   - `_config.yml` parses without errors (the build check covers this)
   - Navigation URLs in `_config.yml` match existing pages

4. **Asset references:**
   - All images referenced in posts exist locally or are valid external URLs
   - JS files referenced in templates exist under `assets/`

5. **Reminder:** Push to `master` triggers:
   - `build-jekyll.yml` — rebuilds and deploys to `gh-pages`
   - `update-keywords.yml` — runs `recommend.py` if commit message contains "post" or a `post/*` PR was merged (which then triggers another deploy)

---

## Skill: review-post

Review a post file before publishing.

**What to check:**

1. **Front matter validity:**
   - Required fields: `layout: post`, `title`, `tags`
   - `tags` should be an array: `[Tag1, Tag2]`
   - `comments: True` and `toc: True` if intended (note: Python-style `True`, not yaml `true` — both work in Jekyll)

2. **Image references:**
   - External images (GitHub user-attachments) — verify URLs are accessible
   - Local images — verify files exist under `images/`
   - Check `{: width="80%"}` Kramdown syntax is correct

3. **Tag consistency:**
   - Compare post tags against existing tags used across all posts
   - Warn if creating a brand-new tag (may be intentional, but could be a typo)

4. **Content checks:**
   - KaTeX math delimiters: `$...$` (inline), `$$...$$` or `\[...\]` (display)
   - Code blocks: triple backtick with language identifier
   - Internal links use `{{ site.baseurl }}` or relative paths

---

## Known Technical Debt

| Issue | Location | Impact |
|---|---|---|
| Monolithic CSS | `style.scss` (1178 lines) | Hard to find/modify specific styles |
| `a { display: inline-block }` global | `style.scss:101` | Links inside paragraphs don't wrap naturally |
| `top.html` included twice on post pages | `default.html` + `post.html` | Back-to-top button script loaded twice |
| IE9 conditionals | `head.html`, `svg-icons.html` | Dead code, safe to remove |
| Legacy font loading | `fonts.html` (WebFont.js 1.5.18) | Could use modern `@font-face` with `font-display: swap` |
| Timeline duplication | `style.scss:887-1125` | Desktop and mobile styles are copy-pasted |
| Semantic HTML issues | `search/index.html` (`<ul>` wrapping `<div>` and `<input>`) | Works but invalid HTML |
| Hardcoded colors in JS | `search-and-return.js`, `present-keywords.js` | Not controlled by SCSS variables |
