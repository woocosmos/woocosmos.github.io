# DevOps — GitHub Actions & Deployment Skills

## How Deployment Works

Push to `master` triggers two GitHub Actions workflows that run in parallel on `ubuntu-latest` runners.

---

## Workflow 1: `build-jekyll.yml` — Build & Deploy

**Trigger:** Every push to `master`

**What it does:**
1. Checks out the repo
2. Restores cache (`.asdf/`, `vendor/bundle`)
3. Uses `jeffreytse/jekyll-deploy-action@master` to:
   - Install Ruby + Jekyll in the runner
   - Run `jekyll build`
   - Force-push built `_site/` to `gh-pages` branch
4. GitHub Pages serves `gh-pages`

**Config:**
```yaml
provider: 'github'
token: ${{ secrets.GITHUB_TOKEN }}
branch: 'gh-pages'
jekyll_src: './'
ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
```

**Why not GitHub's built-in Jekyll?**
GitHub Pages runs Jekyll in safe mode, which blocks custom plugins like `jekyll-toc`. Building via Actions gives full plugin support.

---

## Workflow 2: `update-keywords.yml` — Keyword Scoring

**Trigger:** Conditional — fires on:
- PR merged from `post/*` branch to `master`
- Push to `master` where commit message contains "post"

**What it does:**
1. Checks out repo
2. Sets up Python 3.8 + system deps (`g++`, `openjdk-8-jdk` for konlpy)
3. Installs Python deps from `requirements.txt`
4. Runs `assets/recommend.py` (TF-IDF keyword scoring)
5. If `keywords.json` changed, commits and pushes to `master`
6. That push re-triggers Workflow 1 for a fresh deploy

**Chain reaction:** keyword update commit -> triggers build-jekyll -> fresh deploy

---

## Git Workflow

- **`master`** — source of truth, triggers deploy on push
- **`gh-pages`** — deploy target (auto-managed by Actions, never edit manually)
- **`post/*`** — feature branches for new posts (e.g., `post/github-actions`)
- Merge `post/*` into `master` via PR to trigger both workflows

---

## Secrets Required

| Secret | Used By | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | `build-jekyll.yml` | Auto-provided by GitHub Actions for repo access |
| `SSH_PRIVATE_KEY` | `build-jekyll.yml` | SSH key for pushing to `gh-pages` (avoids HTTP 400 errors) |

---

## Skill: search-keywords (local preview)

Preview keyword scoring locally before the GitHub Action runs it.

**Command:**
```bash
python assets/recommend.py
```

**Prerequisites:**
- Python 3.8+
- Dependencies: `pip install -r requirements.txt`
- System dependencies: `g++`, `openjdk-8-jdk` (for konlpy)

**Check the diff:**
```bash
python assets/recommend.py && git diff keywords.json
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Deploy fails with HTTP 400 | `jekyll-deploy-action` HTTP push issue | Use SSH: add `ssh_private_key` to workflow |
| Keywords not updating | Commit message doesn't contain "post" | Include "post" in message, or use a `post/*` branch |
| Build fails in Actions | Missing gem or plugin | Test locally with `bundle exec jekyll build` first |
| `gh-pages` out of date | Workflow didn't trigger | Check Actions tab; push to `master` to re-trigger |
