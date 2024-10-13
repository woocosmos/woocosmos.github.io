---
layout: post
title: 📖 『JAX/Flax로 딥러닝 레벨업』(제이펍) 리뷰
tags: [리뷰]
comments: True
toc: True
---

![IMG_4524](https://github.com/user-attachments/assets/76f397ea-6ed8-404c-99bc-e8c43ca4c04d){: .center-image}  

<br>
IT 실용서 전문 출판사 제이펍으로부터 책 『[**JAX/Flax로 딥러닝 레벨업**](https://product.kyobobook.co.kr/detail/S000214172972)』를 무료로 제공 받았다.  

도서명
: JAX/Flax로 딥러닝 레벨업

지은이 
: 이영빈 , 유현아 , 김한빈 , 조영빈 , 이태호 , 장진우 , 박정현 , 김형섭 , 이승현

발행사
: 제이펍

초판 발행 
: 2024년 9월 23일

정가
: 24,000원

---

베타리더 후기에 따르면 『JAX/Flax로 딥러닝 레벨업』은 무려 국내 최초 JAX 입문서라고 한다. 최근 성장하고 있는 JAX 생태계의 활성화에 기여하는 의미가 있겠다.  

개인적으로 JAX는 '고성능 딥러닝 연산이 가능한 numpy' 정도로 알고 있는 상태였고 직접 활용해본 적은 없었다. 이번 책 리뷰를 계기로 Numpy와의 차이점과 JAX/Flax의 주요 특징을 이해하고 실제 튜토리얼을 따라가는 경험을 쌓으려 한다. 

책은 크게 JAX/Flax를 소개하는 부분과 JAX/Flax를 활용하여 딥러닝 모델을 구현하는 부분으로 이뤄져 있다. 파이썬 프로그래밍과 기본적인 머신러닝 개념은 책을 읽기 위한 선수 지식으로 요구된다.

# Jax란?

> 한마디로 표현하면 자동 미분과 XLA를 결합해서 사용하는 고성능 머신러닝 프레임워크입니다 ... JAX의 가장 큰 강점은 XLA를 적용해서 사용할 수 있다는 점입니다.  

PyTorch, Tensorflow 등 다른 딥러닝 프레임워크도 자동 미분을 지원하지만, JAX는 이에 더해 **XLA(Accelerated Linear Algebra)**이 가능하다는 것이 핵심이다. XLA는 GPU/TPU 위에서 numpy를 컴파일하고 실행하는 컴파일러다. JAX는 JIT(Just-In-Time) 컴파일을 통해 파이썬 코드를 XLA에 최적화된 기계어로 변환하기 때문에 [PyTorch의 동적 그래프](https://woocosmos.github.io/pytorch-basic/#autograd-%EC%9E%90%EB%8F%99%EB%AF%B8%EB%B6%84)보다도 빠르고 효율적으로 연산할 수 있다는 것이다.  

파이썬은 기본적으로 인터프리터 방식으로 실행되기 때문에 코드를 한 줄씩 읽고 해석하는 데 시간이 소요된다. 여기서 JIT 컴파일을 사용한다면 **코드를 실행하는 시점**에 성능과 연관되는 일부분을 미리 기계어로 컴파일하여 속도가 빨라진다고 이해했다.  

## Flax

> JAX + Flexibility를 합쳐져서 만들었으며 엔지니어들이 JAX를 조금 더 쉽게 사용할 수 있는 프레임워크이며, 다른 딥러닝 프레임워크들처럼 레이어(층) 개념을 지원합니다.  

여기까지 읽었을 때 Tensorflow & Keras 와 유사한 개념(관계)이 아닌가 싶었는데, JAX/Flax는 Low-level의 섬세한 컨트롤이 가능하다는 점에 방점이 찍혀 있는 것 같다. 그와 달리 Keras는 높은 수준의 추상화가 이루어져 있고 사용자 친화적이다. 똑같이 구글에서 개발한 프레임워크지만 지향하는 철학이 다르다는 점이 재밌다.  

책에 따르면 구글에서 개발한 모델들은 대부분 JAX로 작성되어 있고, 심지어 Hugging Face의 기존 모델들도 JAX로 변환하고 있다고 한다.  

## 함수형 프로그래밍

JAX/Flax의 활용 방식을 더 잘 파악할 수 있도록 책은 **함수형 프로그래밍**에 대해서 별도 챕터로 설명한다. 명령어의 흐름(순서)대로 상태를 변경하고 결과를 전달하는 것이 핵심인 절차적 프로그래밍과 다르게, 함수형 프로그래밍은 외부 상태와 상관없이 주어진 입력에 동일한 출력값을 내놓는 *순수 함수*를 사용한다. 따라서 *부수 효과*가 제거되며 상태가 변화하지 않는 불변성을 강조한다. 여기서 절차적 프로그래밍과 함수형 프로그래밍을 설명할 때 간단한 파이썬 예제가 첨부되어 있어서 이해가 편했다.  

JAX, 나아가 딥러닝 연산에 있어서 이 개념을 이해하는 것이 중요한 이유를 세 가지로 제시하고 있다.

1. XLA 컴파일에 최적화된 처리가 가능해진다
2. 병렬처리와 분산처리에 유용하다
3. 코드를 모듈화함으로써 재사용성이 높아진다


# JAX 기능

백문이 불여일견, 직접 JAX 를 활용해보며 책의 내용을 따라가보겠다.

## 설치

다행히도 JAX가 Mac M1을 공식 지원한다고 하여 `conda`로 쉽게 설치할 수 있었다.

```bash
conda create -n jax-env python=3.9
conda activate jax-env
pip install jax jaxlib
```

import 하기

```python
import jax
import jax.numpy as jnp
```

## numpy와 비교

```python
x1 = jnp.array([1.0, 2.0, 3.0])
x2 = jnp.array([4.0, 5.0, 6.0])
y = x1 + x2
print(y)        # [5. 7. 9.]
print(type(y))  # <class 'jaxlib.xla_extension.ArrayImpl'>
```

위 예제에서 보듯 jax.numpy는 기존 numpy 와 거의 똑같은 API를 제공하고 있다.  


## grad 함수

```python
def func(x):
    return x**2

grad = jax.grad(func)
print(grad(3.))    # Array(6., dtype=float32, weak_type=True)
```

JAX에서 미분, 즉 gradient를 계산해주는 `grad`를 사용한 예제다.

## 부수 효과의 방지

JAX는 부수 효과를 제거하는 함수형 프로그래밍의 제약을 따르고 있다. 책에서 제공해준 아래 예제를 참고해보자.

```python
x_1 = np.array([1, 2, 3])
x_1[0] = 999
print(x_1)      # [999   2   3]
```

numpy로 생성한 배열은 직접 접근해서 요소를 변경할 수 있다. 