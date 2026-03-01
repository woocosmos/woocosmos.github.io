---
layout: post
title: "[라즈베리 파이를 활용한 홈서버 구축] 02. 세팅"
tags: [홈서버]
comments: True
toc: true
---

# 준비물   

![image](/images/raspberry-02/raspberry__.png)

1. Raspberry Pi 4B 8GB RAM (🥕)
2. 5V 4A 라즈베리파이4 KC인증 C타입 아답터 ([구매처](https://www.devicemart.co.kr/goods/view?no=12544959&NaPm=ct%3Dmlxoh85a%7Cci%3Dcheckout%7Ctr%3Dppc%7Ctrx%3Dnull%7Chk%3D9c3aef4de945ae6dc213520b6dcbd13168c2d29c))
3. 샌디스크 32GB SD카드
4. 하기비스 미니 모니터와 microHDMI-to-HDMI 케이블
5. 냉각팬 케이스

# 세팅

1. OS 설치
2. 하드웨어 조립
3. 전원, 모니터, 키보드 연결

## 1. OS 설치

어댑터를 활용해서 SD카드를 맥북에 연결한다.  

![image](/images/raspberry-02/raspberry_01.jpg){: width="80%"}

[SD Memory Card Formatter](https://www.sdcard.org/downloads/formatter/)를 사용해서 SD카드를 포맷한다.

![image](/images/raspberry-02/raspberry_03.jpg){: width="80%"}

[Raspberry Pi Imager](https://www.raspberrypi.com/software/) 를 설치한다.

![image](/images/raspberry-02/raspberry_04.jpg){: width="80%"}

OS는 Lite 버전으로 선택했다. GUI 환경이 없는 대신 메모리 사용량이 낮은 장점이 있다.  
또한 openclaw 설치를 염두에 두어 64비트로 진행했다.

<iframe width="100%" height="400" 
  src="https://www.youtube.com/embed/ZAn3JdtSrnY" 
  frameborder="0" allowfullscreen>
</iframe>

호스트명은 `archie`로 했다. 노래 Marry Me, Archie 에서 따왔고 Architecture 라는 의미도 담았다.  

<div style="display:flex; gap:10px;">
  <img src="/images/raspberry-02/raspberry_05.jpg" style="width:50%;">
  <img src="/images/raspberry-02/raspberry_06.jpg" style="width:50%;">
</div>

## 2. 하드웨어 조립

### 방열판 붙이기
![image](/images/raspberry-02/raspberry_07.png)

라즈베리 파이에 동봉되어 있던 알루미늄 방열판 (히트싱크) 을 부착해준다. 뒷판의 양면 테이프를 떼어 붙이면 된다.  
알리에서 주문한 케이스에도 방열판이 함께 왔기 때문에 사이즈가 더 잘 맞는 것으로 골라 붙여주었다. 

<div style="display:flex; gap:10px;">
  <img src="/images/raspberry-02/raspberry_08.png" style="width:50%;">
  <img src="/images/raspberry-02/raspberry_09.png" style="width:50%;">
</div>

히트싱크는 전자장치의 열을 금속으로 전달하고 공기로 빠지도록 돕는 수동 방식의 열 교환기이다.  
라즈베리파이에 방열판을 붙이면, 메인보드 표면의 열이 금속에 흡수 되고 공기와 접촉된 방열판이 열을 식히는 역할을 하게 된다.
(이 작은 금속판이 어떤 식으로 도움을 주는 건지 궁금해서 찾아봤다)

### 케이스 조립

![제품 사진](https://ae-pic-a1.aliexpress-media.com/kf/H1577057c98a144a1b594e5d433d31ec60.jpg_220x220q75.jpg)

알리에서 작은 냉각팬이 붙은 케이스를 주문하였다 - [52Pi 냉각팬 아크릴 케이스](https://ko.aliexpress.com/item/4000200441404.html?spm=a2g0o.order_list.order_list_main.11.1ab2140fVgPXiQ&gatewayAdapt=glo2kor)

[52pi 공식 위키페이지](https://wiki.52pi.com/index.php?title=5-layer_acrylic_case_for_RPi_4B_SKU:_ZP-0080)를 참고하여 조립했다.

![alt text](/images/raspberry-02/raspberry_11.png)

네 개의 고정핀을 풀면 얇은 판들이 분해된다.

<div style="display:flex; gap:10px;">
  <img src="/images/raspberry-02/raspberry_13.jpg" style="width:50%;">
  <img src="/images/raspberry-02/raspberry_12.jpg" style="width:50%;">
</div>

파란색 판, 초록색 판 위에 메인보드를 깔고 그 위로 노란색 판과 빨간색 판을 얹어준다.

![alt text](/images/raspberry-02/raspberry_14.png)

노란색 판이 라즈베리파이 구조에 딱 맞게 나왔기 때문에, 방열판과 PoE HAT header 사이로 케이스가 잘 들어맞지 않는 문제가 있었다 (방열판을 살짝 위로 붙인 게 문제)  

케이스를 끼운 상태로 방열판을 살짝 끌어내려 딱 맞게 조립할 수 있었다. 케이스를 끼웠는데 한 쪽이 뜬다든가 하면 꼭 살펴 볼 것.

고정핀을 끼우기 전에, 맨 위 투명 판에 쿨링팬을 부착해야 한다.

![alt text](/images/raspberry-02/raspberry_15.png)

네 개의 볼트로 쿨링팬을 투명팬에 고정한다.  

<div style="display:flex; gap:10px;">
  <img src="/images/raspberry-02/raspberry_16.jpeg" style="width:50%;">
  <img src="/images/raspberry-02/raspberry_17.jpeg" style="width:50%;">
</div>

다음 쿨링팬의 전선 연결. 빨간 선을 어디에 꽂는지에 따라 power mode / quiet mode 를 선택할 수 있다고 안내되어 있다. 

![image](https://i.namu.wiki/i/4mcbAsTuqL0NPrt48jBB96ovp6I_9osurjH_xxLxVSAoLK0Le-3ow_z_o20jLj0SdqBlJbP1Ia5d8sqxctSPBb60fEwljgki_2nsPG0IOyqPxIlsPXQfLEmG8IrOtLYaTL66yTLJlLgHe_LH9El1Jw.webp)

빨간색 선을 이미지의 3.3V 파워(1번)에 연결하면 저속회전 모드, 5V 파워(2번)에 연결하면 고속회전 모드가 된다. 파란선은 6번 ground 에 연결한다.  
(나는 quiet 모드를 선택했다)

![alt text](/images/raspberry-02/raspberry_18.jpeg)

완성!

## 3. 전원, 모니터, 키보드 연결  

<div style="display:flex; gap:10px;">
  <img src="/images/raspberry-02/raspberry_23.jpeg" style="width:30%;">
  <img src="https://manuals.plus/wp-content/uploads/2021/05/Installing-Raspberry-Pi-SD-Card-featured.png" style="width:70%;">
</div>

SD 카드의 앞면이 바닥을 향하도록 메인보드에 장착해준다.

<div style="display:flex; gap:10px;">
  <img src="/images/raspberry-02/raspberry_19.png" style="width:40%;">
  <img src="/images/raspberry-02/raspberry_20.png" style="width:60%;">
</div>

이미지에 보이는 대로 전원, 모니터, 키보드를 연결하면 된다.

![alt text](/images/raspberry-02/raspberry_21.png)

제일 걱정했던 부분은 하기비스 미니 모니터와의 연결이었는데, 별도의 c타입 전원을 추가로 연결했더니 라즈베리파이의 모니터로 사용할 수 있었다.

![alt text](/images/raspberry-02/raspberry_22.jpeg)

다음 글에서는 wifi 연결과 ssh 접속에 대해 다루어보겠다.