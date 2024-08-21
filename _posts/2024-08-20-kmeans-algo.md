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

데이터 분석 업무를 하다보면 유저 그룹별로 특징을 비교하고 싶을 때가 있다. 그렇다면 유저 그룹은 어떤 기준으로 나눠야 하고 각 유저를 어느 그룹으로 분류할 수 있을까? 이런 문제를 만났을 때 곧잘 사용한 것이 **K-means 클러스터링 알고리즘**이다.  
그런데 데이터 특성이나 하이퍼파라미터, 최적화 알고리즘 등 다양한 변수에 따라 상이한 군집화 결과가 나오기도 했고, 분석을 진행하기 앞서 군집화가 제대로 이루어지긴 한 건지 긴가민가할 때도 있었다.

따라서 이번 포스팅에서는 K-means 알고리즘의 원리를 수학적으로 그리고 코드 상으로 이해한 후 계산 결과를 수치적으로 분석할 수 있는 메트릭을 살펴보려고 한다. 용어의 통일성을 위해 앞으로 *군집(화)* 는 *클러스터(링)* 으로 표현하겠다.

# 정의

K-means 알고리즘은 **데이터를 $k$개의 클러스터로 묶는 클러스터링 알고리즘**으로, 비지도 학습 방식에 속한다. 학습은 **클러스터 내 분산을 최소화**하는 방식으로 수행된다.

따라서 클러스터는 비슷한, 즉 가까운 데이터들이 모인 그룹을 뜻한다.

## 직관

>내용

# 목적함수

**클러스터 내 제곱합(within-cluster sum of squares, WCSS)을 최소화하는 $k$개 집합 $S$을 찾는 것**이 목적이다. 수식으로 표현하면 아래와 같다. 

$$
\mathop{\operatorname{arg\,min}}_{\mathbf{S}} \sum_{i=1}^{k} \sum_{\mathbf{x} \in S_{i}} \left\|\mathbf{x} - \boldsymbol{\mu}_{i}\right\|^{2} = \mathop{\operatorname{arg\,min}}_{\mathbf{S}} \sum_{i=1}^{k} |S_{i}| \operatorname{Var}(S_{i})
$$  


${\operatorname{arg\,min}}_{\mathbf{S}}$
 : 주어진 식을 최소화하는 $S$

${\mu}_{i}$
 : $S_i$에 속한 포인트들의 평균<sub>mean</sub> (또는 중앙값<sub>median</sub>)<br>

$\||...\||$
: 편차를 L2 Norm (유클리드 거리) 으로 계산

$\|S_i\|$
: $S_i$의 크기, 즉 해당 클러스터에 속한 포인트의 개수

$\operatorname{Var}(S_{i})$
: $S_i$의 분산, 즉 해당 클러스터에 속한 포인트들의 분산

좌항은 $k$개 클러스터별 '데이터 포인트들과 평균의 차이를 제곱하여 합산한 값(*=편차제곱합*)'의 합을 의미한다. 분산이 편차제곱의 평균이라는 점을 상기한다면, 이 값은 클러스터의 분산에 클러스터의 사이즈를 곱한 것과 같다는 것을 알 수 있다.

따라서 우항은 $k$개 클러스터별 '크기와 분산을 곱한 값(Product)'의 합으로 표현하고 있다. 개념적으로는 클러스터의 크기가 가중치로 작용하여 클러스터가 클수록 값에 기여한다고 생각할 수 있다.  

## 계산 효율성

한편 이는 $k$개 클러스터별 '데이터 쌍별 편차제곱(pairwise squared deviations)의 평균'들의 합을 최소화하는 것과 동일하다. 한 클러스터 안에서 데이터 포인트로 만들 수 있는 모든 조합에 대해 편차를 계산한 것이다. 이 값은 클러스터 내 데이터 포인트들이 평균적으로 얼마나 퍼져 있는지 나타내기 때문에 분산과 개념적으로 유사하다고 볼 수 있다.

$$
{\operatorname{arg\,min}}_{\mathbf{S}} \sum_{i=1}^{k} \frac{1}{ |S_{i}| }\sum_{\mathbf{x,y} \in S_{i}}\left\|\mathbf{x} - \mathbf{y}\right\|^{2}
$$

아래 항등식(identity)에 따르면 '클러스터 내 조합의 편차제곱합'은 '데이터 포인트들과 평균 $c_{i}$의 편차를 제곱하여 합산한 값(*=편차제곱합*)에 클러스터 사이즈의 $2$배를 곱한 것'과 동일하다. 

$$
\sum_{\mathbf{x,y} \in S_{i}}\left\|\mathbf{x} - \mathbf{y}\right\|^{2}=2|S_{i}|\sum_{\mathbf{x} \in S_{i}}\left\|\mathbf{x} - {c}_{i}\right\|^{2}
$$

이러한 계산 구조를 활용하여 **클러스터의 모든 조합에 대해 연산을 수행하지 않고도 분산을 효율적이고 간단하게 계산**할 수 있다.  

항등식의 유도 과정은 아래와 같다. 편차의 총합은 $0$이기 때문에 중간에 내적하는 부분은 사라진다.

$$
\begin{aligned}
\left\|\mathbf{x} - \mathbf{y}\right\|^{2} 
& = \left\|\mathbf{x} - {c}_{i} + {c}_{i} - \mathbf{y}\right\|^2 \\
& = \left\|\mathbf{x} - {c}_{i}\right\|^{2} -2 (\mathbf{x} - {c}_{i}) \cdot (\mathbf{y} - {c}_{i}) + \left\|\mathbf{y} - {c}_{i}\right\|^{2} \\
& = \left\|\mathbf{x} - {c}_{i}\right\|^{2} + \left\|\mathbf{y} - {c}_{i}\right\|^{2}
\end{aligned}
$$

이렇게 유도된 식에 원래대로 $\sum$을 적용한다면,

$$
\sum_{\mathbf{x,y} \in S_{i}}\left\|\mathbf{x} - \mathbf{y}\right\|^{2} 
 = \sum_{\mathbf{x,y} \in S_{i}} (\left\|\mathbf{x} - {c}_{i}\right\|^{2} + \left\|\mathbf{y} - {c}_{i}\right\|^{2})
$$

모든 점 $x$, $y$에 대해서 합산하기 때문에 두 겹의 $\sum$으로 표현할 수 있으며, $c$는 상수이기 때문에 $\sum$는 $\|S\|$의 곱셉으로 변환할 수 있다.

$$
\begin{aligned}
\sum_{\mathbf{x,y} \in S_{i}}\left\|\mathbf{x} - {c}_{i}\right\|^{2}
& = \sum_{\mathbf{x} \in S_{i}}\ \sum_{\mathbf{y} \in S_{i}}\left\|\mathbf{x} - {c}_{i}\right\|^{2} \\
& = |S_{i}| \sum_{\mathbf{x} \in S_{i}}\left\|\mathbf{x} - {c}_{i}\right\|^{2} 
\end{aligned}
$$

마지막으로 $\sum_{\mathbf{x,y} \in S_{i}}\left\|\mathbf{y} - {c}_{i}\right\|^{2}$ 에 대해서도 동일하게 유도할 수 있으므로 $2$배가 된다.

$$
2|S_{i}|\sum_{\mathbf{x} \in S_{i}}\left\|\mathbf{x} - {c}_{i}\right\|^{2}
$$

# 알고리즘
그렇다면 분산을 최소화하는 클러스터 $S$는 어떻게 찾을 수 있을까?  
K-Means 알고리즘은 초기화 이후 아래 두 동작을 반복하며 클러스터 내 제곱합(WCSS)을 감소시킨다.

1. **Assignment** : 각 데이터 포인트에 가장 가까운 클러스터를 할당하기
2. **Update** : 각 클러스터에 할당된 데이터 포인트들의 평균값을 계산하여 새로운 클러스터의 중심을 업데이트하기

iteration마다 클러스터 내 제곱합은 **항상 감소**한다. 반복을 거칠수록 데이터 포인트들은 점점 더 클러스터의 중심에 가까워지고 클러스터의 크기는 더 작아지기 때문이다. 이러한 단조 감소(monotone decreasing)의 성질로 인해 K-Means는 수렴할 수 있게 된다. 다만, K-Means 알고리즘은 '현재 상태에서' 가장 가까운 클러스터를 할당하는 탐욕적(greedy) 방식으로 진행되기 때문에 local optimum에 수렴하기 쉽다.


# 초기화
업데이트 과정에 앞서 **중심점을 먼저 지정하는 초기화 단계**를 거쳐야 한다. 적절하지 않은 중심점에서 업데이트를 시작할 경우 local optimum에 빠져버릴 수 있기 때문에 알맞은 초기화 기법을 선택하는 것이 좋다.

- **무작위 분할(Random Partition)** : 모든 데이터 포인터를 $k$개 클러스터 중 하나로 임의 할당한다
- **Forgy 알고리즘** : 데이터 포인터 중 $k$개를 임의로 선택하고 이들을 중심점으로 사용한다
- **K-means++** : 데이터 포인터 중 $1$개를 임의로 선택하고 이를 첫번째 클러스터의 중심점으로 사용한다. 



# optimal $k$

# 코드

## 의사 코드

## Scikit-Learn 모듈

# 활용

