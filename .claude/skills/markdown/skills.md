# Markdown — Post Authoring Skills

## How Markdown Works in This Project

Posts are written in **Kramdown-flavored Markdown**, rendered by Jekyll with GFM (GitHub Flavored Markdown) input mode and Rouge syntax highlighting.

Config from `_config.yml`:
```yaml
kramdown:
  input: GFM
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    css_class: 'highlight'
```

---

## Post Front Matter

Every post requires YAML front matter:

```yaml
---
layout: post
title: "Post Title Here"
tags: [Tag1, Tag2]
comments: True
toc: True
---
```

| Field | Required | Values |
|---|---|---|
| `layout` | Yes | Always `post` |
| `title` | Yes | String (quoted if contains special chars) |
| `tags` | Yes | Array of tag names: `[ML, Python]` |
| `comments` | No | `True` to enable Disqus comments |
| `toc` | No | `True` to render table of contents sidebar |

---

## Kramdown-Specific Syntax

This project uses Kramdown attribute syntax that standard Markdown doesn't support:

```markdown
<!-- Image width -->
![image](url){: width="80%"}

<!-- CSS class on element -->
#### Title
{: .center}

<!-- Multiple attributes -->
![image](url){: style='border:black solid 0.5px;' width='40%'}{: .center-image}
```

---

## Math (KaTeX)

KaTeX is loaded in `head.html` and configured for these delimiters:

| Syntax | Rendering |
|---|---|
| `$...$` | Inline math |
| `$$...$$` | Display (block) math |
| `\[...\]` | Display (block) math |

---

## Code Blocks

Use fenced code blocks with language identifier for syntax highlighting:

````markdown
```python
def hello():
    print("hello")
```
````

Highlighting is powered by Rouge, styled by `_sass/_highlights.scss`.

---

## Liquid in Posts

When writing about Liquid/Jekyll in a post, escape with raw tags:

```
{% raw %}{{ variable }}{% endraw %}
```

Without `{% raw %}...{% endraw %}`, Jekyll will try to evaluate the Liquid expression.

---

## Image Hosting

Two patterns are used:

1. **Local images:** `../images/filename.ext` or `/images/filename.ext`
2. **GitHub user-attachments:** `https://github.com/user-attachments/assets/...`

---

## Post File Naming

```
_posts/YYYY-MM-DD-slug-title.md
```

- Date determines sort order and URL (via permalink `/:title/` in `_config.yml`)
- Slug should be lowercase, hyphen-separated, ASCII-friendly
- Posts dated in the future won't appear until that date
- Files with `1996-*` dates are test/template files

---

## Existing Tags

Check current tags before creating new ones to avoid fragmentation:
```bash
grep -h "^tags:" _posts/*.md | sort -u
```

Tags are displayed on:
- Post headers (linked to `/tags/#tagname`)
- Tag cloud page (`tags/index.html`)
- Search results (via `search-and-return.js`)
