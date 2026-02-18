---
layout: post
title: "Windows 옵시디언 앱에서 git username/password 를 계속 요구하는 문제"
tags: [생산성]
comments: True
toc: true
---

> WSL이 아니라 **Windows PowerShell/CMD** 에서 한 번 자격 증명을 해줘야 된다!

## 문제 상황

- Windows 옵시디언 앱에서 Obsidian-git 플러그인을 활성화 했으며, 터미널 환경은 WSL 을 사용하고 있었다
- SSH 방식의 인증은 permisson denied 에러가 계속 발생하였다 (터미널에서는 되는데, 옵시디언 앱에서 안 되는 현상)
- HTTP 방식의 인증은 계속해서 username/password 를 요구하였다 (터미널에서는 `git config --global user.name ...  ` 요 방식으로 해결됨)

## 해결 방법

- Windows PowerShell 이나 CMD 에서 Git Credential Manager 로 로그인해야 obsidian-git 이 해당 자격증명을 사용한다

```
# 출력되는 것 확인
git config --global --get credential.helper 

# 아무것도 없거나, manager 가 아니라면 아래 실행
git config --global credential.helper manager

# obsidian 경로에서 로그인 (Github 로그인 창)
git fetch
``` 