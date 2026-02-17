---
layout: post
title: "Jekyll을 사용한 github.io 블로그 개발기"
tags: [JavaScript]
comments: True
toc: true
---

**요약**
```
- 지금 이 블로그(woocosmos.github.io)를 구축한 전반적인 내용
- Jekyll 설치를 위해 ruby 개발 환경을 세팅한다
- 목적과 취향에 맞는 Jekyll 테마를 골라 fork 한다
- HTML/CSS/JavaScript를 활용하여 다양한 기능을 추가, 수정한다
```

# 개요

**티스토리에서 운영하던 개발 블로그를 github.io 로 이관하는 작업을 진행하고 있다.**  
그 이유는 첫째, 티스토리에서 Markdown이 불안정하게 적용되기 때문이다. 둘째, HTML 및 JavaScript를 활용하여 자유자재로 커스터마이징할 수 있다는 점이 매력적으로 느껴졌기 때문이다.  

물론 github.io 블로그는 카테고리 설정이 까다로워 대부분 태그 기반이라는 점, 그리고 검색이나 목차와 같은 기능은 직접 구현해야 한다는 번거로움이 단점으로 작용한다. 그러나 이참에 개발 블로그를 정식으로 세팅하고 JavaScript를 직접 부딪치며 배워보는 기회로 여겨보려 한다.  

곧 게시물을 전부 이쪽으로 옮길 예정이지만 [기존 티스토리 블로그](https://woo-niverse.tistory.com/)도 열려 있으니 언제든 놀러오시라.  


# 기본 세팅

![alt text](https://github.com/user-attachments/assets/fb2c6368-b119-420e-ac38-a91483aca40f){: width="60%" }

github.io 블로그를 시작하기 위해서는 jekyll(지킬)을 세팅하는 것이 우선이다. Jekyll은 마크다운 언어로 작성한 텍스트를 정적 웹사이트로 생성해주는 변환 엔진이다. 한국어로 번역된 공식 문서를 [이곳](https://jekyllrb-ko.github.io/)에서 확인할 수 있다.

## Ruby

Jekyll은 Ruby 프로그램이기 때문에 Ruby를 먼저 설치해야 한다. 또한 Ruby의 라이브러리(즉, Gem)를 관리해주는 프레임워크인 RubyGems도 필요하다. OS에 따른 설치 방법은 [공식 문서](https://jekyllrb-ko.github.io/docs/installation/)를 포함하여 다양한 칼럼에 소개되어 있으니 참고하면 되겠다.  

개인적으로 Windows(회사 컴퓨터)와 Mac(개인 노트북)에 각각 Ruby를 설치하면서 다양한 트러블슈팅을 경험했는데, 대개 Ruby의 버전 관리 프레임워크인 `rbenv`로 설치를 관리하면서 많은 문제를 회피할 수 있었다.

> 특히 **Ruby의 버전이 3.0.0 이상이어야 한다**는 에러를 가장 많이 부딪혔는데 rbenv로 원하는 버전으로 지정함으로써 문제에서 벗어날 수 있었다. 해당 블로그 프로젝트는 `ruby-3.2.0`으로 빌드했다.

준비물의 순서로 정리하자면 rbenv → Ruby → gem → bundler → jekyll 이다.  

```bash
gem install jekyll 
```

더하여 개발의 편의성을 위해 jekyll 로컬 서버를 띄우려면 `github-pages`를 설치하는 것이 좋다. 이를 활용하여 파일의 변경사항을 save할 때마다 바로 반영된 것을 확인할 수 있다.

```
gem install github-pages
jekyll server --force_polling
```
- 별도 옵션을 주지 않는 한 [http://127.0.0.1:4000](http://127.0.0.1:4000)로 접속한다
- `--force_polling` : 해당 플래그 옵션으로 블로그를 새로고침해서 바로 변경된 내용을 확인할 수 있다. 이를 설정하지 않으면 매번 로컬 서버를 내렸다가 다시 올려야 한다.


## Jekyll 테마

from scratch로 블로그를 구성하기보다는 특정 테마로 베이스 사이트를 세팅한 후에 기능을 추가하거나 변경하기로 했다. [Jekyll 테마 사이트](http://jekyllthemes.org/)에서 목적과 취향에 맞는 테마를 골라보자.

![image](https://github.com/user-attachments/assets/3f3fda0a-0307-4f87-8a3f-6faba96ebcb1){: width="80%"}

결론적으로 한국어 가독성을 고려한 [Kiko Now](https://github.com/AWEEKJ/kiko-now)를 기본으로 하되, [Tale](https://chesterhow.github.io/tale/)이나 [Catbook](https://starry99.github.io/catbook/) 등 다양한 테마를 레퍼런스로 삼아 기능을 추가하는 방향으로 진행했다.  

이제 선택한 테마의 github 레포지토리로 이동하여 나의 레포지토리로 fork 해오면 된다. 이때 레포지토리 이름을 `{username}.github.io`로 설정하면 github에서 자동으로 해당 도메인으로 호스팅해준다. fork 직후에는 위 도메인으로 접속이 안 될 수도 있는데, 수 분 기다리거나 최소 하나의 변경 사항을 push 해주면 들어가진다.

마지막으로 작업 폴더에서 git clone하여 로컬 레포지토리를 생성한다.

## config 수정

대부분 Jekyll 테마에서 그렇듯 커스터마이징의 첫 단계는 `_config.yml` 파일을 수정하는 것이다. 블로그 이름, SNS 링크 등 기본적인 내용을 이곳에 입력하도록 되어 있다.

이제 기본적인 세팅은 끝이다. 바로 MD 파일을 생성해서 포스트를 업로드할 수 있다. 개인적으로는 약간 번거롭더라도 복구 가능성을 위해 항상 git branch로 작업 후 master에 merge 하는 편이다.

```bash
git checkout -b post/blog-history
vi _posts/2024-08-19-blog-history.md
# 포스트 작성 후 ...
git add .
git commit -m '[post/init] 블로그 개발기'
git push
# master 에 반영
git checkout master
git merge post/blog-history
```

브랜치 네임이나 커밋 메시지의 컨벤션은 스스로 아래와 같이 정했다.
- post/... : 블로그글 관련 브랜치
- feature/... : 블로그 기능 관련 브랜치
- [post/init] : 블로그글 최초 배포 커밋
- [post/modi] : 이후 블로그글 수정 커밋

# 구글 검색 연동

내용

# 기능 추가

이제부터 이어지는 내용은 기능을 추가한 히스토리를 기록한 것이다.  

JavaScript를 잘 모르다보니 Workaround 형식으로 구현한 내용도 많다. 개선 지점은 언제든 덧글이나 연락처로 알려주시면 감사하겠다.


## back-to-top 버튼 구현

`_includes/top.html`에 인라인 JS로 구현되어 있다. 외부 라이브러리 없이 순수 JavaScript로 작성했다.

- 스크롤 위치를 감지하여 일정 이상 내려가면 우측 하단에 원형 버튼이 나타남
- 클릭 시 `cosine easing` 애니메이션으로 부드럽게 최상단으로 이동
- 레이아웃(`default.html`, `page.html`, `post.html`)에서 `{% raw %}{% include top.html %}{% endraw %}`로 삽입

## 검색 페이지 추가
### 검색 기능
내용

### 검색 결과 하이라이트
내용

---
## LaTex(수학 수식) 적용하기

LaTex를 렌더링해주는 KaTex 를 `_includes/head.html`의 head 부분에 추가한다.

```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/contrib/auto-render.min.js"
          onload="renderMathInElement(document.body, {
            delimiters: [
              {left: '\\[', right: '\\]', display: true},
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
            ]
          });">
  </script>
```

- delimiter를 명시한 이유는 inline LaTex를 제대로 인식하지 못했던 문제 때문이다
- 명시한 이후에도 display LaTex가 적용되지 않는 문제가 있었다 : \$\$로 감싸도 \\[\\] 로 출력되었다 (사실 이것이 표준 display LaTex notation이라고 한다) 그래서 delimiter 항목으로 더 추가했다

이제 LaTex 문법대로 수식을 \$ 기호 1개 혹은 2개 사이에 작성하면 알맞게 렌더링 된다  
  
**display LaTex**

$$
\sum_{i=1}^{k} \sum_{\mathbf{x} \in S_{i}} \left\|\mathbf{x} - \boldsymbol{\mu}_{i}\right\|^{2}
$$  

```markdown
$$
\sum_{i=1}^{k} \sum_{\mathbf{x} \in S_{i}} \left\|\mathbf{x} - \boldsymbol{\mu}_{i}\right\|^{2}
$$  
```

**inline LaTex**  
문장 중간에 이렇게 $\sum_{\mathbf {x} \in S_{i}}\mathbf {x}$ 넣을 수 있다

```markdown
문장 중간에 이런 수식을 $\sum_{\mathbf {x} \in S_{i}}\mathbf {x}$ 넣을 수 있다
```
---

## 목차(TOC) 추가
블로그글 옆 사이드바 형식의 목차를 추가한다. 아래는 플러그인을 설치해서 사용할 수 있는 [jekyll-toc](https://github.com/toshimaru/jekyll-toc)을 적용한 내용이다.

[동일한 이름의 플러그인](https://github.com/allejo/jekyll-toc)이 있는데, 후술할 Github Pages 이슈로부터 자유로운 것으로 보인다. 처음으로 돌아간다면 이것을 적용해볼지도...

**설치 방법**  

`Gemfile`에 아래 라인을 추가한다
```
gem 'jekyll-toc'
```
`bundle`로 설치를 진행한다
```
bundle install
```
`_config.yml` 파일 중 플러그인 부분에 요소를 추가한다
```
plugins:
  - jekyll-sitemap
    ...
  - jekyll-toc # 추가
```

**사용 방법**  

post 헤드에 `toc` 플래그를 추가한다
```
---
layout: post
title: "Jekyll을 사용한 github.io 블로그 개발기"
tags: [JavaScript]
comments: True
toc: true
---
```
`post.html`에 toc을 추가한다.  
단순히 {% raw %}`{{ content | toc }}`{% endraw %}로 수정해서 *본문 위에 목차가 생성*되도록 하는 방법도 있지만 목차의 레이아웃이나 기능을 다양하게 커스터마이징 하기 위해 별도 태그인 {% raw %}`{% toc %}`{% endraw %}로 추가했다. 
{% raw %}```html
<section class="entry">
    {% if page.toc %}
    <aside>
        <nav class="nav-toc">
            <h3> 목차 </h3>
            {% toc %}
        </nav>
    </aside>
    <script src="{{ site.baseurl }}/assets/scroll-spy.js" type="text/javascript"></script>
    {% endif %}
    {{ content }}
</section>
```{% endraw %}
- {% raw %}`{% if page.toc %}`{% endraw %} : 헤드에 toc 플래그를 명시한 경우에만 목차가 추가되게 했다.
- `<aside>` : 본문 옆 사이드바 형식으로 표시하기 위해 사용했다
- `<nav>` : 목차의 제목을 클릭했을 때 해당 영역으로 이동하도록 링크를 연결하기 위해 사용했다
- `<h3> 목차 </h3>` : 플러그인으로 자동 생성되는 HTML에는 제목이 없길래 따로 추가해주었다 (사실 page.toc 조건을 굳이 넣은 것도 이 제목 때문이다. toc: false으로 세팅해도 h3 태그는 남아 있었기 때문이다.)

### 목차 레이아웃

목차의 위치와 모양을 세팅하는 과정이다.

**목차를 본문 좌측에 맞추고 스크롤과 상관없이 상단에 고정시키기**
```css
aside {
    float: right;
    position: sticky;
    width: fit-content;
    top: 10px;
    margin-right: -300px;
  }
```
- `position`을 sticky로 설정하고 `top`값을 조금이라도 부여하면 스크롤과 상관없이 화면 한 쪽에 고정되는 효과를 구현할 수 있다
- `margin-right`를 조정해서 본문과 너무 멀지도, 가깝지도 않게 위치시켰다

**레이아웃을 심플하게 디자인하기**
```css
.nav-toc {
  font-size: smaller;
  border-left: 1px solid $lightGray;

  h3 {
    padding-left: 20px;
  }

  ul > li {
    list-style-type: none; 
    &:before {
      content: '';
    }

    ul {
      display: inline;
    }
  }

  ul > li > a.active {
    font-size: larger;
    font-weight: bold;
  }
}
```
- 기본적으로 폰트 사이즈는 작게, 리스트 앞에 붙는 마커는 생략했다
    - `list-style-type: none`를 주었는데도 마커가 생성되어 `&:before {content: '';}`를 별도로 추가했다
- 목차와 본문 사이 가는 구분선을 추가했다 (`border-left`)
- 일부 하위 목차들이 가로로 나열되는(?) 이상한 현상이 있어서 `display: inline`을 추가했다
- 목차가 하이라이트 대상일 때 폰트 사이즈와 굵기를 조금 키운다

**목차 하이라이트 기능**  
스크롤의 위치에 따라 현재 보고 있는 콘텐츠의 목차를 하이라이트하는 기능이다. 위에서 toc 태그를 추가한 HTML 코드를 보면 `scroll-spy.js`라는 스크립트를 실행시키는 것을 볼 수 있는데, 이것이 **스크롤 위치에 따라 하이라이트할 목차를 지정**하는 역할을 한다.  
전체 코드를 살펴보겠다.

```
// 브라우저가 HTML을 전부 읽고 DOM 트리를 완성했을 때 발생하는 이벤트
document.addEventListener('DOMContentLoaded', () => {

    // links : H1, H2, H3 깊이 까지만 목차를 읽어온다 (a 태그 셀렉트)
    const Hs = document.querySelectorAll('.nav-toc ul.section-nav li.toc-entry.toc-h1, .nav-toc ul.section-nav li.toc-entry.toc-h2, .nav-toc ul.section-nav li.toc-entry.toc-h3');
    const links = Array.from(Hs).map(h => { return h.querySelector('a') })
    
    // anchors : links 의 각 요소로부터 href 를 읽어온다
    const anchors = Array.from(links).map(link => {
        const href = link.getAttribute('href');
        if (href) {
            return document.querySelector(href);
        }
        return null;
    }).filter(anchor => anchor !== null);

    // 스크롤 발생시
    window.addEventListener('scroll', () => {
        if (anchors.length > 0 && links.length > 0) {
            let scrollTop = window.scrollY;
            let activeIndex = -1;

            // 스크롤 위치와 제목의 위치가 가까울 경우 (격차가 300 이하)
            // 활성화할 제목의 인덱스를 저장한다
            anchors.forEach((anchor, i) => {
                if (scrollTop >= anchor.offsetTop - 300) {
                activeIndex = i; 
                }
            });

            // 나머지 제목은 비활성화 한다
            links.forEach((link) => {
                link.classList.remove('active');
            });
            
            // 인덱스가 유효하면 제목을 활성화한다
            if (activeIndex >= 0) {
                links[activeIndex].classList.add('active');
            }
        }
  });
});
```
코드의 동작 원리는 주석을 참고하면 된다.  

개인적으로 까다로웠던 점은 특정 깊이(h3)까지만 목차를 읽어오는 것이었다. 모든 제목이 하이라이트되는 것을 원하지 않았고 h4 이상부터는 상위 제목을 하이라이트하는 게 목차로서 의미가 있다고 판단했다.  

`querySelectorAll`를 사용해서 *모든* 제목의 a 태그를 바로 긁어올 수 있지만 *특정 깊이까지만* 읽어오기 위해서 H1부터 H3까지 직접 지정해서 읽어온 다음 그 안에서 a 태그를 가져오게 했다. 그 뿐만 아니라 숫자로 시작하는 제목([ 예를 들면 ... ](https://woocosmos.github.io/swift-start/#1-%ED%94%8C%EB%9E%AB%ED%8F%BC-%EC%84%A0%ED%83%9D))은 href를 읽어올 때 에러가 발생했기 때문에 애초에 지정한 만큼만 읽고 그 안에서 파싱하는 방식이 가장 깔끔하다고 생각했다.

또 지속적으로 마주했던 에러는 links와 anchors 변수가 빈 배열을 반환하는 문제였는데, 이는 DOMContentLoaded 이벤트를 조건으로 추가함으로써 해결했다.

하여, 나만의 sticky highlighted TOC 이 완성되었다  
![image](https://github.com/user-attachments/assets/257eecc6-c39b-4063-b99b-3448b8167d64) 


### gh-pages 생성

그러나 TOC 기능을 추가한 후 Github Pages에서 빌드/배포 실패가 떴다. 분명 로컬 서버에서는 잘 돌아갔는데 말이다.

![image](https://github.com/user-attachments/assets/1060cd1e-0e19-45df-a006-af55b13daf18){: width="60%" }

에러 메시지에 'Unknown tag toc'이라고 적힌 것으로 보아 Jekyll-toc 플러그인 쪽 문제로 보였다.  
실제로 Jekyll-toc 레포지토리의 이슈 채널에서 동일한 문제를 호소하는 글들을 확인할 수 있었다.

- [Is Github Pages not supported? #151](https://github.com/toshimaru/jekyll-toc/issues/151)
- [TOC on GitHub Pages #29](https://github.com/toshimaru/jekyll-toc/issues/29)
- [Is Github Pages not supported? #151](https://github.com/toshimaru/jekyll-toc/issues/151)

>GitHub Pages cannot build sites using unsupported plugins. If you want to use unsupported plugins, generate your site locally and then push your site's static files to GitHub.

이는 Github Pages 서비스에서 내가 사용한 toc 플러그인을 지원하지 않아 발생한 문제였다.
따라서 **로컬로 사이트를 직접 빌드**한 후 해당 내용을 배포하도록 하는 방법으로 문제를 해결할 수 있다. 이때 `gh-pages`라는 브랜치로 밀어넣고 root 경로로 설정해야 한다. 참고한 [칼럼](https://dqdongg.com/blog/github/2018/12/29/Blog-Jekyll-toc-plugin.html#fn:2)은 여기.

```bash
# 로컬에서 빌드한다
jekyll build
# _site 폴더를 어딘가로 대피시킨다
mv -r _site /path/to/tmp
git checkout --orphan gh-pages 
# 폴더를 비우고 _site 데이터를 다시 가져온다
rm -rf * 
cp -r /path/to/tmp/_site/* ./
git add -A
git commit -m "build locally and create gh-pages"
git push origin gh-pages
```
브랜치를 생성할 때 `--orphan` 옵션을 추가한 이유는 부모(master)로부터 커밋 히스토리를 이어 받지 않은 독립적인 브랜치를 새로 만들기 위함이다. 마치 레포지토리 안에 새로운 레포지토리를 시작한다고 생각할 수 있겠다.

마지막으로는 레포지토리에서 Settings > Pages > Source 그리고 Branch를 gh-pages로 수정하면 된다
![image](https://github.com/user-attachments/assets/e19c52f7-e095-4442-b0f0-12f2c59cbf1e)

문제는 이제 앞으로 변경사항을 반영할 때마다 _site 의 내용을 매번 옮겨놨다가 다른 데이터를 삭제하는 식으로 업데이트 해야 한다는 것이다. 위 과정은 향후 **Github Actions를 활용해 자동화된 workflow로 구축**할 예정이다.