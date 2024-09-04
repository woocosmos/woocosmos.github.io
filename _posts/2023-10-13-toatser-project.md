---
layout: post
title: 작성중// 포모도로 윈도우 앱 '토스터' 미니 프로젝트
tags: [네트워크, python]
comments: True
toc: true
---

# 개요

효율적이고 건강한 근무 습관을 위한 간단한 윈도우 앱을 만들어보기로 했다. 윈도우 팝업을 toast notification이라고 부르는 데서 착안하여 프로젝트명을 토스터*toaster*라고 지었다.

**포모도로 테크닉이란?**
> 1980년대 후반 프란체스코 시릴로가 제안한 시간 관리 방법론. 타이머를 이용해서 25분간 집중해서 일을 한 다음 5분간 휴식하는 방식이다. 토마토(*Pomodoro는 이탈리아어로 토마토를 뜻함*) 모양의 요리용 타이머에서 이름이 유래했다.


# 기획

구현하고 싶은 기능은 단순하다.

1. 출근해서 컴퓨터를 부팅하면 그날의 목표 퇴근시간을 기입한다.
2. 52분 근무하고 15분 휴식하는 타임 테이블을 윈도우 팝업으로 운영한다.
3. 45분마다 물 마시기를 팝업으로 리마인드한다.
4. 목표 퇴근 시간 20분 전부터 팝업으로 퇴근 준비를 알린다.

---

흐름도 형식으로 프로그램의 전체 로직을 표현했다. 크게 initializer와 main으로 나눠진다.
- initializer : PC가 켜졌을 때 최초 시간 정보를 세팅한다
- main : 주요 팝업 이벤트를 발생시킨다

![image](https://github.com/user-attachments/assets/43be0d2e-d87a-4817-b877-465bf2edaffa)

main 파트의 '베이스 타임 모듈'의 로직을 자세히 살펴보자.
- 30초마다 현재 시간을 체크한다 → PC 종료 전 마지막으로 체크된 현재 시간이 '종료 시간'이 된다
- 목표 퇴근 시간 전 k분은 현재 20, 10, 5분으로 설정되어 있는데, config.py 에서 before_end 리스트에 추가해주면 된다
- 목표 퇴근 시간 전 0분의 경우, 퇴근을 알리는 팝업이 발동된다

![image](https://github.com/user-attachments/assets/29386ca5-c04b-4f04-b588-be3acc5c85a3)

'타이머'는 config.py 에서 설정한 값대로 반복된다
- 물 : 45분마다 알림
- 근무/휴식 : 52+15분마다 알림
    - 근무 타이머를 먼저 시작한 후, 52분이 지나면 휴식 팝업을 임시 발동한 후 이어 휴식 타이머를 시작한다

# 구현

- Windows 11
- Python 3.12
- pipenv 로 패키지 관리

## Plyer

데스크톱, 모바일 등 다양한 플랫폼에서 작동하는 GUI 앱 개발을 위한 파이썬 프레임워크다. 이것을 설치해서,
```bash
pipenv install plyer
```
바로 윈도우 샘플 토스트를 띄울 수 있다
```python

from plyer import notification
 
notification.notify(
    title = '제목입니다.',
    message = '메시지 내용입니다.',
    app_name = "앱 이름",
    app_icon = './dao.ico', # 'C:\\icon_32x32.ico'
    timeout = 10,  # seconds
)
```
![image](https://github.com/user-attachments/assets/ffe5e460-7dc9-44d5-9a9c-c32601d687fe)

## 모듈

### 부팅시 실행

윈도우 부팅할 때 파이썬 스크립트가 실행되어야 한다. 파이썬 스크립트(py)를 실행시키는 스크립트(bat)을 윈도우 시작프로그램 폴더에 추가해준다.

```bash
python.exe /path/to/main.py
```

위와 같이 정의한 `run_toaster.bat` 파일을 윈도우 시작프로그램 폴더에 위치시키는 것이다. 시작프로그램 폴더의 경로는 이쪽이다. `C:\Users\{사용자명}\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

### 입력 팝업창

**tkinter** 를 사용해서 아주 간단한 대화창 UI를 생성했다.

```python
import tkinter as tk
from tkinter import simpledialog
 
ROOT = tk.Tk()
ROOT.withdraw()
 
# the input dialog
USER_INP = simpledialog.askstring(title="테스트 입력창",
                                  prompt="몇 시에 퇴근 할 거야?:")
# check it
print("Hello", USER_INP)
```
![image](https://github.com/user-attachments/assets/69916409-f3ed-4f6f-a1bc-ae0bdb9b4676)

### 입력어 처리

내가 어떤 형식으로 입력하더라도 (시간, 분) 튜플로 처리하는 모듈이 필요하다.  
예를 들어, 12시55분/열두시55분/12:55/1255 ... 모두 (12, 55)로 처리할 것이다.

```
def process_str(INPUT_STRING):
    UHR_dict = {
        "한": 1,
        "두": 2,
        "세": 3,
        "네": 4,
        "다섯": 5,
        "여섯": 6,
        "일곱": 7,
        "여덟": 8,
        "아홉": 9,
        "열": 10,
        "열한": 11,
        "열두": 12,
    }
    MINT_dict = {
        "일": 1,
        "이": 2,
        "삼": 3,
        "사": 4,
        "오": 5,
        "육": 6,
        "칠": 7,
        "팔": 8,
        "구": 9,
        "십": 10,
        "반": 30,
    }
 
    INPUT_STRING = INPUT_STRING.replace(" ", "")
    INPUT_STRING = INPUT_STRING.replace(":", "시")
    INPUT_STRING = INPUT_STRING.replace("분", "")
 
 
    # 숫자로만 이루어진 경우
    if INPUT_STRING.isdigit():
 
        if len(INPUT_STRING) <= 2:
            UHR = int(INPUT_STRING)
            MINT = 0
         
        else:
            tmp_UHR = int(INPUT_STRING[:2])
            if tmp_UHR > 25:
                UHR = int(INPUT_STRING[0])
                MINT = int(INPUT_STRING[1:])
            else:
                UHR = tmp_UHR
                MINT = int(INPUT_STRING[2:])
         
        if (UHR > 24) or (MINT >= 60):
            return (0, 0)
         
        return (UHR, MINT)
     
 
    elif '시' in INPUT_STRING:
        cans = INPUT_STRING.split("시")
        UHR,  MINT = cans[0], cans[1]
 
        if UHR.isdigit() and int(UHR) <= 24:
            UHR = int(UHR)
        elif UHR in UHR_dict.keys():
            UHR = UHR_dict[UHR]
 
        if MINT.isdigit() and int(MINT) < 60:
            MINT = int(MINT)
        elif len(MINT) == 1:
            MINT = MINT_dict[MINT]
        elif "십" in MINT:
            ten = 1 if not MINT.split("십")[0] else MINT_dict[MINT.split("십")[0]]
            one = 0 if not MINT.split("십")[1] else MINT_dict[MINT.split("십")[1]]
            MINT = ten * 10 + one
 
        if not MINT:
            MINT = 0
        elif isinstance(MINT, str):
            return (0, 0)
 
        return (UHR, MINT)
 
    return (0, 0)
```

### 타이머

두 개의 타이머가 필요하다.
- 타이머1. 시작 52분 후 휴식 알림, 그로부터 15분 후 근무 알림, 반복 ...
- 타이머2. 매 45분 음수 알림

이 두 개의 타이머가 동시에 돌아가도록 스레딩(Threading)을 이용했다.

...내용 추가 예정


## 데이터

data 폴더에 `work_schedule.csv` 파일로 시간 데이터를 업데이트 한다

<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #f2f2f2; /* Green color for header row */
}
</style>

| 날짜 | **booting** | **goal** | **actual** |
|-------|----------|----------|
| 2023-10-10	 | 10:11  | 19:50   | 20:51  |
| 2023-10-11	 |  10:12  | 18:20   | 18:24 |
| 2023-10-12	 | 10:36  | 19:00  | 18:48 |

- booting : 최초 부팅 시간
- goal : 목표 퇴근 시간
- actual : PC 종료 시간