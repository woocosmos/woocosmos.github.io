---
layout: post
title: "작성중// GitHub Actions 활용한 배포 및 실행 자동화"
tags: [DevOps]
comments: True
toc: True
---

# 개요

[GitHub Actions](https://docs.github.com/ko/actions)를 사용하여 특정 스크립트를 실행시키고 배포하는 워크플로를 자동화한다.  

자동화가 필요한 이유는 두 가지다.

1. 블로그 포스트가 늘어남에 따라 [추천 키워드의 점수](https://woocosmos.github.io/search-page-dev/#%ED%82%A4%EC%9B%8C%EB%93%9C-%EC%B6%94%EC%B2%9C)를 다시 집계하고 업데이트해야 한다
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
워크플로 안에서 단계로 구성된 집합. 이 단계들은 같은 실행기(runner) 안에서 작동하기 때문에 데이터를 공유할 수 있다. 디폴트로 작업들끼리는 종속성이 없기 때문에 병렬로 실행되나, 한 작업이 다른 작업에 종속되게 하면 완료를 기다린다.

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

추천 키워드를 업데이트할 조건을 먼저 정해야 한다. master 브랜치를 대상으로 두 가지 조건을 정의했다.

- post로 시작하는 브랜치의 PR를 완료했을 때 (보통 post 브랜치에서 포스트를 작성하다가 완성했을 때 master로 머지시키기 때문)
- push 의 커밋 메세지에 'post'가 포함되어 있을 때 (master 브랜치에서 바로 수정하여 push할 때도 있으므로)

```
name: Update the Keywords

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
    - name: my-step
      run: echo Hello World?!
```

테스트를 위해 post 로 시작하는 브랜치로 PR를 등록, merge를 완료했고

![image](https://github.com/user-attachments/assets/60010781-a7c4-4d0a-b08d-f930d1fa5226)

정상적으로 job이 작동한 것을 확인했다

![image](https://github.com/user-attachments/assets/a5429a7c-5ff3-4d42-baaf-0251b2f848d2)

다음으로 `recommend.py`를 실행하기 위한 dependency 설치 작업을 정의한다.

참고로 konlpy 의 환경 구축이 까다로울 것 같아서 테스트를 docker의 ubuntu:lateset 이미지로 컨테이너를 띄워서 시뮬레이션 했다. (파이썬은 따로 설치해줘야 한다)

docker run --rm -d --name fake-github-actions ubuntu:latest tail -f /dev/null
docker cp /mnt/c/blog/woocosmos.github.io/assets/recommend.py fake-github-actions:/root/recommend.py
 docker exec it fake-github-actions /bin/bash


```
jobs:
  my-job:
    if: (github.event_name == 'pull_request' &&
            github.event.pull_request.merged == true && 
            startsWith(github.event.pull_request.head.ref, 'post/')) ||
        (github.event_name == 'push' &&
            contains(github.event.head_commit.message, 'post'))
    runs-on: ubuntu-latest
    steps:
    - name: set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.8'
        architecture: 'x64'
    - name: Display Python version
      run: python -c "import sys; print(sys.version)"
```

나중에 CI/CD 작업이 필요할 때 Jenkins(젠킨스)도 사용해보고 싶다. dsa