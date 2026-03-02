---
layout: post
title: "[라즈베리 파이를 활용한 홈서버 구축] 03. 접속"
tags: [홈서버]
comments: True
toc: true
---

# 개요

1. 키보드/지역 설정
2. wifi 연결
3. ssh 접속

# 키보드/지역 설정

**키보드**

[멜긱 mojo68 키보드](https://www.melgeek.com/ko-kr/products/melgeek-mojo68-plastic-see-through-custom-programmable-mechanical-keyboard)에 맞는 배열로 설정한다.

`/etc/default/keyboard`를 직접 열어서 아래처럼 수정했다.

```
XKBMODEL="pc105"
XKBLAYOUT="us"
XKBVARIANT=""
XKBOPTIONS=""
```

(키보드 레이아웃 문제와 별개로 vi 자체의 모드 혼동도 있었다. 결국 vi 사용을 포기하고 nano로 전환했다. nano는 `Ctrl + O`로 저장하고 `Ctrl + X`로 종료하면 됐다. 키보드 두번째 줄은 입력이 되고 다른 줄은 명령어 모드로 입력이 되는 걸 보면 마찬가지로 배열의 문제인 것 같은데. 흠) 

**지역**

![image](/images/raspberry-03/raspberry_00.jpg)

`sudo raspi-config` 명령을 통해 라즈베리파이 설정 도구로 접속한다.

Localisation Options 에서  
- Change Locale ⇒ `en_US.UTF-8 UTF-8`
- Change Timezone ⇒ `Seoul`


# Wi-Fi 연결

`iwlist`로 SSID 스캔은 됐는데 실제 연결이 안 됐다. `wpa_cli`로 `enable_network 0`을 실행하면 FAIL이 떴다.

아래 명령어로 NetworkManager 상태를 확인했다.

```bash
sudo systemctl is-active NetworkManager
```

결과가 `active`였다. 즉, `wlan0`는 NetworkManager가 관리하고 있었다.  
`/etc/wpa_supplicant/wpa_supplicant.conf`를 편집해봤자 의미가 없는 상황이었다.

```bash
nmcli dev wifi list
nmcli dev wifi connect "SSID" password "비밀번호" ifname wlan0
```

정상적으로 연결됐다.

# ssh 접속

라즈베리파이 설정 도구에서 Interfacing Options > P2 SSH > YES 로 ssh 접속을 허용해줬다.

```bash
hostname -I
# 또는
ip addr show wlan0
```

명령어로 IP 를 확인해준다

```bash
ssh {username}@{IP}
```

라즈베리 파이에 접속할 때의 username 을 사용하면, 동일한 내부망에 접속한 디바이스로 ssh 할 수 있다!

**사용자 계정 추가** 

라즈베리파이로 함께 작업할 동료를 위해 사용자 계정을 추가해주었다.

```
sudo adduser {새로운 계정명}
```

## ssh key 생성

```bash
ssh-keygen -t ed25519 -C "archie"
```

ssh 키를 생성한 다음


```bash
ssh-copy-id {사용자이름}@{IP 주소}
```

라즈베리파이에 공개키를 복사했다.

```
[노트북]
   |
   | 1. "접속 요청"
   v
[라즈베리파이]
   |
   | 2. 무작위 challenge 생성
   v
[노트북]
   |
   | 3. Private key로 서명
   v
[라즈베리파이]
   |
   | 4. Public key로 검증
   v
접속 허용
```

기존에 사용자 계정의 비밀번호를 직접 전송할 때와 다르게, ssh 키 기반으로 안전하게 접속할 수 있게 되었다.

궁금해서 찾아본 ssh 키 원리 (비밀번호 방식이 열쇠를 직접 건네 주는 거라면, ssh 키는 자물쇠를 건네 받고 내 열쇠로 그 자물쇠를 열 수 있다는 것을 증명하는 것과 같다)
> 서버는 로그인 시 매번 새로운 랜덤 값(challenge)을 보내고, 클라이언트는 자신의 private key로 그 값에 서명해 결과를 반환함.
> 서버는 저장된 public key로 그 서명이 유효한지 검증함으로써, private key를 직접 보지 않고도 해당 키의 소유자임을 확인함.

## ssh config 설정

접속 명령어에 IP 를 포함하는 게 번거롭게 느껴져 alias를 포함한 config 를 설정하기로 했다.

```
ssh {username}@{hostname}.local
```

기본적으로는 hostname 에 .local 을 붙여서도 접속이 가능하다.

```
Host {접속 별칭}
    HostName {hostname}.local
    User {username}
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
    AddKeysToAgent yes
    UseKeychain yes
```

`vi ~/.ssh/config`로 위 configuration을 추가해주었다. AddKeysToAgent, UseKeychain 는 후술할 SSH agent, Keychain 용.

이 상태로 `ssh {접속 별칭}`을 하면 바로 접속이 되는데, ssh 키에 대한 비밀번호를 매번 요구하는 게 귀찮았다. 

따라서,

```
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

를 입력한 후에 비밀번호를 입력하면, 깔끔하고 편리하게 접속할 수 있게 된다.

![image](/images/raspberry-03/raspberry_01.png)