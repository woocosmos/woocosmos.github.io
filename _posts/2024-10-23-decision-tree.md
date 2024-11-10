---
layout: post
title: "결정트리 모델(Decision Tree)이 나의 문제를 해결해줄 수 있을까?"
tags: [머신러닝]
comments: True
toc: true
---

**요약**
```
- 내용
- 내용
- 내용
```

# 들어가며

아래와 같은 설문조사가 있다. 응답자들은 0 ~ 10점 선지 중 하나를 선택한다.

![image](https://github.com/user-attachments/assets/c7d0a9d9-b6cb-4888-93ec-d53b07c7a496)  

<br>
이러한 응답 데이터를 활용해서 특정 값을 예측하려 한다. 어떤 모델을 쓰면 좋을까? 이 문제 상황에서 가장 먼저 떠올린 것은 **결정트리 모델**이었다. 최소 0부터 최대 10으로 스케일이 한정된 정수 데이터가 주어졌으며, 결정트리 모델은 조건 (예를 들면, $x > 4$ ?)에 따라 샘플을 나누며 가지를 뻗어나가기 때문이다. 문제를 해결하는 데 결정트리가 적절한 모델이라는 *직관적인* 느낌을 받았다.  

그러나 내가 설명할 수 있는 최선은 여기까지였다. "내가 모델의 개념과 원리를 근본적으로 이해하고 있나?" 반성하게 되었고, 이 글을 쓰게 된 계기가 되었다.  

> 제한된 범위의 정수 데이터를 처리하는 데 있어서 결정트리 모델이 적절한가?

즉, 이 질문에 답변하기 위해 해당 모델을 공부한 글이다.  
그 외에 (1) 지도 학습 기반의 회귀 문제라는 점 (2) 데이터 샘플수가 매우 적다는 점 (3) feature들이 다중공선성을 띤다는 점 - 의 조건에서도 모델이 힘을 써줄 수 있는지 함께 알아보겠다.


# 개념

**결정트리 Decision Tree**, 의사결정 나무라고도 부른다.

데이터를 기준에 따라 반복 분할함으로써 계층적인 구조로 하위 집합을 형성하는 방법론

## 역사로 이해하기

결정트리 모델의 시초는 1960년대 사회과학에서 찾아볼 수 있다. 이후 1980년대 데이터 과학 분야의 발전과 함께 결정트리 방법론이 소개되고 다양한 모델이 개발, 활용되기 시작했다.

우선 1963년에 발간된 사회과학서 [Problems in the Analysis of Survey Data, and a Proposal](https://www.jstor.org/stable/2283276)에 초기 개념이 소개되었다. 고차원의 다중공선성을 띠는 설문조사 데이터를 다루기 위한 방법론으로, 오차제곱합(SSE)를 최소화하도록 하위 그룹으로 분할한다.  

사회과학 분야에서 다룰 법한 간단한 예제를 상상해봤다. 응답자의 나이, 성별, 연봉 수준을 수집했으며 이에 따른 직업 만족도를 비교하려 한다. 그런데 나이가 많을수록 연봉 수준이 높아지기도 하고, 분포 상 응답자가 여자일수록 나이대가 낮아진다. 이러한 변수 간 상호작용을 고려하면서 종속변수(직업 만족도)의 차이를 설명하기 위해 응답자를 <mark>그룹</mark>으로 나눠볼 수 있다. 30대 미만/이상으로 나눠도 좋고, 성별에 따라 나눠도 좋다. 중요한 건 나눠진 **그룹끼리 직업 만족도를 비교했을 때 차이가 커지도록** 하는 것이다.

![image](https://github.com/user-attachments/assets/ae6dc78a-b9d4-488a-9045-762f49075f6d)
그룹끼리 차이가 커지도록 그룹을 나누는 이유는, 그룹 안의 **동질성이 높다**는 것과 같은 의미이기 때문이다. 한 그룹의 평균을 예측값으로 삼는다고 치자. 그룹의 동질성이 높을수록 그룹 내 샘플들은 평균에 가까이 몰려 있을 테니 <u>실제값과 예측값 간의 오차</u>가 전반적으로 줄어든다. 

이렇듯 직업 만족도가 가장 크게 차이나는 두 그룹으로 나눠 *첫번째* 분할을 마쳤다. 그 다음에 오차가 더 큰 그룹을 선택한 다음 그 안에서 또 분할한다. 마찬가지로 그룹 간 차이가 크게 발생하는, 다시 말해 오차를 최소화하는 분할 기준을 결정한다. 분할을 반복한다.

![image](https://github.com/user-attachments/assets/8f40122d-dd94-4ca5-b1ce-b09108ae2e31)
*Problems in the Analysis of Survey Data, and a Proposal(1963), 17페이지. 오늘날 결정트리 모델을 시각화한 모습과 같다.*

사회과학 분야에서 분할의 결과는 이렇게 활용할 수 있다. '30세 미만 남성 노동직 그룹과 여성 고졸 그룹의 직업 만족도가 75점 수준으로 비슷하다' - 한편 머신러닝 분야라면? 입력 데이터에 대해 예측값을 출력하는 모델을 생성하는 데 활용할 수 있겠다! 30세 미만 남성 노동직이 입력으로 들어오면 75점 가량으로 예측하는 것이다.

이어 1984년 [Classification and Regression Trees](https://books.google.co.kr/books/about/Classification_and_Regression_Trees.html?id=JwQx-WOmSyQC&redir_esc=y)에서 결정트리 방법론을 기반으로 한 알고리즘 CART가 발표됐다. Classification And Regression Tree의 줄임말이다. 이어 CART의 업그레이드 버전인 ID3(Iterative Dichotomiser 3), C4.5, C5.0 등이 발표되면서 결정트리 모델이 더욱 발전해나갔다. 오늘날 많이 사용하는 Random Forest, XGBoost도 결정트리 방법론을 기반으로 개발된 알고리즘들이다.


# 분할의 기준

CART, ID3, C4.5, C5.0 알고리즘은 모두 결정트리 방법론을 기반으로 한다. 하지만 분할 기준을 무엇으로 설정하는지에 따라 다른 알고리즘으로 발전한 결과다. 앞서 언급한 예제에서는 간단하게 그룹별 직업 만족도의 평균값 차이를 기준으로 분할했지만, 실제 알고리즘에서는 더 효율적이거나 정교한 지표를 분할의 기준으로 삼는다.  

분할 기준의 본질은 **불순도(impurity)**를 낮추는 것이다. 앞서 그룹 내 동질성을 높이는 것이 중요하다고 언급했다. 이는 **불순도를 낮춘다**는 말과 의미가 동일하다. 

![image](https://github.com/user-attachments/assets/fbdefbc1-ead0-43b6-9e94-5c5de12ab235)

*다른 데이터가 많이 섞여 있을수록 동질성이 떨어지며 이는 곧 불순도가 높은 상태다*

분할의 결과로 얼마나 동질성이 높아지거나 낮아졌는지, 불순도를 수치화하는 방식은 크게 두 가지. 지니 계수와 엔트로피(정보 이득)다.
소개한 알고리즘 중 CART는 지니 계수를 사용하며, ID3, C4.5, C5.0은 엔트로피 및 정보 이득을 사용한다.

## 지니 계수(Gini coefficient)  

지니 계수가 높을수록 불순도가 높다고 판단한다.

$$
\text{Gini} = \sum_{j=1}^{J} p_{j}(1-p_{j}) = 1 - \sum_{j=1}^{J} p_{j}^{2}
$$  

$J$
 : 각 클래스

$p_{j}$
 : 샘플이 클래스 $j$에 속할 확률

$p_{j}(1-p_{j})$
 : 같은 클래스의 샘플을 뽑을 확률과 이어 다른 클래스의 샘플을 뽑을 확률을 곱하여 한 노드 안이 얼마나 섞여 있는지 나타내준다
 
지니 계수는 경제학에서 소득이 얼마나 불평등하게 분포되었는지 나타내는 데 쓴다. 결정트리 모델의 맥락에서는 분할된 노드에 얼마나 다른 클래스 샘플이 섞여 있는지 표현해준다.   
$p_{j}^{2}$은 그 클래스의 샘플이 두 번 연속 추출될 확률이기 때문에 값이 높을수록 동질성이 높다는 의미다. 지니 계수는 이를 전체에서 뺌으로써 불순도를 계산한 결과다.  

위에서 첨부한 이미지를 통해 분할 결과를 지니 계수로 평가해보겠다.  
  
![image](https://github.com/user-attachments/assets/ddaea2b9-6167-4293-ad45-550316e7b1e0)

각 클래스에 대해 $p(1-p)$를 구한 후 합친다.  

**좌측 노드**

- 노랑 클래스 : 4개 중 2개이므로, $p_{\text{노랑}} = 0.5$. 즉, $0.5 * (1 - 0.5)$.
- 초록 클래스 : 4개 중 1개이므로, $p_{\text{초록}} = 0.25$. 즉, $0.25 * (1 - 0.25)$.
- 검정 클래스 : 4개 중 1개이므로, $p_{\text{초록}} = 0.25$. 즉, $0.25 * (1 - 0.25)$.  

$\text{Gini}_{\text{좌측}} = 0.25 + 0.1875 + 0.1875 = 0.625$

**우측 노드**  

- 노랑 클래스 : 3개 중 1개이므로, $p_{\text{노랑}} \approx 0.333$. 즉, $0.333 * (1 - 0.3335)$.
- 초록 클래스 : 3개 중 2개이므로, $p_{\text{초록}} \approx 0.667$. 즉, $0.667 * (1 - 0.667)$.

$\text{Gini}_{\text{좌측}} = 0.222 + 0.111 = 0.445$

그 다음 분할된 개수를 기준으로 가중평균을 구한다. 좌측 노드는 네 개, 우측 노드는 세 개 샘플을 가져갔다.

$$
\text{Gini}_{\text{예시1}} = \frac{4}{7} \times 0.625 + \frac{3}{7} \times 0.445 \approx 0.548
$$  

<br>

![image](https://github.com/user-attachments/assets/2915e5fb-c00a-43ca-85ef-838f220f5032)  

해당 분할 결과에 대해서도 동일하게 구한다.

$$
\text{Gini}_{\text{예시2}} = \frac{3}{7} \times 0 + \frac{4}{7} \times 0.375 = 0.214
$$

*좌측 노드에서 다른 클래스가 추출될 확률($1-p$)는 $0$이므로 계산 결과도 $0$이 된다.*

![image](https://github.com/user-attachments/assets/fbdefbc1-ead0-43b6-9e94-5c5de12ab235)

분할 전 지니 계수가 $0.612$ 라는 점을 고려하면, 두 분할 방식 모두 지니 계수가 줄어들어 불순도가 낮아진 상태이다. 둘 중에서는 *이렇게!* 의 지니 계수 $0.214$ 가 *이렇게?* 의 $0.548$ 보다 더 낮으므로 더 적합한 분할이라고 판단할 수 있다.


## 엔트로피(Entropy)  




${\operatorname{arg\,min}}_{\mathbf{S}}$
 : 주어진 식을 최소화하는 $S$

${\mu}_{i}$
 : $S_i$에 속한 포인트들의 평균<sub>mean</sub> (또는 중앙값<sub>median</sub>)<br>

$\||...\||$
: 편차를 L2 Norm (유클리드 거리) 으로 계산

$k$개 클러스터별 '데이터 포인트들과 평균의 차이를 제곱하여 합산한 값(*=편차제곱합*)'의 합을 의미한다. 분산이 편차제곱의 평균이라는 점을 상기한다면, 이 값은 클러스터의 분산에 클러스터의 사이즈를 곱한 것과 같다는 것을 알 수 있다.


$$
\begin{aligned}
\left\|\mathbf{x} - \mathbf{y}\right\|^{2} 
& = \left\|\mathbf{x} - {c}_{i} + {c}_{i} - \mathbf{y}\right\|^2 \\
& = \left\|\mathbf{x} - {c}_{i}\right\|^{2} -2 (\mathbf{x} - {c}_{i}) \cdot (\mathbf{y} - {c}_{i}) + \left\|\mathbf{y} - {c}_{i}\right\|^{2} \\
& = \left\|\mathbf{x} - {c}_{i}\right\|^{2} + \left\|\mathbf{y} - {c}_{i}\right\|^{2}
\end{aligned}
$$


## 최적화

내용

## 초기화

내용

# 파라미터

내용


# 코드

## sklearn 라이브러리 활용
sklearn.Cluster의 [KMeans 모듈](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)과 sklearn.metrics [silhouette_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.silhouette_score.html)를 적용할 수 있다.  

```python
from sklearn.cluster import KMeans
```  

**입력 파라미터**  
- `n_clusters` : 클러스터 개수
- `init` : 초기화 기법 (디폴트는 `k-means++`)
 
**속성**  
- `cluster_centers_` : 각 클러스터 중심점의 좌표
- `inertia_` : 클러스터 내 제곱합(WCSS)  
<br>

## Python 구현 (from scratch)

**거리 함수 (L2 Norm)**
```python
import numpy as np

def euclidean(point, data):
    return np.sqrt(np.sum((point - data)**2, axis=1))
```

**중심점 초기화 (Kmeans++)**
```python
import random

k = 3
# 최초 클러스터 중심점 1개 추출
centroids = [random.choice(X)]
for _ in range(k-1):
    # 더 가까운 클러스터의 중심점까지 거리 계산
    dists = np.min([euclidean(centroid, X) for centroid in centroids], axis=0)
    dists = dists**2
    dists /= np.sum(dists)

    # 거리 기반의 확률로 추출
    new_centroid_idx = np.random.choice(range(len(X)), size=1, p=dists)
    centroids.append(X[new_centroid_idx[0]])
```

**목적함수 최적화 (iteration)**
```python
max_iter = 100
n_iter = 0
prev_centroids = None

# 중심점이 하나라도 변경되거나 max_iter 미만일 때 반복
while np.not_equal(centroids, prev_centroids).any() and n_iter < max_iter:
    sorted_points = [[] for _ in range(k)]

    # Assignment : 포인트마다 가장 가까운 클러스터 할당
    for point in X:
        dists = euclidean(point, centroids)
        centroid_idx = np.argmin(dists)
        sorted_points[centroid_idx].append(point)
    prev_centroids = np.copy(centroids)

    # Update : 클러스터별로 평균값 업데이트하기
    centroids = []
    for cluster in sorted_points:
        if len(cluster) > 0:
            centroid = np.mean(cluster, axis=0)
        else:
            # 클러스터가 비어 있으면 업데이트 전 기존 평균값 사용
            centroid = prev_centroid[len(centroids)]
        centroids.append(centroid)

    n_iter += 1
```

**실루엣 지수 (Silhouette Score)**
```python
# i번째 데이터 포인트에 대한 점수 계산

# Cohesion (a(i))
own_cluster = labels[i]
own_cluster_points = X[labels == own_cluster]
if len(own_cluster_points) > 1:
    a_i = np.mean(euclidean(point, own_cluster_points))
else:
    a_i = 0

# Separation (b(i))
b_i = float('inf')
for centroid_idx, centroid in enumerate(centroids):
    if centroid_idx != own_cluster:
        other_cluster_points = X[labels == centroid_idx]
        if len(other_cluster_points) > 0:
            avg_dist = np.mean(euclidean(point, other_cluster_points))
            b_i = min(b_i, avg_dist)

score = (b_i - a_i) / max(a_i, b_i) if max(a_i, b_i) > 0 else 0
```