# SCSS — Styling Skills

## How Styling Works in This Project

All visual styling goes through **SCSS** (Sassy CSS), compiled by Jekyll's built-in Sass pipeline. No PostCSS, no Tailwind, no external CSS build step.

### File Map

| File | Role |
|---|---|
| `style.scss` | Main stylesheet (~1178 lines). ALL component styles live here. |
| `_sass/_variables.scss` | Design tokens: colors, fonts, sizes, mobile breakpoint, mixins |
| `_sass/_open-color.scss` | Open Color palette — provides `$oc-*` color variables |
| `_sass/_reset.scss` | Meyer CSS reset |
| `_sass/_highlights.scss` | Syntax highlighting for code blocks |

### Import Order (in `style.scss`)
```scss
@import "reset";        // 1. Reset
@import "open-color";   // 2. Color palette
@import "variables";    // 3. Project tokens + mixins
// ... all rules ...
@import "highlights";   // Last: syntax highlighting
```

---

## SCSS Features Used

- **Variables:** `$blue`, `$base-font`, `$oc-gray-8`, etc.
- **Nesting:** deeply used throughout (selectors, media queries, pseudo-elements)
- **`@import`:** four partial files imported into `style.scss`
- **`@mixin` / `@include`:**
  - `mobile` — responsive breakpoint at `max-width: 768px`
  - `transition($args...)` — vendor-prefixed transitions
- **Math:** `$dt-width + $dt-dd-space` for computed values

### Not Used (codebase predates these)
- No CSS Grid
- No CSS custom properties (`var()`)
- No `@layer`
- No `@use` / `@forward` (uses legacy `@import`)

---

## CSS Layout Patterns

| Pattern | Where |
|---|---|
| **Floats** | Masthead (`.site-avatar`, `.site-info`, nav), TOC sidebar, tag dates |
| **Flexbox** | Nav mobile, `.tags > .label`, `#search-container`, `.timeline`, `.tag-container` |
| **`position: sticky`** | TOC aside (`post.html` sidebar) |
| **`position: absolute`** | Timeline connectors and content blocks |
| **`position: fixed`** | Back-to-top button |

---

## Color System

Colors come from two sources:

1. **Open Color** (`_open-color.scss`): `$oc-gray-1` through `$oc-gray-9`, `$oc-blue-8`, `$oc-black`, etc.
2. **Project variables** (`_variables.scss`): semantic aliases like:
   ```scss
   $base-color: $oc-gray-8;
   $link-color: $oc-blue-8;
   $divider-color: $oc-gray-1;
   $tag-index-label-color: $base-color;
   ```
3. **Simple grays** (`_variables.scss`): `$black`, `$darkerGray`, `$darkGray`, `$gray`, `$lightGray`, `$white`

### Known color leaks (hardcoded outside SCSS)
- `#e6d4af`, `antiquewhite`, `bisque` — search keyword chips (in `style.scss` but not variablized)
- `#e0e0e0` — archive item border (in `style.scss`)
- `gold` — search highlight (in `search-and-return.js`)
- `#343a40` — search content text (in `search-and-return.js`)
- `#000`, `#007bff`, `#ffc107`, etc. — timeline (in `style.scss`, hardcoded not using variables)

---

## Responsive Design

Single breakpoint via mixin:
```scss
// in _variables.scss
@mixin mobile {
  @media screen and (max-width: 768px) {
    @content;
  }
}

// usage
.site-avatar {
  float: left;
  @include mobile {
    float: none;
    display: block;
    margin: 0 auto;
  }
}
```

---

## Skill: lint-scss

Audit the styling layer for common issues.

**What to check:**

1. **Hardcoded colors outside `_variables.scss`:**
   - Search `style.scss` for raw hex values (`#xxx`) that should be variables
   - Search JS files (`assets/*.js`) and HTML templates for inline `style="...color..."` or `style="...background..."`

2. **Inline styles in markup:**
   - `about.md` — `style="font-weight: 100;"`, `style='border:black solid 0.5px;...'`
   - `search-and-return.js` — inline `style="background:gold"` for highlights
   - `present-keywords.js` — inline tooltip styles
   - These should ideally be CSS classes in `style.scss`

3. **Duplicate/redundant rules in `style.scss`:**
   - Timeline CSS (desktop ~line 887, mobile override ~line 1029) is largely duplicated
   - `.search > .label` is declared twice (lines 754 and 760)
   - Commented-out code blocks (old `a` styles around line 89, table striping around line 234)

4. **Global side effects:**
   - `a { display: inline-block }` (line 101) affects all links — may cause inline text wrapping issues within paragraph text

---

## Skill: check-mobile

Audit for mobile responsiveness issues.

**What to check:**

1. **Elements without `@include mobile` overrides:**
   - The mixin is defined in `_variables.scss` at `max-width: 768px`
   - Search `style.scss` for pixel-based widths/margins/paddings without a mobile counterpart

2. **Known mobile issues:**
   - Timeline on `about.md`: horizontal layout uses absolute positioning with hardcoded pixels; mobile override uses fragile negative margins (`margin-inline: -80px` / `80px`)
   - `.container` padding (`padding-left: 50px; padding-right: 50px`) has no mobile override
   - TOC sidebar (`aside { margin-right: -300px }`) — no mobile handling; likely overflows or is hidden
   - Post pagination prev/next links may overflow on narrow screens with long titles

3. **Testing approach:**
   - Use browser DevTools responsive mode at 375px (iPhone SE), 768px (tablet breakpoint)

---

## Skill: refactor-css

Extract inline styles into proper SCSS.

**Process:**

1. **Find inline styles:**
   ```
   grep -rn 'style=' _posts/ _includes/ _layouts/ about.md search/ tags/ timeline/ assets/*.js
   ```

2. **For each inline style found:**
   - Create a semantic CSS class name
   - Add the rule to the appropriate section in `style.scss`
   - Replace `style="..."` with `class="..."` in the template
   - If the value should be variable (color, size), add it to `_variables.scss`

3. **Priority targets:**
   - `search-and-return.js`: search highlight styles (`background:gold`) -> `.search-highlight` class
   - `about.md`: timeline item font weights -> timeline SCSS section
   - `present-keywords.js`: tooltip positioning -> `.tooltip` already exists in `style.scss`, consolidate

---

## Section Map of `style.scss`

Approximate line ranges for navigating the monolith:

| Lines | Section |
|---|---|
| 1-15 | Imports |
| 17-27 | Base rules (html, body) |
| 29-44 | `.container` layout |
| 46-82 | Headings (h1-h6) |
| 84-133 | Text elements (p, a, em, strong, sub, sup, hr) |
| 135-219 | Lists (ol, ul, li, dt, dd) |
| 221-253 | Tables, blockquotes |
| 255-264 | Back-to-top button |
| 266-314 | Footnotes, images, selection |
| 316-340 | Clearfix, alignment utilities |
| 350-501 | Masthead, nav, TOC sidebar |
| 503-582 | Posts (list + single post styles) |
| 584-624 | Pagination |
| 626-884 | Archive, search, tags |
| 887-1125 | Timeline (desktop + mobile) |
| 1128-1177 | Footer |
