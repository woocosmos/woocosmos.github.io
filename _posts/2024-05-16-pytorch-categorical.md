---
layout: post
title: PyTorch의 확률분포 클래스 Categorical
tags: [PyTorch]
comments: True
toc: true
---

**요약**
```
- 분포값(softmax❌ 정규화❌)을 인자로 주어 Categorical 클래스 객체를 생성하면 파라미터에 따라 정규화된다
- 입력값이 probs 일 경우 log을 적용하여 logits 속성을, logits일 경우 softmax를 적용하여 probs 속성을 저장한다
- sample() 메소드를 사용하여 주어진 확률분포 기반으로 샘플링 할 수 있으며, log_prob() 메소드는 샘플된 값에 해당하는 logits를 리턴한다
```

*[공식 문서](https://pytorch.org/docs/stable/distributions.html#categorical)와 [공식 소스](https://pytorch.org/docs/stable/_modules/torch/distributions/categorical.html#Categorical.log_prob)를 참고하여 작성*

# Categorical

```
from torch.distributions.categorical import Categorical
```

probs 또는 logits 를 파라미터로 받아 확률분포를 구성하는 클래스. 
- logits : unnormalized log probabilities


# 객체

softmax를 거치지 않은 raw output 배치 샘플을 준비한다. 4개 클래스에 대한 확률값이고 배치 사이즈는 2이다.

```python
# torch.Size([2, 1, 4])
raw_output = torch.tensor(
            [[[0.25, 0.25, 0.25, 0.25,]],
             [[0.33, 0.33, 0.33, 0.01]]]
            )
```

`Categorical` 클래스를 사용하여 두 개 확률분포 객체를 생성한다. 하나는 probs로, 하나는 logits로 파라미터화한다. 명시하지 않는 경우 default는 prob이다.  
```python
dist1 = Categorical(probs=raw_output)
dist2 = Categorical(logits=raw_output)
```


클래스 내부적으로 **input을 정규화(normalize) 하는 과정**이 포함되어 있다. logits의 경우 [log-sum-exp 공식](https://gregorygundersen.com/blog/2020/02/09/log-sum-exp/)을 활용한다.
```python
def __init__ ...
    # dist1
    if probs is not None:
        self.probs = probs / probs.sum(-1, keep_dim=True)
    # dist2
    else:
        self.logits = logits - logits.logsumexp(dim=-1, keepdim=True)
```


# 속성

내부적으로 `probs`, `logits` 속성을 계산하는데, 파라미터에 따라 다른 모듈을 사용한다.
- logits 입력 => probs 속성 계산
```python
# logits_to_probs
F.softmax(logits, dim=-1)
```
- probs 입력 => logits 속성 계산
```python
# probs_to_logit
ps_clamped = clamp_probs(probs) # eps ~ 1-eps 사이의 값으로 클립핑
torch.log(ps_clamped)
```  

정리하자면,
- probs 파라미터 입력
    - `probs` 속성 : 입력값이 이미 정규화된 상태였기 때문에 동일하게 출력
    - `logits` 속성 : `probs_to_logit` 모듈을 적용한 결과 출력

    ```python
    dist1.probs
    # tensor([[[0.2500, 0.2500, 0.2500, 0.2500]],
    #        [[0.3300, 0.3300, 0.3300, 0.0100]]])
    
    dist1.logits
    # tensor([[[-1.3863, -1.3863, -1.3863, -1.3863]],
    #        [[-1.1087, -1.1087, -1.1087, -4.6052]]])
    ```
- logits 파라미터 입력
    - `probs` 속성 : `logits_to_probs` 모듈을 적용한 결과 출력
    - `logits` 속성 : log-sum-exp 공식으로 정규화된 결과

    ```python
    dist2.probs
    # tensor([[[0.2500, 0.2500, 0.2500, 0.2500]],
    #        [[0.2684, 0.2684, 0.2684, 0.1949]]])
    
    dist2.logits
    # tensor([[[-1.3863, -1.3863, -1.3863, -1.3863]],
    #        [[-1.3154, -1.3154, -1.3154, -1.6354]]])
    ```

이들 속성은 `@lazy_property`로 값이 계산되기 때문에 <u>호출하기 전까지 계산되지 않는다</u>. 예를 들어 `dist1.logits` 을 호출하기 전까지 내부적으로 logits==None 으로 유지된다.  


# 샘플링

`sample` 함수는 확률분포를 기반으로 표본을 샘플링할 수 있다. `torch.multinomial`으로 계산하는 것과 동일.

```python
s1 = dist1.sample() # [[1], [1]]
s2 = dist2.sample() # [[2], [0]]
```

이렇게 샘플링된 값에 해당하는 logits을 추적할 수도 있다. `logits` 속성에서 인덱싱해온 결과로 보면 된다. 
```python
dist1.log_prob(s1) # [[-1.3863], [-1.1087]]
dist2.log_prob(s2) # [[-1.3863], [-1.3154]]
```
