# Jekyll — Static Site Generator Skills

## How Jekyll Works in This Project

Jekyll (v1.2.0 of Jekyll Now, kiko-now theme) reads source files from `master` branch and builds static HTML into `_site/`.

---

## Key Config (`_config.yml`)

```yaml
name: YunsooLog
description: 나름 진지한 ML Engineer
url: http://woocosmos.github.io
permalink: /:title/                  # URL pattern for posts
paginate: 5                          # Posts per page on index
paginate_path: /page:num/

kramdown:
  input: GFM
  syntax_highlighter: rouge

plugins:
  - jekyll-sitemap
  - jekyll-feed
  - jekyll-paginate
  - jekyll-toc
```

---

## Plugins

| Plugin | Purpose |
|---|---|
| `jekyll-sitemap` | Auto-generates `sitemap.xml` |
| `jekyll-feed` | Auto-generates Atom feed at `/feed.xml` |
| `jekyll-paginate` | Paginated post listing on `index.html` |
| `jekyll-toc` | Generates `{% toc %}` tag in post layout for table of contents |

All plugins are in `Gemfile`. GitHub Pages safe-mode doesn't support `jekyll-toc`, which is why the site builds via GitHub Actions instead of GitHub's built-in Jekyll.

---

## Liquid Templating

Key Liquid patterns used across the project:

```liquid
{{ site.name }}                    <!-- Config values -->
{{ page.title }}                   <!-- Page/post front matter -->
{{ content }}                      <!-- Rendered page content injected into layout -->
{{ post.excerpt | strip_html | truncatewords: 30 }}  <!-- Filters -->

{% for post in paginator.posts %}  <!-- Pagination loop -->
{% for tag in site.tags %}         <!-- All tags across site -->
{% include nav.html %}             <!-- Include partial -->
{% if page.toc %}                  <!-- Conditional -->
{% toc %}                          <!-- TOC plugin tag -->
```

---

## Navigation

Defined in `_config.yml`, rendered in `_includes/nav.html`:
```yaml
navigation:
  - name: About
    url: /about
  - name: Blog
    url: /
  - name: Tags
    url: /tags
  - name: Timeline
    url: /timeline
```
Search icon is hardcoded in `nav.html` (not in config).

---

## Build Commands

```bash
# Install dependencies
bundle install

# Build site (output to _site/)
bundle exec jekyll build

# Serve locally with live reload
bundle exec jekyll serve --livereload

# Serve with draft posts visible
bundle exec jekyll serve --livereload --drafts
```

**Notes:**
- Changes to `_config.yml` require server restart
- All other file changes hot-reload
- Default local URL: `http://127.0.0.1:4000`

---

## Directory Conventions

| Directory | Jekyll Role |
|---|---|
| `_posts/` | Blog post source files (Markdown) |
| `_layouts/` | HTML templates that wrap content |
| `_includes/` | Reusable HTML partials |
| `_sass/` | SCSS partials imported by `style.scss` |
| `_site/` | Build output (auto-generated, not committed) |
| `_drafts/` | Unpublished posts (not currently used) |

---

## Data Flow

```
_config.yml    -->  site.* variables available everywhere
_posts/*.md    -->  site.posts collection, paginator object
front matter   -->  page.* variables in layouts
_layouts/      -->  {{ content }} injection chain
_includes/     -->  {% include %} partials
_sass/         -->  @import into style.scss
```
