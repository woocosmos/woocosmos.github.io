---
layout: post
title: "GitHub Actions 활용한 태스크 및 배포 자동화"
tags: [DevOps]
comments: True
toc: True
---

**요약**
```
- CI/CD 플랫폼인 GitHub Actions의 기능과 구성 요소를 살펴봤다
- GitHub Actions를 활용하여 특정 스크립트를 작동시키거나 로컬로 빌드한 내용을 배포하는 태스크를 자동화했다
```

# 개요

[GitHub Actions](https://docs.github.com/ko/actions)를 사용하여 특정 스크립트를 실행시키고 배포하는 워크플로를 자동화한다.  

자동화가 필요한 이유는 두 가지다.

1. 블로그 포스트가 늘어남에 따라 [추천 키워드의 점수](https://woocosmos.github.io/search-page-dev/#%ED%82%A4%EC%9B%8C%EB%93%9C-%EC%B6%94%EC%B2%9C)를 새롭게 집계하고 업데이트해야 한다
2. 로컬에서 사이트를 직접 빌드한 다음에 [gh-pages 브랜치](http://woocosmos.github.io/blog-history/#gh-pages-%EC%83%9D%EC%84%B1)에 반영함으로써 배포해야 한다

따라서 이번 포스트에서는 태스크의 최신화와 효율화를 위해 GitHub Actions의 워크플로를 구성해보겠다.

# GitHub Actions

**GitHub Actions**는 빌드, 테스트 및 배포 파이프라인을 자동화할 수 있는 **CI/CD 플랫폼**이다.

> CI/CD : Continuous Integration(지속적 통합) 및 Continuous Delivery/Deployment(지속적 제공/배포). 소프트웨어의 개발 라이프사이클을 효율화, 가속화 하는 DevOps 개념.

![image](https://github.com/user-attachments/assets/b23f798b-4dc2-4415-a8ff-8eb446c6dce4)

코드 변경에 따라 블로그 콘텐츠를 업데이트한다는 점에서 CI 개념과 연결되고, Jekyll 사이트를 배포한다는 점에서 CD 개념과 연결된다. (*정확히 말하자면 CI는 여러 작업자가 commit한 작업을 효율적이고 빠르게 통합함을 목표로 한다*)

GitHub Actions는 PR, Push 등 **이벤트**가 발생할 때 **워크플로**를 실행시킬 수 있다. 자체 인프라에서 워크플로를 실행할 수 있지만 GitHub에서도 주요 OS의 가상 머신을 통해 **서버**를 제공하고 있다. 각 구성 요소를 살펴보겠다.

## 구성 요소
**Workflows(워크플로)**  
하나 이상의 작업으로 구성된 프로세스. YAML 파일로 정의하며 특정 조건에 따라 트리거 된다. 여러 워크플로를 생성할 수 있고, 한 워크플로 안에서 다른 워크플로를 참조할 수도 있다.

**Events(이벤트)**  
워크플로의 실행을 트리거 하는 활동이다. GitHub Actions 에서 사용할 수 있는 [이벤트의 리스트](https://docs.github.com/ko/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)를 참고하자.

**Jobs(작업)**  
워크플로 안에서 단계로 구성된 집합. 이 단계들은 같은 실행기(runner) 안에서 작동하기 때문에 데이터를 공유할 수 있다. 디폴트로 작업들끼리는 종속성이 없기 때문에 병렬로 실행되나, 한 작업이 다른 작업에 종속된다면 완료를 기다린다.

**runner(실행기)**  
워크플로를 실행하는 서버. 하나의 runner는 한 번에 하나의 작업(job)을 실행할 수 있다.

# 시작하기

root 경로에서 `.github/workflows` 폴더를 생성, 해당 위치에 test.yml 파일을 작성한다.

```yaml
name: Test

on:
  push:
    branches:
      - 'post/**'

jobs:
  my_first_job:
    runs-on: ubuntu-latest
    steps:
    - name: step-example
      run: echo Hello World!
```

post로 시작하는 브랜치에 push 이벤트가 발생할 때 트리거 되는 워크플로를 정의했다. my_frist_job 이라는 작업이 실행될 텐데, ubuntu 실행기에서 Hello World 를 출력하는 step을 포함하고 있다.

yml 파일을 저장한 후, post/github-actions 브랜치에 push 해보았다. 그 결과는 프로젝트 레포지토리의 Actions 탭에서 확인할 수 있다

![image](https://github.com/user-attachments/assets/c657fa7a-03ce-41ef-85cb-3843bed9b570)

왼쪽 탭에 Test 라는 워크플로가 생성되어 있고 워크플로의 실행 내역이 표시되어 있다. post/github-actions에 push 함으로써 트리거된 것이다.

![image](https://github.com/user-attachments/assets/fa4487ef-855d-4617-a003-15904ba4ed74){: width="80%"}
![image](https://github.com/user-attachments/assets/c6b5fc64-481c-4be5-aba8-ae5d34be5d79){: width="50%"}

my_frist_job 작업이 성공적으로 실행되었고 그것을 눌러 step-example 단계도 실행되었음을 확인할 수 있다. 이제 본격 나의 태스크에 적용해보겠다.

## 키워드 업데이트

추천 키워드를 업데이트할 조건을 정한 후, 그에 따른 트리거와 작업 내용을 YAML 파일로 작성했다.

```yaml
name: Workflow for updating keywords

on:
  pull_request:
    branches:
      - master
    types:
      - closed
  push:
    branches:
      - master

jobs:
  my-job:
    if: (github.event_name == 'pull_request' &&
            github.event.pull_request.merged == true && 
            startsWith(github.event.pull_request.head.ref, 'post/')) ||
        (github.event_name == 'push' &&
            contains(github.event.head_commit.message, 'post'))
    runs-on: ubuntu-latest
    steps:
      - name: Approach the Codes
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.8'
          cache: 'pip'
          
      - name: Install Ubuntu Dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y g++ openjdk-8-jdk
      
      - name: Install Python Dependencies
        run: |
          python -m pip install -r ${{ github.workspace }}/requirements.txt

      - name: Run the Script
        run:
          python ${{ github.workspace }}/assets/recommend.py

      - name: Configure Git
        run: |
          git config --global user.name "${GITHUB_ACTOR}"
          git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
      
      - name: Check for Differences
        id: check_diff
        run: |
          git add ${{ github.workspace }}/keywords.json
          if git diff --cached --quiet; then
            echo "No changes detected"
            echo "has_changes=false" >> $GITHUB_OUTPUT
          else
            echo "has_changes=true" >> $GITHUB_OUTPUT
          fi

      - name: Commit the Change
        if: steps.check_diff.outputs.has_changes == 'true'
        run: |
          echo "pushing the file ..."
          git commit -m "[automation] keywords updated"
          git push
```

워크플로가 트리거 되는 조건은 아래와 같다.

- post로 시작하는 브랜치의 PR를 완료했을 때 (보통 post 브랜치에서 포스트를 작성한 후 완성했을 때 master로 merge시키기 때문)
- push 의 커밋 메세지에 'post'가 포함되어 있을 때 (master 브랜치에서 바로 수정하여 push할 때도 있으므로)

'my-job' 작업은 환경을 세팅하고(1~4번) 스크립트를 실행시키고(5번) 변경 사항을 git push 하는(6~8번) 일련의 단계들을 포함하고 있다.  

---
1. Approach the Codes
2. Set up Python
  - `actions/setup-python@v5` : GitHub Actions에서 제공하는 파이썬 환경이다
  - `cache: 'pip'` : GitHub Actions는 [**캐싱 기능**](https://docs.github.com/ko/actions/writing-workflows/choosing-what-your-workflow-does/caching-dependencies-to-speed-up-workflows)을 제공하는데, 이 옵션을 명시해주면 pip 캐시를 복원하여 활용하고 캐시가 없을 경우 새로 설치한다
3. Install Ubuntu Dependencies
4. Install Python Dependencies
  - 프로젝트의 root 경로는 `{% raw %}${{ github.workspace }}{% endraw %}`라는 변수로 접근할 수 있다
5. Run the Script
6. Configure Git
7. Check for Differences
  - `keywords.json` 파일만 stage 에 올리고 변경사항이 있는지 확인한다. 이 부분을 추가하지 않으면 nothing to commit 에러가 발생하며 워크플로가 중단된다.
  - 이 플래그는 `has_changes`라는 변수에 저장되어 다음 step에서 사용된다
8. Commit the Change
  - 앞선 단계에서 선언한 `has_changes`으로 if 조건을 명시하고, 앞서 stage에 올린 파일을 리모트에 반영한다  
<b>

참고로 konlpy 를 사용하는 만큼 환경 구축이 까다로울 것 같아서, docker로 ubuntu 컨테이너를 하나 띄워서 시뮬레이션 했다. 나중의 활용을 위해 여기에 커맨드를 정리해둔다.  
volume binding 하지 않고 docker cp 명령어로 파이썬 파일을 복제해 썼다.

```bash
docker run --rm -d --name fake-github-actions ubuntu:latest tail -f /dev/null
docker cp /path/to/recommend.py fake-github-actions:/root/recommend.py
docker exec it fake-github-actions /bin/bash
# 파이썬 설치 후 Ubuntu, python 의 어떤 dependencies가 필요한지 테스트
```

흥미로운 지점은 **`cache: 'pip'`를 사용하지 않았을 때 실행시간이 더 짧았다**는 점인데, pip로 설치하는 패키지의 개수가 많지 않아 오히려 **캐시를 복원해오는 데 시간이 더 소요**되는 것으로 보인다. 이는 전체 시스템 디렉토리를 캐싱해야 하는 Ubuntu 패키지에 대해서도 마찬가지다. 따라서 최종 코드에서는 해당 옵션을 <u>제외</u>했다.  

## 배포 자동화

배포는 [JEKYLL DEPLOY ACTION](https://github.com/jeffreytse/jekyll-deploy-action)이라는 액션을 사용했다. 개발 스토리를 살펴보면,

> GitHub Pages는 *허용된 플러그인*만 *안전 모드* 상에서 실행해주기 때문에, 커스텀 플러그인을 사용하는 경우 로컬에서 직접 빌드하고 gh-pages로 배포해야 할 때가 있다. 

[나의 니즈](https://woocosmos.github.io/blog-history/#gh-pages-%EC%83%9D%EC%84%B1)에 딱 맞는 action이라 바로 사용해보기로 했다. 

```yaml
{% raw %}name: Build and Deploy to Github Pages

on:
  push:
    branches:
      - master

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/cache@v4
        with:
          path: |
            .asdf/**
            vendor/bundle
          key: ${{ runner.os }}-cache-${{ hashFiles('**/cache.key') }}
          restore-keys: |
            ${{ runner.os }}-cache-

      - uses: jeffreytse/jekyll-deploy-action@v0.6.0
        with:
          provider: 'github'         
          token: ${{ secrets.GITHUB_TOKEN }} 
          branch: 'gh-pages'         
          jekyll_src: './'    
{% endraw %}      
```

이미 `gh-pages` 브랜치를 만들어 배포에 사용하고 있었기 때문에 수정 없이 그대로 적용할 수 있었다. 이 워크플로를 통해 jeykll 환경을 구성, master를 기준으로 build하고 `gh-pages` 에 반영하는 과정을 자동화했다. master 브랜치로 push 이벤트가 발생할 때마다 자동으로 배포가 되는 셈이다.

*+ 2024-09-16 업데이트*  

2주 만에 블로그를 업데이트하고 master로 push 했더니 **error: RPC failed; HTTP 400 curl 92 HTTP/2 stream 7 was not closed cleanly: CANCEL (err 8)** 라는 에러와 함께 배포에 실패했다. [이슈 채널에 동일한 에러를 호소하는 사람](https://github.com/jeffreytse/jekyll-deploy-action/issues/81)이 있었다. 답변에서 안내해주는 대로 SSH 옵션을 추가했다.

> Note: SSH approach has higher priority than HTTP approach when you provide both at the same time.

```yaml
- uses: jeffreytse/jekyll-deploy-action@v0.6.0
  with:
  ...
  ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
  ...
```

하지만 마찬가지로 에러가 발생해서 `jekyll-deploy-action`의 버전을 master로 바꾸어보았다.

```yaml
- uses: jeffreytse/jekyll-deploy-action@master
```

배포에 성공했다. master 브랜치에 관련 에러가 이제 막 반영된 모양이다. (심지어 지금 시간 기준 50분 전에 올라온 [동일한 이슈](https://github.com/jeffreytse/jekyll-deploy-action/issues/89)도 있다..)

# 나가며

이로써 GitHub Actions를 활용하여 매우 간편하게 CI/CD를 자동화해보았다. 액션의 yaml 파일을 구성하는 과정이 docker-compose.yml 를 작성하는 것과 유사해서 금방 해낼 수 있었던 것 같다.  
이번 경험은 cache를 재사용하는 것이 무조건 빠르다는 선입견을 깨게 된 계기가 되기도 했다.  

실무 환경에서 CI/CD 작업을 처리할 때 Jenkins(젠킨스)도 많이 활용하는 것으로 알고 있다. 실제로 내가 속한 조직에서 ML모델 추론과 웹 서버 호스팅을 Jenkins으로 관리하기도 했다. 기회가 된다면 다음에는 Jenkins도 써보고 싶다.