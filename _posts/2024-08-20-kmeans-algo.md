---
layout: post
title: "K-Means Clustering 군집화 알고리즘"
tags: [머신러닝]
comments: True
toc: true
---

**요약**
```
- 요약1
- 요약2
- 요약3
```

# 개요

데이터 분석 업무를 하다보면 유저 그룹별로 특징을 비교하고 싶을 때가 있다. 그렇다면 유저 그룹은 어떤 기준으로 나눠야 하고 각 유저를 어떤 그룹으로 분류할 수 있을까? 이런 문제를 만났을 때 곧잘 사용한 것이 **K-means 클러스터링 알고리즘**이다.  
그런데 데이터 특성이나 하이퍼파라미터, 최적화 알고리즘 등 다양한 변수에 따라 상이한 군집화 결과가 나오기도 했고, 분석을 진행하기 앞서 *군집화가 제대로 이루어지긴 한 건지* 긴가민가할 때도 있었다.

따라서 이번 포스팅에서는 K-means 알고리즘의 원리를 수학적으로 그리고 코드 상으로 이해한 후 계산 결과를 수치적으로 평가, 분석할 수 있는 메트릭을 살펴보려고 한다. 용어의 통일성을 위해 앞으로 *군집(화)* 는 *클러스터(링)* 으로 표현하겠다.

**키워드** : `K-Means`, `클러스터링`, `비지도 학습`

# 정의

K-means 알고리즘은 데이터를 k개의 클러스터로 묶는 클러스터링 알고리즘으로, 비지도 학습 방식에 속한다. 클러스터 간 거리 차이의 분산을 최소화하는 방식으로 수행된다.

따라서 클러스터는 비슷한, 즉 가까운 데이터들이 모인 그룹을 뜻한다.

## 직관

>한 클러스터 안의 평균은 그 클러스터를 가장 잘 '대표'하는 점이 된다. 그 클러스터 안의 데이터들이 '평균적으로' 그 점과 가장 가깝기 때문이다.

# 알고리즘

n개 샘플은 d차원의 실벡터(real vector)

클러스터 내의 제곱합(Sum of Squares)을 최소화함으로써 n개 데이터 샘플을 k개 set로 나누는 것을 목표한다

"제곱합(Sum of Squares)"  

$$
\mathop{\operatorname{arg\,min}}_{\mathbf{S}} \sum_{i=1}^{k} \sum_{\mathbf{x} \in S_{i}} \left\|\mathbf{x} - \boldsymbol{\mu}_{i}\right\|^{2} = \mathop{\operatorname{arg\,min}}_{\mathbf{S}} \sum_{i=1}^{k} |S_{i}| \operatorname{Var}(S_{i})
$$  


${\operatorname{arg\,min}}_{\mathbf{S}}$
 : 주어진 식을 최소화하는 $S$를 찾는다

${\mu}_{i}$
 : $S_i$에 속한 값들의 평균<sub>mean</sub> (또는 중앙값<sub>median</sub>)<br>

$\|S_i\|$
: $S_i$의 크기

$\||...\||$
: L2 Norm 

$\|S_i\|\operatorname{Var}(S_{i})$
: $\|S_i\|$와 $\operatorname{Var}(S_{i})$의 곱(Product). $S_i$의 크기가 가중치로 적용된 분산. 즉, 크기가 큰 $S_i$일수록 합산(sum)에 기여한다 

<br>
여기서 평균이라 함은 $x$의 총합을 $S_i$의 크기로 나눈 값인데, $\frac{1}{\|S_{i}\|}\sum_{\mathbf{x} \in S_{i}}\mathbf{x}$ <br>
이는 그 클러스터 안에서 데이터 쌍별(pairwise) 편차제곱(squared deviations)의 평균을 최소화하는 $S$를 찾는 것과 동일하다.  

$${\operatorname{arg\,min}}_{\mathbf{S}} \sum_{i=1}^{k} \frac{1}{\|S_{i}\|}\sum_{\mathbf{x,y} \in S_{i}}\left\|\mathbf{x} - \mathbf{y}\right\|^{2}$$

## 표준
## 변형
## 복잡도

# optimal $k$

# 코드

## 의사 코드

## Scikit-Learn 모듈

# 활용

