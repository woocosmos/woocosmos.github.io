---
layout: post
title: "[iOS] 아주아주 간단한 앱 구현 체험하기"
tags: [iOS, Swift]
comments: True
---

## 개요

연휴를 맞이하여 간단한 iOS 앱을 만들어보려고 한다.  
앱 개발은 완전히 처음이기 때문에 '버튼을 누르면 Hello, World!를 출력하는' 매우 단순한 기능부터 시작할 것이다.

**이번 포스팅에서 다루는 것**
- Xcode 개발 환경을 세팅하고 Figma에서 직접 디자인한다
- 버튼을 누르면 콘솔에 텍스트가 출력되는 간단한 기능을 구현한다
- 개인 디바이스를 통해 App을 시뮬레이션한다


## 세팅

### 기본 개발 환경
- MacBook Air M1
- iPhone 15 Pro (시뮬레이션용) : 맥북과 유선 연결

### Xcode, Figma

맥북 앱스토어에서 Xcode 를 설치한다.  
디자인은 Figma 를 사용하기로 했으므로 [공식 사이트](https://www.figma.com/ko-kr/downloads/?context=confirmLocalePref)에서 데스크톱 앱을 다운받아 설치했다.

## Xcode 프로젝트 생성

### configuration

![image](https://github.com/user-attachments/assets/f84f8461-826b-4e46-9a56-6a3cc2147297)

처음 Xcode 를 실행하면 어떤 플랫폼의 앱을 개발할지 고르도록 한다.  
개인적으로 애플워치 앱을 개발할 계획이 있기 때문에 iOS와 watchOS를 선택하고 진행했다.

### Xcode 신규 프로젝트
![image](https://github.com/user-attachments/assets/f804c4c3-6309-429f-a96b-e749147a4e26)


신규 프로젝트를 생성한 후, 'App'으로 진행한다

![image](https://github.com/user-attachments/assets/ac2451d0-3efe-4ad5-9e1c-0c2701099b08)

- Product Name : 앱 이름
- Team : 애플 계정을 추가한 다음 선택하면 된다
- Organization Identifier : 앱 식별을 위한 부분으로 보인다 - 일단은 내 이름으로 기입
- Storage : iCloud 관련으로 보이는데 우선 None 으로 그대로 두고 다음 단계로 넘어갔다  


![image](https://github.com/user-attachments/assets/789dd7d2-26e3-4654-8eb0-ba2a36c3a5d0)

프로젝트가 세팅되는 동안 이런 팝업이 떴는데, 나는 키체인 암호를 등록한 적이 없다.

![image](https://github.com/user-attachments/assets/352a8643-4867-49b3-8573-d0ef8b5508bd)

그래서 맥북의 '키체인 접근'에서 좌측 Apple Development 에 등록된 키들에 대해 *정보 가져오기 > 접근 제어 > 모든 응용 프로그램이 이 항목에 접근할 수 있도록 허용*으로 변경해주었다.  

정확히 어떤 부분인지는 모르겠지만 보안 상 위험해보이니 본격 앱 프로젝트 진행할 때는 유의해야 할 듯.  
참고로 키체인 암호를 별도로 등록한 기억이 없다면 아무것도 입력하지 않고 엔터(허용) 누르면 넘어가니 참고.

## 피그마 디자인

![image](https://github.com/user-attachments/assets/26b58278-b21a-4936-b994-6445df182e61)

피그마는 무료로 사용할 수 있다는 것이 장점으로 알고 있는데, 무료 이용권(Starter)의 경우 기능이 꽤 제한된다.

- 프로젝트 하나당 파일 세 개
- 제한된 페이지 수
- 최대 30일까지 히스토리 추적

... 꽤 박하게 느껴지지만 Fimga 를 직접 다루어보는 것도 좋은 경험이 될 것 같아 그대로 진행한다.

![image](https://github.com/user-attachments/assets/877fbd71-c87c-4b3b-8082-e2777a190968)

피그마에서 'HelloWorldApp' 프로젝트를 시작한 다음 (혹은 *New design file* 클릭)

![image](https://github.com/user-attachments/assets/494a9c88-8995-4e7a-98b1-ab7b83de1556)

하단 *Frame* 을 눌러 원하는 사이즈로 프레임을 생성한다

![image](https://github.com/user-attachments/assets/df20e149-c9d5-40ae-a063-85a81667d0df)

조악하지만 간단한 버튼을 포함한 디자인을 만들어보았다.
Figma 사용법은 여기서 다룰 내용은 아니니 자세한 생성 과정은 생략. 파워포인트 잘 다루는 사람이라면 처음이라도 눈치껏 잘 할 수 있을 것 같다.

![image](https://github.com/user-attachments/assets/42b82bef-7e46-4af9-bbf7-904f57e33bf6)

우측 탭 맨 아래 *Export* 에서 png 혹은 svg 파일로 내보내기 한다.  

![image](https://github.com/user-attachments/assets/2753f14f-3c4c-41f6-8d56-73d654eb5961)

내보내기 한 파일을 프로젝트 중 `Assets`에 끌어다 놓는다.

## 버튼 기능 구현

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

이 부분을 아래 코드로 덮어썼다.

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

곧 이어 프리뷰에 추가한 버튼이 나타났다.

![image](https://github.com/user-attachments/assets/ec0a592b-5518-491d-98ed-06b008f33649)


## 시뮬레이션

시뮬레이션 할 아이폰에서 설정 > 개인정보 보호 및 보안 > 개발자 모드를 '켬'으로 바꾼다. (한 번의 부팅 필요)  

![image](https://github.com/user-attachments/assets/7d612984-e0c7-4e87-b648-775277030bc1)

프로젝트 상단에서 Run할 디바이스를 선택할 수 있다.  
*Management Run Destinations ...* 에서 유선 연결한 휴대폰을 확인할 수 있다.

나의 iPhone으로 선택한 후, `RUN` 

#### '신뢰하지 않는 개발자' 에러

처음 실행할 때 이러한 에러가 발생할 확률이 높다.

![image](https://github.com/user-attachments/assets/f75707b9-de8b-4966-a257-08a43df6c672)

디바이스 상에서는 이렇게,

![image](https://github.com/user-attachments/assets/943c8c16-de79-484e-a78e-e637023f36de)

Xcode 상에서는 이렇게.

이는 시뮬레이션 디바이스의 설정 > VPN 및 기기 관리 > 해당 앱 > 신뢰 하는 것으로 해결 된다.

#### 성공

![image](https://github.com/user-attachments/assets/4c78169a-6345-405f-adff-16ac098a6cd6)

휴대폰에 HelloWorldApp이 생성되었고, 그것을 실행할 수 있게 되었다.  
또한 목표했던 대로 이미지를 클릭하면 콘솔에 'Hello, World!'가 출력된다.  


## 마무리

간단한 앱을 만들어 시뮬레이션 하는 작업을 진행해보았다.  
이를 통해 개발자 도구와 디바이스\[destination\]가 어떻게 상호작용하는지 배울 수 있었다.

앞으로는
- 여러 페이지를 구현하고
- 입출력에 따라 페이지 간의 이동, 동작을 구현하고
- 파일 형식이 되든 앱스토어가 되든 앱을 배포하는 것을 차근차근 해나가려고 한다.  


Xcode 활용한 앱 구현부터 경험해보겠다고 시작한 조촐한 포스트였는데, 한 시간 내외의 짧은 시간 동안 많은 걸 배운 것 같다.  
ChatGPT에 많은 것을 의존하며 진행했지만 앞으로 본격적으로 커스터마이징하며 구현해보겠다.

끝!