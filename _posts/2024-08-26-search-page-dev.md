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

[Kiko Now](https://github.com/aweekj/kiko-now) Jekyll 테마에 검색 기능이 없는 관계로 **직접 검색 페이지를 구성하고 JS 라이브러리로 검색 기능을 적용**했다. 블로그에 포스트가 쌓일수록 검색 기능이 필수적이라고 생각했다. 태그 기반의 문서 분류 방식은 한계가 명확하고, 특정 문서를 찾을 때도 검색이 가장 간편하기 때문이다.  

블로그 개발 과정은 [특정 포스트](https://woocosmos.github.io/blog-history/)에 아카이빙하고 있지만, 해당 기능은 분량이 많아 별도로 기록한다.  

# 기본 기능
입력 키워드로 블로그 내 모든 컨텐츠에 대해 검색하는 기본 기능부터 적용한다.

[**Simple-Jekyll-Search**](https://github.com/christian-fei/Simple-Jekyll-Search) 라이브러리를 적용했다. 브라우저 단[Client-Side]에서 작동하기 때문에 별도 서버나 DB를 구축할 필요가 없다. 적용 과정 역시 간단하다.  

<h3 class="no_toc"> 첫째, search.json 생성 </h3>

블로그의 root 위치에 아래 `search.json` 파일을 만든다.

```json
{% raw %}---
layout: none
---
[
  {% for post in site.posts %}
    {
      "title"    : "{{ post.title | escape }}",
      "tags"     : "{{ post.tags | join: ', ' }}",
      "date"     : "{{ post.date | date: '%Y.%m.%d'}}",
      "url"  : "{{ site.url }}{{ post.url }}",
      "content": "{{ post.content | strip_html | strip_newlines | escape }}"
    } {% unless forloop.last %},{% endunless %}
  {% endfor %}
]{% endraw %}
```
기존 코드에 `post.content` 를 추가하여 본문 텍스트도 가져오게 했다. 이때 `strip_html` 등 몇 가지 Jekyll 문법을 더했다. 이를 통해 `{baseurl}/search.json` 주소로 json 파일에 접근할 수 있다. 브라우저로부터 이 파일을 읽어와 검색 데이터로 활용할 것이다.

![image](https://github.com/user-attachments/assets/e2a40f6a-eaea-465f-ab02-42408c060258){: style='border:black solid 0.5px; padding:10px; width:50%;'}{: .center-image}
<br>

<h3 class="no_toc"> 둘째, JavaSript 소스 추가 </h3>

[simple-jekyll-search.js](https://github.com/christian-fei/Simple-Jekyll-Search/blob/master/example/js/simple-jekyll-search.js)를 다운 받아 어디든 위치시킨다. 이 스크립트는 **`search.json`으로부터 데이터를 읽어와 입력어에 매칭되는 내용을 찾는** 함수 `SimpleJekyllSearch`를 정의하고 있다.

그 다음 [search-and-return.js](https://github.com/woocosmos/woocosmos.github.io/blob/master/assets/search-and-return.js)도 다운 받아 같은 위치에 붙여넣는다. **`SimpleJekyllSearch` 함수를 실행시켜서 결과값을 받아와 처리하는** 부분을 별도 스크립트로 작성한 것이다.   

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

나는 assets 라는 폴더를 만들어 이곳에 JS 소스를 모아두기로 했다. 두 스크립트는 다음 서술할 검색 페이지에서 실행시킬 것이다.

<h3 class="no_toc"> 셋째, 검색 페이지 구성 </h3>

root 위치에 `search` 폴더를 생성하고 그 아래 `index.html` 파일을 생성한다. 앞서 추가한 JS 스크립트가 실행되면서 검색어 입출력이 진행되는 곳이다.

```html
{% raw %}---
layout: page
permalink: /search
---

<ul class="search">
    <div id="search-container">
        <input type="search" id="search-input" placeholder="  🤔 검색어를 입력하세요.">
        <ul id="results-container"></ul>
    </div>
</ul>

<script src="{{ site.baseurl }}/assets/simple-jekyll-search.js" type="text/javascript"></script>
<script src="{{ site.baseurl }}/assets/search-and-return.js" type="text/javascript"></script>{% endraw %}
```

이렇게 `{baseurl}/search` 주소로 접근할 수 있는 검색 페이지를 완성하였다.

![image](https://github.com/user-attachments/assets/a3b2710e-95b2-43d8-b4b7-cdb3375e2625){: style='border:black solid 0.5px; padding:10px;'}{: .center-image}  

한편, 무엇을 클릭했을 때 이 검색 페이지로 연결되도록 할 것인가? 나는 상단의 탭에 **돋보기 아이콘**을 추가했다. 이를 위해 돋보기 아이콘 svg와 검색 페이지를  연결하여 `_includes/nav.html`에 추가했다.

```html
{% raw %}<ul class="search-icon">
  <a href="{{ site.baseurl }}/search">
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg">
      <path d="M10 ...생략" fill="currentColor"></path>
    </svg>
  </a>
</ul>{% endraw %}
```

![image](https://github.com/user-attachments/assets/96ec0aaf-0692-4da4-b390-313138b53ad0){: style='border:black solid 0.5px; padding:10px;'}{: .center-image}

이렇게 검색 페이지를 구성하고 검색용 라이브러리를 적용하는 과정을 마무리하였다.


# 응용 기능
기본 검색 기능에 더하여 키워드를 더 쉽게 찾고 검색 결과를 더 잘 표현하기 위해 개선한 사항이다. 

## 결과창 개선

![image](https://github.com/user-attachments/assets/2759e44c-1170-4c49-9e1a-297d646a8354){: style='border:black solid 0.5px; padding:10px;'}

이미지에 보듯 결과창에 추가한 내용은 다음과 같다.

1. 검색어 하이라이트
2. 클릭시 본문 및 태그 페이지로 링크 연결
3. 본문 미리보기
4. 검색어가 언급된 횟수 표시
5. 아이콘과 함께 메타 정보 디스플레이
<br>

이를 위해 `SimpleJekyllSearch` 함수의 `templateMiddleware`와 `searchResultTemplate` 인자를 활용할 것이다. 전자는 검색 결과가 있을 때 호출되는 함수이며 후자는 그 결과를 출력할 HTML 템플릿을 지정하는 인자다. 하나씩 짚어보도록 하겠다.  
<br>

`templateMiddleware` 인자는 다음과 같이 정의된 함수를 필요로 한다.

```javascript
function (prop, value, template) {
    return value
    }
```
`prop`은 json의 key이고 `value`는 key에 대한 value를 의미한다. 이제 `prop`, 즉 '항목'에 따라 `value`를 처리할 것이다.  

**URL**과 **날짜** 항목은 json에 저장된 그대로 사용할 예정이기 때문에 바로 `value`를 반환하도록 했다.

```javascript
if (prop === "url" || prop === 'date') {
          return value;
        }
```

나머지 **제목, 태그, 본문** 항목은 검색어 하이라이트를 적용하고 URL과 연결하는 작업이 필요하다.  
우선 검색어를 저장하고, 그것을 찾는 정규표현식 객체와 최종적으로 리턴될 변수를 선언한다.

```javascript
const searchTerm = document.getElementById("search-input").value;
const regex = new RegExp(searchTerm, "gi");
let highlightedValue;
```

**제목** 항목은 정규표현식 객체로 검색어(`$&`)를 HTML 태그로 감싼다. 배경색깔을 바꾸고 폰트를 굵게 표시한다.
```javascript
if (prop === 'title') {
  highlightedValue = value.replace(regex, '<span style="background:gold"><b>$&</b></span>')
  return highlightedValue;
}
```

**태그** 항목의 경우 [태그 페이지](https://woocosmos.github.io/tags/)의 각 태그 링크와 연동했다.  
앞서 json을 생성하면서 쉼표로 join 했기 때문에 split하고 join하는 과정을 한번 더 거치는데, search.json을 개선해서 전처리를 간소화하는 대안도 고민해봐야겠다.

```javascript
if (prop === 'tags') {
    const dest = window.location.origin;
    const theTags = value.split(', ').map(tag => tag.trim());
    
    highlightedLinkedValue = theTags.map(tag => {
      // 하이라이트를 적용한다
      const highlightedTag = tag.replace(regex, '<b style="background:gold">$&</b>');
      // 링크를 적용한다
      return `<a href="${dest}/tags/#${tag}"><span>${highlightedTag}</span></a>`;
    }).join(', ');
    
    return highlightedLinkedValue;
        }
```

마지막으로 **본문**을 보여주는 데 있어 두 가지 지점을 고려했다. 첫번째는 30개 단어까지 미리보기로 보여주는 것이고 두번째는 본문에서 match가 걸린 횟수를 명시하는 것이다.  

첫번째 매치를 기준으로 앞뒤 15개 단어까지 슬라이스하였다. 본문에 매치가 없을 경우 처음부터 30개 단어를 가져온다. 마지막으로는 정규표현식 객체에 매치된 `matches`의 개수를 명시했다.

```javascript
value = value.replace(/\[.*?\]/g, '');
const matches = value.match(regex);
let matchCnt;
if (matches) {
    // 띄어쓰기를 기준으로 토큰화한다
    const wordsArray = value.split(/\s+/);

    // 검색된 단어를 기준으로 앞뒤 15개 토큰을 사용한다
    const matchIndex = wordsArray.findIndex(word => regex.test(word));
    const start = Math.max(0, matchIndex - 15); 
    const end = Math.min(wordsArray.length, matchIndex + 15 + 1); 
    const truncatedValue = wordsArray.slice(start, end).join(" ");

    // 하이라이트를 적용한다
    highlightedValue = truncatedValue.replace(
        regex,
        '<span style="background:gold"><b>$&</b></span>'
    );
    matchCnt = matches.length

} else {
    // 본문에 검색어가 없을 경우 처음부터 30개 토큰을 가져온다
    const words = value.split(/\s+/).slice(0, 30).join(" ");
    highlightedValue = `${words}...`;
    matchCnt = 0
}
// 언급수
highlightedValue += `<div style="padding-top:5px"><span id="match-counter">본문에 <b>${matchCnt}</b>번 언급되었습니다</span></div>`;
return highlightedValue;
```
<br>
이렇게 처리된 결과물은 `searchResultTemplate`에 정의한 HTML 템플릿대로 디스플레이 된다. 이곳에서 Font Awesome(폰트 어썸) 태그를 정의하여 아이콘으로 영역을 시각적으로 구분했다. 그리고 제목과 본문을 클릭했을 때 본문으로 연결해주는 `<a>` 태그를 추가했다

```javascript
searchResultTemplate: 
        '<article>'+
        '<div><i class="fas fa-book fa-fw"></i><a href="{url}">{title}</a></div>'+
        '<div><i class="fas fa-clock fa-fw"></i><span>{date}</span></div>'+
        '<div><i class="fas fa-tag fa-fw"></i>{tags}</div>'+
        '<div style="display:inline-flex">' + 
            '<i class="fas fa-pencil-alt fa-fw" style="padding-top:5px"></i><a href="{url}"><span style="color:#343a40">{content}</span></a>' + 
        '</div>'+
        '</article>'
```

참고로 아이콘을 불러오기 위해서는 search 폴더의 **`index.html`에 폰트 어썸 링크를 추가**해주어야 한다.

```
{% raw %}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
{% endraw %}
```

## 키워드 추천

![image](https://github.com/user-attachments/assets/5e9706e8-610d-44de-b117-90876070a57f){: style='border:black solid 0.5px; padding:10px;'}

유저에게 무슨 키워드를 검색할지 가이드를 제공해주는 것은 어떨까?  
포스트 본문을 데이터로 활용하여 **키워드의 중요도를 집계하고 상위 n개 키워드를 추천**하는 기능을 떠올렸다.

아이디어는 이렇다.
1. 블로그 전체에서 제목과 본문 텍스트를 수집하여 전처리하고 키워드를 추출한다
2. 블로그 포스트 개수를 고려하여 키워드별 TF-IDF를 집계하고 상위 5개를 저장한다
3. 추천 키워드를 불러와 검색 페이지에서 띄워준다

1~2번은 Python으로 실행하고 3번은 JavaScript로 구현하기로 했다.  
<br>

**데이터 수집과 처리**  
`{baseurl}/search.json` 주소로 json 파일에 접근할 수 있다는 점을 기억하고 `requests` 모듈로 불러왔다. 그리고 그 중에서 제목과 본문만 저장했다.

```python
def collect_contents(url, pttrn, noTag):
    '''
    url   : search.json
    pttrn : escape 기호 제외하기 위한 정규표현식
    noTag : 데이터 수집에서 제외할 태그
    '''
    response = requests.get(url, verify=False)
    cleansed_response = re.sub(pttrn, ' ', response.text)
    normalized_response = re.sub(r'\s+', ' ', cleansed_response)
    
    json_data = json.loads(normalized_response)
    contents = [post['title'] + ' ' + post['content'] for post in json_data if noTag not in post['tags']]
    return contents
```

수집한 데이터를 키워드 말뭉치 형태로 변환한다. 이때 영어와 한국어를 따로 추출하여 한 글자인 단어와 불용어 사전에 포함된 단어를 제외했다. 명사를 대상으로 하고 싶었기 때문에 **한국어는 형태소 분석기를 사용하여 명사를 추출**했다.

```python
def create_corpus(contents):
    # eng_prc, kor_prc는 별도로 정의한 전처리 함수다
    keywords_eng = list(map(eng_prc, contents))
    # 한국어는 형태소 분석 후 명사만 사용된다
    keywords_kor = list(map(kor_prc, contents))
    corpus = [' '.join(e+k) for e, k in zip(keywords_eng, keywords_kor)]
    return corpus
```

참고로 한국어 형태소 분석은 `konlpy`를 사용했다.
```python
from konlpy.tag import Okt

def kor_prc(c):
    okt = Okt()
    kor_res =[]
    for k in okt.nouns(c):
        if (len(k) > 1) & (k not in stop_words):
            kor_res.append(k)
    return kor_res
```

불용어 사전은 [NLTK's list of english stopwords](https://gist.github.com/sebleier/554280)와 [Latex 문법 리스트](https://www.public.asu.edu/~rjansen/latexdoc/ltx-2.html)를 크롤링해서 `stopwords.txt` 파일로 구축하였다. 더불어 *span, div*와 같은 HTML 태그도 불용어 사전에 포함했다.  
<br>

**TF-IDF 계산**  
TF-IDF(Term Frequency-Inverse Document Frequency)는 **문서 안에서의 출현 빈도수와 전체 문서 집합에서의 희귀성을 적용한 가중치**이다. scikit-learn 의 [TfidfVectorizer](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html)을 사용해 계산했다. 여러 개 포스트를 올리는 블로그 특성 상 주요 키워드를 추출하는 데 TF-IDF가 적합하다고 생각하여 적용했다. 

```python
def extract_keywords(corpus, topN=5, asset_dir=None):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    feature_names = vectorizer.get_feature_names_out()
    # 단어가 열, 문서가 행이므로 각 단어에 대해 문서 전반의 값을 sum
    sum_tfidf_scores = np.array(tfidf_matrix.sum(axis=0)).flatten()
    average_tfidf_score = sum_tfidf_scores.mean().round(2)

    top_indices = sum_tfidf_scores.argsort()[-topN:][::-1]
    top_keywords = [['말뭉치 평균', average_tfidf_score]]
    top_keywords += [[feature_names[idx], round(sum_tfidf_scores[idx], 2)] for idx in top_indices]
    ...
    # 저장
    with open(save_path, 'w') as f:
      json.dump(top_keywords, f)
```
문서별로 단어의 TF-IDF 값이 계산되는데, 전체 블로그 관점에서 중요도를 고려해야 하므로 단어 단위로 총합 값을 계산했다. 또 추출된 키워드의 중요도를 상대적으로 비교할 수 있도록 전체 키워드의 평균 TF-IDF 값도 함께 저장했다.  
<br>

**추천 키워드 디스플레이**  
파이썬으로 계산한 결과는 `keywords.json` 이라는 이름으로 따로 저장했다. 첫번째 요소는 전체 말뭉치 평균이고, 그 아래부터 1위, 2위 ... 5위에 해당한다. [키워드, 점수] 쌍의 리스트로 이루어져 있다.
```json
[['말뭉치 평균', 0.05], 
 ['클러스터', 0.67], 
 ['toc', 0.42], 
 ['포인트', 0.38], 
 ['편차', 0.38], 
 ['평균', 0.33]]
```

이제 이것을 읽어 검색 페이지에서 보여주는 JavaScript를 작성한다. 해당 스크립트는 search 폴더의 `index.html` 에서 실행된다. 먼저 json을 읽어온 후 반복문으로 HTML 태그를 추가했다. 키워드를 클릭하면 바로 검색되도록 click 이벤트를 추가했다.

```javascript
// 미리 추출한 키워드 json 데이터를 불러온다
const response = await fetch('keywords.json');
const data = await response.json();
...
// 첫번째 요소는 전체 평균이므로 두번째 요소부터 반복문을 시행한다
data.slice(1).forEach((obj, rnk) => {
    const li = document.createElement('li');
    const span = document.createElement('span');

    // 키워드를 읽어온다
    span.textContent = obj[0];

    // 클릭할 경우 해당 키워드를 search-input 입력창으로 전달한다
    span.addEventListener('click', function(event) {
                    const searchInput = document.getElementById('search-input');
                    searchInput.value = obj[0];

                    // trigger
                    const e = new Event('input', { bubbles: true });
                    searchInput.dispatchEvent(e);
                });
    ...
```
![image](https://github.com/user-attachments/assets/5f04c3c4-89b7-4074-a014-4f4103eeddda){: style='border:black solid 0.5px; padding:10px;'}{: .center-image}
클릭하면 검색창에 그 키워드가 입력되면서 검색 기능이 발동된다.
{: .center}  

마지막으로 *이 키워드들이 왜 추천되는지* 도움말 팝업을 추가해보았다. 아이콘 위에 마우스를 호버하면 텍스트 설명이 뜨는 방식이다. 각 추천 키워드의 점수도 `obj[1]`으로 읽어올 수 있으므로 팝업 코드를 forEach문에 추가했다.

```javascript
// 도움말 아이콘 팝업
const svgIcon = document.createElement('span')
svgIcon.innerHTML = `<svg width="25" height="25" viewBox="0 0 16 16" 생략..> </svg>`;
paragraph.appendChild(svgIcon);

const totalAvg = data[0]
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
tooltip.textContent = `TF-IDF 점수를 기반으로 상위 5개 키워드를 추천합니다\n
                      현재 블로그의 전체 평균 TF-IDF는 ${totalAvg[1]}점입니다\n
                      추천 키워드에 마우스를 올려 점수를 비교해보세요`;
tooltip.style.whiteSpace = 'pre'; // '\n'이 적용되려면
document.body.appendChild(tooltip);

svgIcon.addEventListener('mouseenter', (event) => {
    tooltip.style.display = 'block';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
});

svgIcon.addEventListener('mousemove', (event) => {
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
});

svgIcon.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
});
```
<br>

**자동화**  
Github Pages 활용하여 자동화 (포스트가 추가될 때마다 바뀌는 중요도 반영되도록)

# Takeaways
- JS에서 실행할 수 있는 토크나이저
- 