---
layout: post
title: "websocket: 클라이언트-서버의 양방향 통신"
tags: [네트워크, python]
comments: True
toc: true
---

# Websockets

클라이언트(브라우저)와 서버 간의 실시간 양방향 통신을 가능하게 하는 프로토콜 WebSocket

**HTTP 프로토콜과의 차이는?**  

HTTP 프로토콜은 요청(request)에 응답(response)을 주면 연결이 끊긴다.
반면, websocket은 <u>연결을 지속적으로 유지</u>할 수 있기 때문에 <mark>실시간 통신</mark>이 가능하다.  


# 작동 원리

1. 클라이언트가 HTTP프로토콜을 사용해 websocket handshake 요청을 서버로 전송
2. handshake가 종료되면 HTTP에서 WebSocket 프로토콜로 전환하는 'Protocol Swtiching' 진행, 새로운 소켓 생성
    - `ws://` : 일반 WebSocket
    - `wss://` : SSL을 사용한 보안 WebSocket (HTTPS와 유사하게 암호화됨)
3. 서버와 클라이언트가 실시간 양방향 통신을 수행
4. 이벤트 발생에 따라 클라이언트나 서버가 연결을 종료

# 예제

**server.py**
```python
import websockets
import asyncio
 
async def hello(websocket, path):
    name = await websocket.recv()
    print(f"< {name}")
 
    greeting = f"안녕하세요, {name}!"
     
    await websocket.send(greeting)
    print(f"> {greeting}")
 
async def main():
    async with websockets.serve(hello, '0.0.0.0', 8765):
        await asyncio.Future()
         
if __name__ == '__main__':
    asyncio.run(main())
```

**client.py**
```python
import websockets
import asyncio
 
async def hello():
    uri = "ws://0.0.0.0:8765"
    async with websockets.connect(uri) as websocket:
        name = input('what is your name? ')
        await websocket.send(name)
        print(name)
 
        greeting = await websocket.recv()
        print(greeting)
 
if __name__ == '__main__':
    asyncio.run(hello())
```

1. `server.py` 를 실행한다
2. `client.py` 를 실행한다
3. 클라이언트가 이름[입력 내용]을 서버에 전달한다
![image](https://github.com/user-attachments/assets/49a036da-91f9-4ed7-a707-687b8b83643b)
4. 이름[입력 내용]을 전달 받은 서버가 인사말을 붙여 클라이언트에 전달한다
5. 인사말+이름을 전달받은 클라이언트가 내용을 출력한다
![image](https://github.com/user-attachments/assets/a7368cbc-7b01-4f41-accc-e047d998e0ee)

클라이언트 종료. 서버는 유지된다.