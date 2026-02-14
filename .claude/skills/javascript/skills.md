# JavaScript — Scripting Skills

## How JS Works in This Project

All JavaScript is **vanilla** — no frameworks, no bundler, no npm, no build step. Scripts are loaded directly via `<script>` tags in templates.

### File Map

| File | Role | Loaded In |
|---|---|---|
| `assets/scroll-spy.js` | TOC scroll spy — highlights active heading in sidebar nav | `_layouts/post.html` (only when `toc: True`) |
| `assets/jekyll-search.js` | Simple-Jekyll-Search v1.7.4 (bundled library) | `search/index.html` |
| `assets/search-and-return.js` | Initializes search: result template, highlight middleware, match counter | `search/index.html` |
| `assets/present-keywords.js` | Fetches `keywords.json`, renders keyword chips with tooltip scores | `search/index.html` |
| `_includes/top.html` | Back-to-top button (minified inline JS) | `_layouts/default.html` + `_layouts/post.html` |

### Load Order on Search Page
```html
<script src="/assets/present-keywords.js"></script>     <!-- 1. keyword chips -->
<script src="/assets/jekyll-search.js"></script>          <!-- 2. search library -->
<script src="/assets/search-and-return.js"></script>      <!-- 3. search init -->
```

---

## Patterns & APIs Used

- **DOM manipulation:** `document.querySelector`, `querySelectorAll`, `createElement`, `addEventListener`, `classList.add/remove`, `innerHTML`
- **Fetch API:** `present-keywords.js` uses `async/await` with `fetch()` to load `keywords.json`
- **XMLHttpRequest:** `jekyll-search.js` uses XHR (legacy pattern from the bundled library)
- **Event handling:** scroll events (scroll spy), input events (search), mouse/touch events (tooltips)
- **Regex:** search highlighting uses `new RegExp(searchTerm, "gi")` and `String.replace` with `$&` back-reference

### Not Used
- No ES modules (`import`/`export`)
- No TypeScript
- No `async/await` except in `present-keywords.js`
- No npm / package.json
- No bundler (webpack, vite, etc.)

---

## File Details

### `scroll-spy.js`
- Listens to `window.scroll` event
- Finds all TOC entries (`.nav-toc ul.section-nav li.toc-entry`)
- Maps them to anchor targets in the document
- Adds `.active` class to the link whose section is currently visible (offset: 300px from top)

### `jekyll-search.js`
- Bundled third-party library (Simple-Jekyll-Search v1.7.4)
- **Modified:** `createStateChangeListener` at line 231 has a custom sanitizer that strips non-alphanumeric/Korean characters via regex
- Provides `window.SimpleJekyllSearch` constructor
- Supports fuzzy and literal search strategies
- Reads data from `search.json` (Jekyll-generated index of all posts)

### `search-and-return.js`
- Initializes `SimpleJekyllSearch` with config:
  - `searchInput`: `#search-input`
  - `resultsContainer`: `#results-container`
  - `json`: `/search.json`
- Defines the result template using Font Awesome icons (`fa-book`, `fa-clock`, `fa-tag`, `fa-pencil-alt`)
- `templateMiddleware` function handles:
  - **Tag highlighting:** wraps matches in `<b style="background:gold">`, links tags to `/tags/#tagname`
  - **Title highlighting:** wraps matches in `<span style="background:gold">`
  - **Content truncation:** shows ~30 words around the match, displays match count
- Clears search input on `pageshow` (back navigation)

### `present-keywords.js`
- Fetches `keywords.json` (format: `[[avg_label, avg_score], [keyword1, score1], ...]`)
- Creates "이런 키워드는 어때요?" heading with info tooltip (SVG icon)
- For each keyword: creates a clickable `<span>` chip that populates the search input
- Tooltips show TF-IDF rank and score on hover
- `window.onload = loadTags` — runs after page load

### `_includes/top.html` (back-to-top)
- Heavily minified `addBackToTop()` function
- Creates a fixed-position circular button at bottom-right
- Shows/hides based on scroll position
- Smooth-scrolls to top on click
- **Known issue:** included in both `default.html` and `post.html`, so it loads twice on post pages

---

## Known Issues

| Issue | Location | Detail |
|---|---|---|
| Inline styles in JS | `search-and-return.js` | `style="background:gold"`, `style="color:#343a40"` — should be CSS classes |
| Inline styles in JS | `present-keywords.js` | Tooltip positioning via inline `style.left`/`style.top` |
| Back-to-top loaded twice | `_includes/top.html` | Included in both `default.html` and `post.html` |
| Modified library | `jekyll-search.js:231` | Custom sanitizer in third-party code — easy to lose on updates |
| `event.preventDefault()` with `{ passive: true }` | `present-keywords.js:50,57` | `preventDefault` is ignored in passive listeners — contradictory |
| Global `window.onload` | `present-keywords.js:112` | Overwrites any other `onload` handler — should use `addEventListener` |
