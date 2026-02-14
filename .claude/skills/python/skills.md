# Python — Keyword Scoring Skills

## How Python Is Used

Python is **not part of the frontend**. It powers the keyword recommendation system that runs as a GitHub Actions job.

---

## File Map

| File | Role |
|---|---|
| `assets/recommend.py` | Main script: scans posts, computes TF-IDF scores, outputs `keywords.json` |
| `assets/word_manager.py` | Helper module for text processing |
| `assets/stopwords.txt` | Korean/English stopwords list |
| `assets/synoyms.pkl` | Pickled synonym mapping |
| `requirements.txt` | Python dependencies |
| `keywords.json` | Output: top keywords with scores (consumed by `present-keywords.js`) |

---

## Output Format (`keywords.json`)

```json
[
  ["전체 평균", 0.42],
  ["keyword1", 1.23],
  ["keyword2", 0.98],
  ["keyword3", 0.87],
  ["keyword4", 0.76],
  ["keyword5", 0.65]
]
```

- First entry: overall average TF-IDF score label
- Remaining entries: top 5 keywords ranked by score
- Consumed by `assets/present-keywords.js` on the search page

---

## Dependencies

- **konlpy** — Korean NLP library (morphological analysis)
  - Requires system packages: `g++`, `openjdk-8-jdk`
- Other deps listed in `requirements.txt`

---

## Running Locally

```bash
# Install system deps (macOS)
brew install openjdk

# Install Python deps
pip install -r requirements.txt

# Run keyword scoring
python assets/recommend.py

# Check what changed
git diff keywords.json
```

---

## When It Runs Automatically

Via `update-keywords.yml` GitHub Action:
- On PR merge from `post/*` branch to `master`
- On push to `master` with "post" in commit message

The Action commits the updated `keywords.json` back to `master`, which triggers a site rebuild.
