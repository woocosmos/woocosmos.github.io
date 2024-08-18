---
layout: post
title: "아이폰 iOS앱 개발 체험하기: 환경 세팅과 시뮬레이션"
tags: [Swift]
comments: True
toc: true
---

**이번 포스팅에서 다루는 것**
- Xcode 개발 환경을 세팅하고 Figma에서 직접 디자인한다
- 버튼을 누르면 콘솔에 텍스트가 출력되는 간단한 기능을 구현한다
- 개인 디바이스를 통해 App을 시뮬레이션한다  
  

## 개요

광복절 + 코로나 자가격리 연휴를 맞이하여 간단하게 iOS 앱 개발을 경험해보려고 한다. 언젠가 피트니스 분야의 앱을 만들어 배포해보는 게 목표이기도 하고, 애플 개발 생태계에 대해서도 늘 궁금했기 때문이다.  

오늘은 iOS 앱 개발의 '체험' 수준으로, **버튼을 누르면 콘솔에 Hello, World!를 출력하는 매우 단순한 기능을 구현**할 것이다. 그로써 개발 도구와 디자인 툴, 디바이스의 상호 작용을 개괄적으로나마 이해할 수 있을 것이다.

## 개발 환경

- MacBook Air M1
    - Xcode : 맥북 앱스토어에서 설치
    - Figma : [공식 사이트](https://www.figma.com/ko-kr/downloads/?context=confirmLocalePref)에서 데스크톱 용을 다운받아 설치
- iPhone 15 Pro (시뮬레이션용) 
    - 맥북과 유선 연결되어야 함

## 개발 과정

### Xcode 세팅

#### 1. 플랫폼 선택

![image](https://github.com/user-attachments/assets/f84f8461-826b-4e46-9a56-6a3cc2147297){: width="40%" }

처음 Xcode를 설치한 후 실행하면 어떤 플랫폼의 앱을 개발할지 고른다.  
개인적으로 애플워치 앱을 개발할 계획이 있기 때문에 iOS와 watchOS를 선택했다.

#### 2. 프로젝트 템플릿 선택

![image](https://github.com/user-attachments/assets/f804c4c3-6309-429f-a96b-e749147a4e26){: width="40%" }

신규 프로젝트를 생성한 뒤 프로젝트의 템플릿은 'App'으로 진행한다

#### 3. 프로젝트 정보 입력

![image](https://github.com/user-attachments/assets/ac2451d0-3efe-4ad5-9e1c-0c2701099b08){: width="60%" }

- Product Name : 앱 이름
- Team : 애플 계정을 추가한 다음 선택하면 된다
- Organization Identifier : 앱 식별을 위한 문자열
- Storage : iCloud 관련으로 보이는데 우선 None 으로 그대로 두고 다음 단계로 넘어갔다  

  
<p style="text-align: center;"><b><i>... 키체인을 사용하고자 합니다</i> 에러</b></p>

![image](https://github.com/user-attachments/assets/789dd7d2-26e3-4654-8eb0-ba2a36c3a5d0){: width="40%" .center-image}

프로젝트가 세팅되는 동안 이런 팝업이 떴는데, 나는 키체인 암호를 등록한 적이 없다.

![image](https://github.com/user-attachments/assets/352a8643-4867-49b3-8573-d0ef8b5508bd){: width="80%" }

원인을 정확하기 이해하기 어려우나 [이곳 칼럼](https://medium.com/a-day-of-a-programmer/macos%EC%9D%B4-%EA%B0%80-%EC%8B%9C%EC%8A%A4%ED%85%9C-%ED%82%A4%EC%B2%B4%EC%9D%B8%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B3%A0%EC%9E%90-%ED%95%A9%EB%8B%88%EB%8B%A4-cef18ebee2e9)에서는 인증서를 시스템 키체인에서 로그인 키체인으로 옮기는 방식을 제안하고 있다.

우선 나는 맥북(`cmd+space`) > '키체인 접근'에서 Apple Development 에 등록된 키들에 대해 *정보 가져오기 > 접근 제어 > 모든 응용 프로그램이 이 항목에 접근할 수 있도록 허용* 으로 변경해주었다. 다음 단계로 넘어가기 위한 임시방편으로 보안상 불안정해보이니 본격 앱 프로젝트 진행할 때는 원인을 제대로 파악하고 짚고 넘어가야 할 듯.

참고로 키체인 암호를 별도로 등록한 적이 없다면 아무것도 입력하지 않거나(null) 맥 암호를 입력하면 팝업을 지나갈 수 있다

### Fimga 디자인

![image](https://github.com/user-attachments/assets/26b58278-b21a-4936-b994-6445df182e61){: width="50%" }

피그마는 무료로 사용할 수 있는 대신 제공되는 기능이 꽤 제한된다. 무료 이용권(starter)의 경우,

- 프로젝트 하나당 파일 세 개
- 제한된 페이지 수
- 최대 30일까지 히스토리 추적

#### 1. 신규 프로젝트

![image](https://github.com/user-attachments/assets/877fbd71-c87c-4b3b-8082-e2777a190968){: width="40%" }

피그마에서 신규 파일(프로젝트)를 시작한다.

#### 2. 프레임 생성

![image](https://github.com/user-attachments/assets/494a9c88-8995-4e7a-98b1-ab7b83de1556){: width="40%" }

하단 *Frame* 을 눌러 원하는 사이즈 - _나의 경우 아이폰 15 Pro_ - 로 프레임을 생성한다

#### 3. 버튼 디자인

![image](https://github.com/user-attachments/assets/df20e149-c9d5-40ae-a063-85a81667d0df){: width="60%" }

조악하지만 이미지를 포함하여 간단한 버튼을 디자인 해보았다.  

피그마 사용법은 이 글에서 자세히 다루는 주제가 아니므로 자세한 과정은 생략하겠다.  
(파워포인트 잘 다루는 사람이라면 처음이라도 눈치껏 잘 할 수 있을 것 같다)

#### 4. 디자인 내보내기

![image](https://github.com/user-attachments/assets/42b82bef-7e46-4af9-bbf7-904f57e33bf6){: width="40%" }

우측 탭 맨 아래 *Export* 에서 png 혹은 svg 파일로 내보내기 한다. 이때 파일명은 `ButtonImage.png`로 설정했다.  

### 버튼 기능 구현

다시 Xcode 로 돌아와 버튼 기능을 구현하고 Figma에서 제작한 디자인에 적용할 차례이다

#### 디자인 가져오기

![image](https://github.com/user-attachments/assets/2753f14f-3c4c-41f6-8d56-73d654eb5961){: width="40%" }

내보내기 한 png 파일을 프로젝트의 `Assets`에 끌어다 놓는다.

#### 기능 구현하기

Xcode에서 프로젝트를 새로 시작하면 `ContentView`에 기본 스크립트가 작성되어 있다.

```swift
//
//  ContentView.swift
//  HelloWorldApp
//
//  Created by yunsoowoo on 8/16/24.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, world!")
        }
        .padding()
    }
}

#Preview {
    ContentView()
}

```

이 부분을 아래 코드로 덮어썼다. 앞서 내보내기할 때 설정한 파일명(`ButtonImage`)만 코드상에 적용해주면 된다.

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Button(action: {
                print("Hello, World!")
            }) {
                Image("ButtonImage")
                    .resizable()
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

코드를 수정하고 얼마 있다가 미리보기 뷰어에 화면이 나타났다.

![image](https://github.com/user-attachments/assets/ec0a592b-5518-491d-98ed-06b008f33649){: width="60%" }


## 시뮬레이션

스크립트를 실행하기 전, 시뮬레이션할 디바이스에서 설정해야 할 항목이 있다. *아이폰 설정 > 개인정보 보호 및 보안 > 개발자 모드*를 '켬'으로 바꾸는 것이다. (이때 한 번의 부팅 과정이 필요하다)  

![image](https://github.com/user-attachments/assets/7d612984-e0c7-4e87-b648-775277030bc1){: width="40%" }

상단에서 프로젝트를 실행할 디바이스를 선택할 수 있는데, 개발자 모드로 잘 설정해두었다면 *Management Run Destinations ...* 에서 유선 연결한 나의 휴대폰을 확인할 수 있었다.

이렇게 나의 iPhone으로 선택한 후, 실행 (**RUN**)  


<p style="text-align: center;"><b><i>신뢰하지 않는 개발자</i> 에러</b></p>

스크립트를 처음 빌드하고 실행한다면 디바이스와 Xcode 에서 이러한 에러를 마주할 것이다.

<div style="display: flex; align-items: center;">
  <img src="https://github.com/user-attachments/assets/f75707b9-de8b-4966-a257-08a43df6c672" style="width: 50%; height: 200px; object-fit: cover; margin-right: 10px;" />
  <img src="https://github.com/user-attachments/assets/943c8c16-de79-484e-a78e-e637023f36de" style="width: 50%; height: 200px; object-fit: cover;" />
</div>

이는 _아이폰 설정 > VPN 및 기기 관리 > 해당 앱 > '신뢰'_ 를 체크하는 것으로 해결 된다.

#### 성공

![image](https://github.com/user-attachments/assets/4c78169a-6345-405f-adff-16ac098a6cd6){: width="60%" }

휴대폰에 HelloWorldApp이 생성되었고, 그것을 실행할 수 있게 되었다.  
또한 목표했던 대로 이미지를 클릭하면 콘솔에 'Hello, World!'가 출력된다.  


## 마무리

지금까지 매우 간단한 앱을 만들어 시뮬레이션 하는 작업을 진행해보았다.  
이를 통해 개발자 도구와 디바이스\[destination\]가 어떻게 상호작용하는지 배울 수 있었다.

앞으로는
- 여러 페이지를 구현하고
- 입출력에 따라 페이지 간의 이동, 동작을 구현하고
- 파일 형식이 되든 앱스토어가 되든 앱을 배포하는  

... 등등의 과정을 차근차근 해내가려고 한다.


간단히 Xcode 만져보겠다고 시작한 조촐한 블로그글였는데, 한 시간 이내의 짧은 시간 동안 많은 것을 배웠고 성취감도 느껴진다.  
ChatGPT에 많은 것을 의존하며 진행했지만 앞으로 본격적으로 커스터마이징하며 나만의 앱을 구현해보겠다.

끝!