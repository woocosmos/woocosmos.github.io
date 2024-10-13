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

# 개요

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


# JAX 기본

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


```python
x_2 = jnp.array([1, 2, 3])
x_2[0] = 999
# TypeError: '<class 'jaxlib.xla_extension.ArrayImpl'>' object does not support item assignment. JAX arrays are immutable.
```

반면 jax.numpy로 생성한 배열은 직접적인 수정을 허용하지 않는다. 이는 '외부 데이터'인 배열의 상태가 변형되면서 부수 효과가 발생하는 것을 방지하기 위함이다.  
만약 배열의 일부를 수정하는 작업을 진행하고 싶다면 부수 효과가 없는 순수 함수를 사용해야 한다.

```python
x_2 = jnp.array([1, 2, 3])
def modify(x):
    return x.at[0].set(999)
y = modify(x_2)
print(y)    # Array([999,   2,   3], dtype=int32)
```

여기서 `modify(x)`는 부수 효과가 없는 순수 함수라고 볼 수 있는 것이며, 책은 `jax.grad`와 `jax.jit` 같은 함수는 순수 함수로 작성되어야 한다고 설명하고 있다.  

## JIT 컴파일

변환
: 주어진 함수를 변경하거나 수정하는 방식. 성능 최적화나 자동 미분을 가능하게 함.  

책은 JAX에서 <mark>변환</mark>(transformation)이라는 키워드가 중요하다고 말한다. JAX에서 변환은 `jaxpr`, 즉 JAX 표현식이라는 중간 언어(intermediate language)를 통해 이루어진다. `jax.jit`가 대표적인 jax 변환이라고 소개된다.

```python
def selu(x, alpha=1.67, lamdba_=1.05):
    return lamdba_ * jnp.where(x > 0, x, alpha * jnp.exp(x) - alpha)
x = jnp.arange(1000000)

# 일반
selu(x).block_until_ready()

# XLA
selu_jit = jax.jit(selu)
selu_jit(x).block_until_ready() # 비동기 실행
```

위 내용은 활성화 함수 SELU(Scaled Exponential Linear Unit)를 구현하고 호출한 내용이다.

![image](https://github.com/user-attachments/assets/859541e3-c76b-4791-a1f4-b624e2570fa8)

`selu(x)` 대신에 jit 변환을 적용한 `selu_jit(x)`가 7배 빠르다고 설명하고 있다. (구글 Colab T4 기준)  

책을 읽으면서 흥미로웠던 부분은 `jax.jit`은 컴파일된 계산 그래프를 캐싱하여 재사용한다는 점이었다. 다만 `jax.jit`을 반복문 내부에서 호출할 경우 컴파일 과정이 불필요하게 반복될 수 있으니 지양하라고 안내하고 있다.

# Flax

마지막으로 Flax 를 활용한 예제를 살펴보겠다.

```python
import flax.linen as nn
from jax import random

key = random.PRNGKey(42)

class MLP(nn.Module):
    out_dims: int
    
    @nn.compact
    def __call__(self, x):
        x = x.reshape((x.shape[0], -1))
        x = nn.Dense(128)(x)
        x = nn.relu(x)
        x = nn.Dense(self.out_dims)(x)
        return x

model = MLP(out_dims=10)
x = jnp.empty((4, 28, 28, 1))

weights = model.init(key, x)
y = model.apply(weights, x)
```

*책에 import 하는 부분은 없어서 추가했다*  
`nn.Module` 에서 상속받아 모델을 생성한다는 점에서 PyTorch 와 유사한 방식의 API 라고 느껴졌고 금방 적응할 수 있겠다는 생각이 든다.

---

# 나가며

『JAX/Flax로 딥러닝 레벨업』에서 JAX 핵심 개념을 위주로 살펴보며 책을 리뷰해보았다. *요즘 시점에서 왜 굳이 새로운 딥러닝 프레임워크가 필요할까?* 라고 막연히 궁금해 하며 리뷰어 신청을 했는데, 좋은 기회로 책도 제공 받고 JAX와 Flax에 대해 가볍게 배워볼 수 있는 시간이었다.  

JAX가 지향하는 철학과 함께 그것이 녹아든 핵심 기능을 세세하게 설명해주기 때문에 JAX 입문서로 아주 알맞은 도서라는 생각이 들었다. 특히 함수형 프로그래밍 개념만을 설명하기 위해 별도 지면을 할애했다는 점에서는 JAX의 의미를 제대로 전달하겠다는 강한 의지도 보였다.  

아마 JAX로 입문하기까지 가장 큰 장벽은 앞서 내가 떠올린 것과 같이 "왜 꼭 이것이어야 하는가?" 라는 의문일 텐데, 이 책을 읽는다면 그 장벽 정도는 충분히 넘을 수 있겠다. numpy 하나로 모델을 구현하는 정도로 low-level에서 모델링과 학습 과정 등을 유연하게 통제할 수 있다는 점이 JAX/Flax의 가장 강력한 정체성이라고 느꼈다. 구글 TPU를 사용하는 ML엔지니어라면 시간을 들여서라도 JAX를 적용할 가치가 있을 듯하다.

그 외에 CLIP, GPT 같은 최신 모델의 fine-tuning 을 예제로 다룬 점도 인상적이었다. ML 분야에 입문한 이후로 출판서를 활용해서 공부를 하는 건 정말 오랜만인데, 역시 최신 책이니 최신 모델도 다루는구나 - 싶었다.  

다만 책 서문에서 이미 밝혔다시피 딥러닝 개념과 프레임워크에 대한 기본적인 지식이 있어야 책의 내용을 제대로 이해할 수 있다는 점은 염두에 둘 필요가 있겠다. 확실히 '초급서'라기보단 '입문서'로 보는 게 맞다. 또한 워낙에 고급 프레임워크다보니까 JAX/Flax 자체가 서비스(서빙)보다는 **연구**에 적합한 도구라는 생각이 들었다. 책 읽기 전과 비슷하게 *이것이 이것이 필요할까?* 라는 질문은 여전히 깔끔하게 해명되진 않았지만, 책을 읽고 나서 *언젠가 JAX를 써보고 싶다*는 욕심은 보다 뚜렷해졌다.

리뷰어로 선정하여 도서를 제공해준 출판사 제이펍에 진심으로 감사하다는 말씀을 표하며 본 리뷰를 마무리하겠다.