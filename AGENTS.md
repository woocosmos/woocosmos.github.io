# woocosmos.github.io

A personal blog built with Jekyll and hosted on GitHub Pages, forked from [kiko-now](https://github.com/aweekj/kiko-now). This blog features Korean language content with custom search functionality, TF-IDF based keyword recommendations, and automated deployment workflows.

## Project Overview

**Tech Stack**: Jekyll (static site generator), SCSS, JavaScript, Python
**Deployment**: GitHub Pages with GitHub Actions for automation
**Key Features**:
- Custom search with TF-IDF keyword recommendations
- Table of Contents (TOC) for posts
- Tag-based navigation
- Timeline view
- Automated TF-IDF calculation and deployment

## Setup & Development

### Local Development
```bash
# Install Ruby dependencies
bundle install

# Serve locally (default: http://localhost:4000)
bundle exec jekyll serve

# Serve with drafts
bundle exec jekyll serve --drafts

# Build without serving
bundle exec jekyll build
```

### Python Requirements
```bash
# Install Python dependencies for TF-IDF calculations
pip install -r requirements.txt
```

## Project Structure

```
├── _posts/              # Blog posts in Markdown
├── _layouts/            # Jekyll layout templates
├── _includes/           # Reusable Jekyll components
├── _sass/               # SCSS stylesheets
├── assets/              # Static assets (CSS, JS)
├── images/              # Image files
├── tags/                # Tag pages
├── timeline/            # Timeline view
├── search/              # Search functionality
├── _config.yml          # Jekyll configuration
├── keywords.json        # TF-IDF keyword data
└── search.json          # Search index
```

## Writing Blog Posts

### Post Format
Posts must be created in `_posts/` directory with the naming convention:
```
YYYY-MM-DD-title.md
```

### Front Matter Template
```yaml
---
layout: post
title: "Your Post Title"
tags: [tag1, tag2, tag3]
comments: True
toc: True
---
```

### Content Guidelines
- Use Markdown for formatting
- Add appropriate tags for discoverability
- TOC requires `toc: True` in front matter; generated from `#`, `##`, `###` headings
- Images should be placed in `/images/` directory or use GitHub user-attachments URLs

## Build & Automation

### GitHub Actions Workflows
Located in `.github/workflows/`:
- **Automated deployment**: Builds and deploys on push to master
- **TF-IDF calculation**: Automatically runs Python script to update keyword recommendations

### Manual TF-IDF Update
```bash
# Calculate and update TF-IDF keywords
python assets/recommend.py
```

## Code Style

### Jekyll/Liquid Templates
- Use consistent indentation (2 spaces)
- Keep layout files focused and modular
- Leverage includes for reusable components

### SCSS
- Follow existing naming conventions
- Use variables defined in `_sass/` directory
- Maintain responsive design principles

### JavaScript
- Keep scripts minimal and focused
- Prioritize vanilla JS over libraries
- Ensure mobile compatibility

## Key Files to Know

### Configuration
- `_config.yml`: Site-wide settings, URLs, social links, plugins
- `Gemfile`: Ruby gem dependencies

### Data Files
- `keywords.json`: TF-IDF keyword recommendations (auto-generated)
- `search.json`: Search index for client-side search

### Custom Features
- **Search**: `/search/` directory contains search implementation
- **TOC**: Implemented in post layout
- **Back-to-top button**: Custom JS implementation
- **Hover effects**: Opacity-based transition on links (`opacity: .6`)

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `master` branch. The keyword update workflow additionally requires the commit message to contain "post" or the PR to originate from a `post/*` branch.

### URLs
- **Production**: https://woocosmos.github.io
- **Custom Domain**: Configured via `CNAME` file

## Common Tasks

### Adding a New Post
1. Create file in `_posts/` with format `YYYY-MM-DD-title.md`
2. Add front matter with title and tags
3. Write content in Markdown
4. Commit and push to master
5. Wait for GitHub Actions to deploy

### Updating Styles
1. Edit SCSS files in `_sass/`
2. Main stylesheet is `style.scss`
3. Test locally with `bundle exec jekyll serve`
4. Commit changes

### Adding/Modifying Tags
1. Tags are automatically generated from post front matter
2. Tag pages are in `/tags/` directory
3. Update tag template if needed

## Migration Notes

The blog is transitioning from a [previous Tistory blog](https://woo-niverse.tistory.com/). When migrating posts:
- Convert HTML to Markdown
- Update image paths
- Adjust internal links
- Preserve post dates in filename and front matter

## Mobile Optimization

- Currently being optimized for mobile UI
- Test responsive breakpoints when making layout changes
- Ensure touch-friendly navigation elements
- Verify readability on small screens

## Skills Reference

For specific tech stack guidance, refer to:
- `.claude/skills/yunsoolog/skills.md` — Project overview, workflows, known debt
- `.claude/skills/yunsoolog/guideline.md` — Admin guide in Korean
- `.claude/skills/scss/skills.md` — Styling, CSS audit, responsive design
- `.claude/skills/javascript/skills.md` — Search, scroll spy, tooltips
- `.claude/skills/html/skills.md` — Template hierarchy, includes, SVG
- `.claude/skills/markdown/skills.md` — Post authoring, Kramdown syntax
- `.claude/skills/jekyll/skills.md` — Config, plugins, Liquid, build commands
- `.claude/skills/devops/skills.md` — GitHub Actions, deployment, git workflow
- `.claude/skills/python/skills.md` — TF-IDF keyword scoring system

## Notes for Agents

- **Do not modify** `keywords.json` manually - it's auto-generated
- **Preserve Korean language** in content and UI elements
- **Check mobile responsiveness** after UI changes
- **Run local build** before committing layout changes
- **Maintain existing features** (TOC, search, back-to-top) when refactoring