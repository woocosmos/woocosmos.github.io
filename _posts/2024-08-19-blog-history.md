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
그 이유는 첫째, 티스토리에서 Markdown이 불안정하게 적용되기 때문이다. 둘째, 티스토리 블로그가  외국인 유저에 대해 진입장벽을 준다고 생각한다. _(나만 해도 중국어로 가득한 유사-StackOverFlow  같은 사이트에 들어가면 행여 바이러스라도 감염될까봐 얼른 나온다)_ 마지막으로, HTML 및 JavaScript를 활용하여 자유자재로 커스터마이징할 수 있다는 점이 매력적으로 느껴졌다.  

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

## disqus 덧글창 추가

내용

## favicon 아이콘 추가

내용

## back-to-top 버튼 구현

내용

## 커서에 따른 그라데이션 색상 변화

내용

## 페이지 레이아웃 수정
### Tag 페이지
내용

### Blog 페이지
내용

## 검색 페이지 추가
### 검색 기능
내용

### 검색 결과 하이라이트
내용

## 아바타 기울기 애니메이션

## 목차(TOC) 추가
### 목차 레이아웃
### sticky & highlight