---
layout: post
title: "블로그 키워드 추천 및 검색 기능 구현기"
tags: [JavaScript, NLP]
comments: True
toc: true
---

**요약**
```
- 지금 이 블로그(woocosmos.github.io)의 검색창 blah blah
- 내용
- 내용
```

# 개요

[Kiko Now](https://github.com/aweekj/kiko-now) Jekyll 테마에 검색 기능이 없는 관계로 **직접 검색 페이지를 구성하고 JS 라이브러리로 검색 기능을 적용**했다.  
블로그에 포스트가 쌓일수록 검색 기능이 필수적이라고 생각했다. 태그 기반의 문서 분류 방식은 한계가 명확하고, 특정 문서를 찾을 때도 검색이 가장 간편하기 때문이다.  

블로그 개발 과정은 [특정 포스트](https://woocosmos.github.io/blog-history/)에 아카이빙하고 있지만, 해당 기능은 분량이 많아 별도로 기록한다.  

지금까지 구현하고 배포에 반영한 내용을 리스트로 요약하자면 다음과 같다.
- search 탭 생성과 검색 페이지 구성
- Jekyll 검색 플러그인 변형과 적용
- 검색 결과창의 레이아웃 구성
- TF-iDF를 활용한 검색 추천 키워드 추출  
<br>

# 기본 기능
입력 키워드로 블로그 내 모든 컨텐츠에 대해 검색하는 기본 기능부터 적용한다.

## 검색 기능
[**Simple-Jekyll-Search**](https://github.com/christian-fei/Simple-Jekyll-Search) 라이브러리를 적용했다. (나의 니즈에 따라 약간씩 변형을 가했다는 점을 참고 바람) 브라우저 단[Client-Side]에서 작동하기 때문에 별도 서버나 DB를 구축할 필요가 없다.  

적용 과정 역시 간단하다.  
<br>

**1. `search.json` 생성**  

블로그의 root 위치에 아래 json 파일을 만든다.

```json
---
layout: none
---
[{% raw %}
  {% for post in site.posts %}
    {
      "title"    : "{{ post.title | escape }}",
      "tags"     : "{{ post.tags | join: ', ' }}",
      "date"     : "{{ post.date | date: '%Y.%m.%d'}}",
      "url"  : "{{ site.url }}{{ post.url }}",
      "content": "{{ post.content | strip_html | strip_newlines | escape }}"
    } {% unless forloop.last %},{% endunless %}
  {% endfor %}
  {% endraw %}
]
```
기존 코드에 `post.content` 를 추가하여 본문 텍스트도 가져오게 했다. 이때 `strip_html` 등 몇 가지 Jekyll 문법을 더했다. 

이 json 파일을 만들면 `{baseurl}/search.json` 주소로 json 파일에 접근할 수 있게 된다. 브라우저로부터 이 json 파일을 읽어와 검색 데이터로 활용할 것이다.

![image](https://github.com/user-attachments/assets/e2a40f6a-eaea-465f-ab02-42408c060258){: width="40%" }
<br>

**2. 입출력 처리를 위한 JavaSript 소스 추가** 

[simple-jekyll-search.js](https://github.com/christian-fei/Simple-Jekyll-Search/blob/master/example/js/simple-jekyll-search.js)를 다운 받아 어디든 위치시킨다. 나는 assets 라는 폴더를 만들어 이곳에 JS 소스를 모두 모아두기로 했다.

이 스크립트는 **`search.json`으로부터 데이터를 읽어와 입력어에 매칭되는 내용을 찾는 함수 `SimpleJekyllSearch`를 정의**하고 있다. *곧 생성할 검색 페이지*에서 다음과 같이 스크립트를 실행시킬 것이다. (파일명을 수정한 관계로 위에서 언급한 바과 다름에 주의)

```html
{% raw %} <script src="{{ site.baseurl }}/assets/jekyll-search.js" type="text/javascript"></script> {% endraw %}
```
<br>

**`SimpleJekyllSearch` 함수를 실행시켜서 결과값을 받아와 처리하는 부분**은 `search-and-return.js`라는 파일명의 별도 스크립트로 생성했다. 분량이 많기 때문에 인자별로 break down 해서 설명하겠다.

`SimpleJekyllSearch` 는 검색 기능에 필요한 입출력 관련 option을 인자로 받고 있다.

- searchInput (입력창 요소에 접근할 수 있는 객체)
- resultsContainer (결과창 요소에 접근할 수 있는 객체)
- json (json 의 위치)
- searchResultTemplate (결과 내용을 출력할 HTML 템플릿)
- noResultsText (결과가 없을 경우 출력할 내용)
- templateMiddleware (검색 결과가 있을 때 호출되는 함수)  
<br>

```javascript
var sjs = SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '/search.json',
    searchResultTemplate: ...
    noResultsText: '😴 검색 결과가 없습니다',
    templateMiddleware : ...
)}
```

첫 두 개 인자는 `document.getElementById` 함수를 사용하여 입력창과 결과창에 접근할 수 있게 했다.  
또 json 의 위치는 '/search.json' 스트링으로 명시하면 된다.  

여기서 까다로웠던 것은 `searchResultTemplate`과 `templateMiddleware`를 세팅하는 것이었다. 두 가지 기능을 적용하고 싶었는데, 하나는 검색에 걸린 블로그 포스트의 메타 정보(날짜, 태그 등)를 아이콘과 함께 디스플레이 하는 것 그리고 또 하나는 결과창에서 입력한 검색어를 하이라이트 표시하는 것이었다.

검색, 즉 Match가 발생하는 순간 `templateMiddleware`가 호출되므로 해당 함수를 거쳐 `searchResultTemplate`에 전달된다.  

**templateMiddleware**
```javascript
function (prop, value, template) {
    return value
    }
```
이러한 형식으로 정의한 **함수**를 넘겨준다. `prop`은 json의 key이고 `value`는 key에 대한 value를 의미한다.  

예를 들어, URL과 날짜 항목은 json에 저장된 그대로 사용할 예정이기 때문에 바로 `value`를 반환하도록 했다.

```javascript
if (prop === "url" || prop === 'date') {
          return value;
        }
```

제목, 태그, 본문 항목은 하이라이트 표시를 하고 본문 URL과 연결하는 작업이 필요하다.  
우선 검색어를 저장하고, 그것을 찾는 정규표현식 객체와 하이라이트를 적용할 변수를 선언한다.

```javascript
const searchTerm = document.getElementById("search-input").value;
const regex = new RegExp(searchTerm, "gi");
let highlightedValue;
```

다음 정규표현식을 활용해 검색어(`$&`)를 HTML 태그로 감싼다. 배경색깔을 바꾸고 폰트를 굵게 표시한다.
```javascript
if (prop === 'title') {
            highlightedValue = value.replace(regex, '<span style="background:gold"><b>$&</b></span>')
            return highlightedValue;
        }
```
![image](https://github.com/user-attachments/assets/86f75507-032f-4971-97b1-2b76316f10c0)
그 결과 '블로'를 입력창에 넣었을 때 그 키워드만 태그 효과가 적용된다.

태그 항목의 경우 [태그 페이지](https://woocosmos.github.io/tags/)의 각 태그 링크와 연동했다.  
앞서 json을 생성하면서 ', '로 join 해버렸기 때문에 split하고 join하는 과정을 한번 더 거치는데, search.json을 개선해서 전처리를 간소화하는 대안도 고민해봐야겠다.

```javascript
if (prop === 'tags') {
    const dest = window.location.origin;
    const theTags = value.split(', ').map(tag => tag.trim());
    
    highlightedLinkedValue = theTags.map(tag => {
        const highlightedTag = tag.replace(regex, '<b style="background:gold">$&</b>');
        return `<a href="${dest}/tags/#${tag}"><span>${highlightedTag}</span></a>`;
    }).join(', ');
    
    return highlightedLinkedValue;
        }
```



## 검색 페이지
### 검색 탭과 화면
아이콘과 별도 index.html

### 결과창
json 결과를 모두 보여주는 것. 본문의 경우 글자수 제한한 미리보기
본문과 연결

# 응용 기능
원하는 것을 더 잘 검색하고 확인할 수 있는 응용 기능 추가

## 입력어 하이라이트
입력한 단어를 하이라이트
태그도 /tag# 로 연결하는 부분

## 키워드 추천
기존 포스트를 데이터로 활용하여 검색하기 좋은 단어를 추출하여 키워드 추천하기로

### TF-iDF 계산
텍스트 데이터 수집, 전처리(토크나이징)  
계산식 포함하여 서술

### 적용 파이프라인
포스트 개수가 늘어날 경우 python으로 키워드 계산, 저장  
JavaScript로 파일을 읽어서 HTML에 뿌리기  
Github Pages 활용하여 자동화 (포스트가 추가될 때마다 바뀌는 중요도 반영되도록)

# Takeaways
- JS에서 실행할 수 있는 토크나이저
- 