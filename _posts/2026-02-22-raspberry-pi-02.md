---
layout: post
title: "[라즈베리 파이를 활용한 홈서버 구축] 02. 세팅"
tags: [홈서버]
comments: True
toc: true
---

# 준비물 

1. Raspberry Pi 4B 8GB RAM (🥕)
2. 5V 4A 라즈베리파이4 KC인증 C타입 아답터 ([구매처](https://www.devicemart.co.kr/goods/view?no=12544959&NaPm=ct%3Dmlxoh85a%7Cci%3Dcheckout%7Ctr%3Dppc%7Ctrx%3Dnull%7Chk%3D9c3aef4de945ae6dc213520b6dcbd13168c2d29c))
3. 샌디스크 32GB SD카드
4. 하기비스 미니 모니터와 microHDMI-to-HDMI 케이블
5. 냉각팬 케이스

# 세팅

## 1. OS 설치

![image](/images/raspberry_02.jpg){: width="80%"}

어댑터를 활용해서 SD카드를 맥북에 연결한다.  
SD 카드 → USB 어댑터 → C타입 어댑터 😬  

![image](/images/raspberry_01.jpg){: width="80%"}

맥 디스크 유틸리티에서 ExFat 포맷으로 지우기를 진행한다.
[SD Memory Card Formatter](https://www.sdcard.org/downloads/formatter/)를 사용해서 SD카드를 포맷한다.

![image](/images/raspberry_03.jpg){: width="80%"}

[Raspberry Pi Imager](https://www.raspberrypi.com/software/) 를 설치한다.

![image](/images/raspberry_04.jpg){: width="80%"}

OS는 Lite 버전으로 선택했다. GUI 환경이 없는 대신 메모리 사용량이 낮은 장점이 있다.  
또한 openclaw 설치를 염두에 두어 64비트로 진행했다.

<iframe width="100%" height="400" 
  src="https://www.youtube.com/embed/ZAn3JdtSrnY" 
  frameborder="0" allowfullscreen>
</iframe>

호스트명은 `archie`로 했다. 노래 Marry Me, Archie 에서 따왔고 Architecture 라는 의미도 담았다.  

![image](/images/raspberry_05.jpg){: width="80%"}

설치! .. 하다가 특정 % 에서 "첨부된 디스크는 이 컴퓨터에서 읽을 수 없습니다" 라는 에러가 반복적으로 나타나서 sd 카드나 어댑터 불량이 의심됨
sd 카드랑 허브 마련해서 다시 돌아오겠습니다