# YunsooLog 블로그 관리 가이드

## 기본 원칙

- `master` 브랜치에 push하면 **자동으로 배포**된다
- 배포 전 반드시 **로컬에서 확인**하는 습관을 들이자
- 수정 후 브라우저에서 확인할 때는 **캐시를 비우고** 새로고침 (Cmd+Shift+R)

---

## 1. 새 포스트 작성하기

### 파일 생성

`_posts/` 폴더에 아래 형식으로 파일을 만든다:

```
_posts/YYYY-MM-DD-제목-슬러그.md
```

예시: `_posts/2026-02-15-new-topic.md`

> 슬러그는 영문 소문자, 하이픈으로 구분. 한글 사용 가능하나 URL이 길어지므로 영문 권장.

### 머리말 작성

파일 맨 위에 아래 내용을 넣는다:

```yaml
---
layout: post
title: "포스트 제목"
tags: [태그1, 태그2]
comments: True
toc: True
---
```

| 항목 | 설명 |
|---|---|
| `title` | 포스트 제목 (따옴표로 감싸기) |
| `tags` | 대괄호 안에 쉼표로 구분. **기존 태그를 우선 사용**할 것 |
| `comments` | Disqus 댓글 활성화 여부 |
| `toc` | 오른쪽 목차 사이드바 활성화 여부 |

### 기존 태그 확인

새 태그를 만들기 전에 기존 태그를 확인한다:

```bash
grep -h "^tags:" _posts/*.md | sort -u
```

### 본문 작성 팁

- **수식**: 인라인 `$수식$`, 블록 `$$수식$$`
- **코드 블록**: 백틱 3개 + 언어명 (```python)
- **이미지 크기 조절**: `![alt](url){: width="80%"}`
- **가운데 정렬**: 텍스트 아래에 `{: .center}` 추가
- **Liquid 코드를 본문에 표시**: `{% raw %}...{% endraw %}`로 감싸기

---

## 2. 로컬에서 미리보기

```bash
# 첫 실행 시 (한 번만)
bundle install

# 미리보기 서버 시작
bundle exec jekyll serve --livereload
```

브라우저에서 `http://127.0.0.1:4000` 접속.

- 파일 저장하면 자동으로 반영된다
- 단, `_config.yml` 수정 시에는 **서버를 재시작**해야 한다 (Ctrl+C 후 다시 실행)

---

## 3. 배포하기

### 방법 A: master에 직접 push

```bash
git add _posts/2026-02-15-new-topic.md
git commit -m "post: 새 포스트 제목"
git push origin master
```

> 커밋 메시지에 **"post"**를 포함하면 키워드 자동 업데이트가 함께 실행된다.

### 방법 B: 브랜치 사용 (권장)

```bash
git checkout -b post/new-topic
# ... 작성 ...
git add .
git commit -m "post: 새 포스트 제목"
git push origin post/new-topic
```

GitHub에서 PR 생성 후 master로 merge. merge 시 키워드 업데이트 + 빌드 배포가 자동 실행된다.

### 배포 확인

push 후 [Actions 탭](https://github.com/woocosmos/woocosmos.github.io/actions)에서 워크플로 상태를 확인한다. 초록색 체크가 뜨면 배포 완료.

---

## 4. 기존 포스트 수정하기

`_posts/` 안의 해당 `.md` 파일을 직접 수정하면 된다.

- 파일명(날짜)을 바꾸면 URL이 변경되므로 주의
- `title`을 바꿔도 URL은 변하지 않는다 (URL은 파일명의 슬러그 기준)
- 수정 후 로컬 미리보기 → push

---

## 5. 스타일(CSS) 수정하기

### 어디를 수정해야 하나?

| 바꾸고 싶은 것 | 수정할 파일 |
|---|---|
| 색상, 폰트 크기, 여백 등 **디자인 토큰** | `_sass/_variables.scss` |
| 특정 컴포넌트의 모양 | `style.scss` (아래 섹션 참고) |
| 코드 하이라이팅 색상 | `_sass/_highlights.scss` |

### `style.scss` 내 위치 가이드

| 줄 번호(대략) | 영역 |
|---|---|
| 17~44 | 기본 레이아웃 (html, body, container) |
| 46~82 | 제목 (h1~h6) |
| 84~133 | 텍스트 (a, p, em, strong, hr) |
| 135~219 | 리스트 (ol, ul) |
| 221~264 | 테이블, 인용문, 맨위로 버튼 |
| 350~501 | 헤더(masthead), 네비게이션, 목차 사이드바 |
| 503~582 | 포스트 스타일 |
| 584~624 | 페이지네이션 (이전/다음) |
| 626~884 | 아카이브, 검색, 태그 페이지 |
| 887~1125 | 타임라인 (데스크톱 + 모바일) |
| 1128~1177 | 푸터 |

### 모바일 대응

모바일 스타일은 `@include mobile { }` 안에 작성한다:

```scss
.example {
  font-size: 18px;

  @include mobile {
    font-size: 14px;  // 768px 이하에서 적용
  }
}
```

---

## 6. 네비게이션 수정하기

`_config.yml`의 `navigation` 항목을 수정한다:

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

새 페이지를 추가하려면:
1. 루트에 `새페이지.md` 또는 `새폴더/index.html` 생성
2. 머리말에 `layout: page`, `permalink: /경로/` 작성
3. `_config.yml`의 `navigation`에 항목 추가
4. **서버 재시작** 필요 (`_config.yml` 변경이므로)

---

## 7. About 페이지 수정하기

`about.md` 파일을 직접 수정한다.

### 이력 타임라인 수정

타임라인 항목은 아래 구조를 따른다:

```html
<div class="timeline-item">
  <div class="timeline-content top short">  <!-- top: 위쪽 텍스트, short/long: 연결선 길이 -->
    <h3>회사명</h3>
    <p style="font-weight: 100;">기간</p>
  </div>
  <div class="timeline-content bottom short">  <!-- bottom: 아래쪽 텍스트 -->
    <p>직책</p>
  </div>
  <div class="timeline-icon green"></div>  <!-- 색상: blue/yellow/red/green/purple/pink/black -->
</div>
```

- `top` = 선 위쪽 (보통 회사명, 기간)
- `bottom` = 선 아래쪽 (보통 직책)
- `short` = 짧은 연결선, `long` = 긴 연결선
- 아이콘 색상은 class로 지정: `blue`, `yellow`, `red`, `green`, `purple`, `pink`, `black`

---

## 8. 검색 기능 관련

### 키워드 추천 수동 갱신

보통은 GitHub Actions가 자동으로 처리하지만, 로컬에서 미리 확인하려면:

```bash
python assets/recommend.py
git diff keywords.json
```

### 검색 대상 데이터

검색은 `search.json`을 기반으로 동작한다. 이 파일은 Jekyll 빌드 시 자동 생성되므로 직접 수정할 필요 없다.

---

## 9. 댓글 시스템

Disqus를 사용 중이다 (shortname: `woocosmos`).

- 포스트 머리말에 `comments: True`가 있으면 활성화
- Disqus 관리: [woocosmos.disqus.com/admin](https://woocosmos.disqus.com/admin)

---

## 10. 자주 하는 실수 & 주의사항

| 실수 | 해결 |
|---|---|
| 포스트가 안 보임 | 파일명 날짜가 미래인지 확인. 미래 날짜 포스트는 표시되지 않음 |
| 로컬은 되는데 배포 후 안 됨 | Actions 탭에서 에러 로그 확인. 대부분 빌드 실패 |
| CSS 수정이 반영 안 됨 | 브라우저 캐시 비우기 (Cmd+Shift+R) |
| `_config.yml` 수정이 반영 안 됨 | 로컬 서버 재시작 필요 |
| 태그 페이지에 새 태그가 안 뜸 | 빌드 후 자동 반영됨. 오타가 아닌지 확인 |
| 수식이 렌더링 안 됨 | `$` 앞뒤에 공백이 있는지, `$$` 블록이 빈 줄로 감싸져 있는지 확인 |
| 목차가 안 나옴 | 머리말에 `toc: True` 확인. 본문에 `#`, `##` 제목이 있어야 함 |

---

## 파일 수정 빈도 참고

| 자주 건드리는 파일 | 용도 |
|---|---|
| `_posts/*.md` | 포스트 작성/수정 |
| `about.md` | 프로필, 이력 업데이트 |
| `style.scss` | 디자인 변경 |
| `_sass/_variables.scss` | 색상, 폰트 등 전역 값 변경 |
| `_config.yml` | 사이트 설정, 네비게이션 변경 |

| 거의 안 건드리는 파일 | 이유 |
|---|---|
| `_layouts/*.html` | 레이아웃 구조를 바꿀 때만 |
| `_includes/*.html` | 헤더/푸터 구조를 바꿀 때만 |
| `assets/*.js` | 검색/목차 기능을 바꿀 때만 |
| `.github/workflows/*.yml` | 배포 방식을 바꿀 때만 |
| `assets/recommend.py` | 키워드 로직을 바꿀 때만 |
