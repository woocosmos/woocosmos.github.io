---
layout: post
title: "K-Means Clustering 군집화 알고리즘"
tags: [머신러닝]
comments: True
toc: true
---

**요약**
```
- K-Means 클러스터링 알고리즘은 클러스터 내 분산을 최소화함으로써 가까운 데이터끼리 클러스터를 형성하는 비지도 학습 모델이다
- 분산을 전반적으로 충분히 감소시키면서 데이터 포인트를 유의미하게 그룹화하는 클러스터 개수를 찾는다
- 중심점을 세팅하는 초기화 방법론을 적용한 후, 클러스터 할당과 중심점 업데이트를 반복하며 최적화한다
```

# 개요

데이터 분석 업무를 하다보면 유저 그룹별로 특징을 비교하고 싶을 때가 있다. 그렇다면 유저 그룹은 어떤 기준으로 나눠야 하고 각 유저를 어느 그룹으로 분류할 수 있을까? 이런 문제를 만났을 때 곧잘 사용한 것이 **K-means 클러스터링 알고리즘**이다.  
그런데 데이터 특성이나 하이퍼파라미터, 최적화 알고리즘 등 다양한 변수에 따라 상이한 군집화 결과가 나오기도 했고, 분석을 진행하기 앞서 군집화가 제대로 이루어지긴 한 건지 긴가민가할 때도 있었다.

따라서 이번 포스팅에서는 K-means 알고리즘의 정의와 원리를 수식과 함께 이해하고 코드로 그 내용을 구현한다. 용어의 통일성을 위해 앞으로 *군집(화)* 는 *클러스터(링)* 으로 표현하겠다.

# 정의

K-means 알고리즘은 **데이터를 $k$개의 클러스터로 묶는 클러스터링 알고리즘**으로, 비지도 학습 방식에 속한다. 학습은 **클러스터 내 분산을 최소화**하는 방식으로 수행된다.

따라서 클러스터는 가까운 데이터들이 모인 그룹을 뜻한다.


# 목적

**클러스터 내 제곱합(within-cluster sum of squares, WCSS)을 최소화하는 $k$개 집합 $S$을 찾는 것**이 목적이다. 목적함수는 아래와 같다. 

$$
\mathop{\operatorname{arg\,min}}_{\mathbf{S}} \sum_{i=1}^{k} \sum_{\mathbf{x} \in S_{i}} \left\|\mathbf{x} - \boldsymbol{\mu}_{i}\right\|^{2}
$$  


${\operatorname{arg\,min}}_{\mathbf{S}}$
 : 주어진 식을 최소화하는 $S$

${\mu}_{i}$
 : $S_i$에 속한 포인트들의 평균<sub>mean</sub> (또는 중앙값<sub>median</sub>)<br>

$\||...\||$
: 편차를 L2 Norm (유클리드 거리) 으로 계산

$k$개 클러스터별 '데이터 포인트들과 평균의 차이를 제곱하여 합산한 값(*=편차제곱합*)'의 합을 의미한다. 분산이 편차제곱의 평균이라는 점을 상기한다면, 이 값은 클러스터의 분산에 클러스터의 사이즈를 곱한 것과 같다는 것을 알 수 있다.

$$
 \mathop{\operatorname{arg\,min}}_{\mathbf{S}} \sum_{i=1}^{k} |S_{i}| \operatorname{Var}(S_{i})
$$

$\|S_i\|$
: $S_i$의 크기, 즉 해당 클러스터에 속한 포인트의 개수

$\operatorname{Var}(S_{i})$
: $S_i$의 분산, 즉 해당 클러스터에 속한 포인트들의 분산

따라서 $k$개 클러스터별 '크기와 분산을 곱한 값(Product)'의 합으로도 표현할 수 있다. 직관적으로는 클러스터의 크기가 가중치로 작용하여 클러스터가 클수록 합산값에 기여한다고 볼 수 있으며, 클러스터들의 전반적인 분산합을 최소화해야 한다는 점에서 K-Means 알고리즘의 목적과 동일하다.


## 계산 효율성

K-Means 알고리즘의 정의로 돌아와 **클러스터 내 분산**이라는 키워드를 다시 생각해보자. 앞서 목적함수에서는 '데이터 포인트($x$)와 중심점($\mu$) 간의 거리'로 이를 계산했다. 하지만 초점을 '데이터 포인트들($x, y$) 간의 거리'로 옮겨보는 건 어떨까?

즉 K-Means 알고리즘은 $k$개 클러스터별 '데이터 쌍별 편차제곱(pairwise squared deviations)의 평균'들의 합을 최소화하는 것과도 동일하다. 한 클러스터 안에서 데이터 포인트로 만들 수 있는 모든 조합에 대해 편차를 계산하고, 이 포인트들이 평균적으로 얼마나 퍼져 있는지 나타낸 식이다.

$$
{\operatorname{arg\,min}}_{\mathbf{S}} \sum_{i=1}^{k} \frac{1}{ |S_{i}| }\sum_{\mathbf{x,y} \in S_{i}}\left\|\mathbf{x} - \mathbf{y}\right\|^{2}
$$

한편 아래 항등식(identity)에 따르면 '데이터 쌍별 편차제곱합'은 '데이터 포인트들과 평균 $c_{i}$의 편차를 제곱하여 합산한 값(*=편차제곱합*)에 클러스터 사이즈의 $2$배를 곱한 것'과 동일하다. 

$$
\sum_{\mathbf{x,y} \in S_{i}}\left\|\mathbf{x} - \mathbf{y}\right\|^{2}=2|S_{i}|\sum_{\mathbf{x} \in S_{i}}\left\|\mathbf{x} - {c}_{i}\right\|^{2}
$$

이러한 계산 구조를 활용하여 **클러스터의 모든 조합에 대해 연산을 수행하지 않고도 분산을 효율적이고 간단하게 계산**할 수 있다. 유도 과정은 아래와 같다.  

[편차의 총합은 $0$](https://woocosmos.github.io/basic-statistics/#%ED%8F%89%EA%B7%A0-%EB%B6%84%EC%82%B0-%ED%91%9C%EC%A4%80%ED%8E%B8%EC%B0%A8)이기 때문에 중간의 내적항은 사라진다.

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

모든 점 $x$, $y$에 대해서 합산하기 때문에 $x$, $y$ 각각 두 겹의 $\sum$으로 표현할 수 있으며, $c$는 상수이기 때문에 $\sum$는 $\|S\|$의 곱셉으로 변환할 수 있다.

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

## 최적화
이제 이 목적함수를 **최적화하는 방식**을 알아볼 것이다. 처음 초기화된 식은 아래 두 동작을 반복하며 클러스터 내 제곱합(WCSS)을 감소시킨다.

1. **Assignment** : 각 데이터 포인트에 가장 가까운 클러스터를 할당하기
2. **Update** : 각 클러스터에 할당된 데이터 포인트들의 평균값을 계산하여 새로운 클러스터의 중심을 업데이트하기

이 과정을 반복할 때마다(iteration) 클러스터 내 제곱합은 **항상 감소**한다. 업데이트를 거듭할수록 데이터 포인트들은 점점 더 클러스터의 중심에 가까워지고 클러스터의 크기는 더 작아지기 때문이다. 이러한 [단조 감소(monotone decreasing)](https://woocosmos.github.io/basic-statistics/#%EC%A7%91%ED%95%A9)의 성질로 인해 K-Means 알고리즘은 수렴이 가능한 식이다. 다만 '현재 상태에서' 가장 가까운 클러스터를 할당하는 탐욕적(greedy) 방식으로 진행되기 때문에 지역 최적해(local optimum)에 수렴하기 쉽다.


## 초기화
업데이트에 앞서 **중심점을 지정하는 초기화 단계**를 거쳐야 한다. 적절하지 않은 중심점에서 시작할 경우 지역 최적해에 빠져버릴 수 있기 때문에 알맞은 초기화 기법을 선택하는 것이 좋다.

- **무작위 분할(Random Partition)** : 모든 데이터 포인터를 $k$개 클러스터 중 하나로 임의 할당한다
- **Forgy 알고리즘** : 데이터 포인터 중 $k$개를 임의로 선택하고 이들을 중심점으로 사용한다
    - 두 최적화 기법은 중심점을 임의로 설정하기 때문에 결과가 매번 달라질 수 있다는 단점이 있다
- **K-means++** : 기존 초기화 기법의 한계를 커버하기 위해, 거리가 가중치로 적용된 확률을 기반으로 중심점을 찾는다
    - 데이터 포인트 중 $1$개를 임의로 선택하고 이를 첫번째 클러스터의 중심점 $c_{1}$으로 사용한다
    - 나머지 데이터 포인트에 대해서 첫번째 클러스터의 중심점까지의 거리 제곱합을 계산한다  

    $$
    d(x_{i}, c_{1})^2
    $$

    - 나머지 데이터 포인트에 대해서 '이 포인트가 다음 중심점으로 선택될 확률'을 계산한다. $c_{1}$로부터 거리가 멀수록 확률은 높아진다.  

    $$
    p(x_{i}) = \frac{d(x_{i}, c_{1})^2}{\text{Sum of Squares}}
    $$

    - 계산한 확률을 기반으로 두번째 클러스터의 중심점$c_{2}$을 추출한다.
    - 나머지 데이터 포인트에 대해서 *더 가까운* 클러스터의 중심점까지의 거리를 계산하고, 이에 따라 확률값도 조정한다  
    
    $$
    \min{(d(x_{i}, c_{1}), d(x_{i}, c_{2}))}
    $$

    - $k$개의 중심점을 선택할 때까지 반복한다  
<br>

# 클러스터의 수

지금까지는 $k$를 특정 수로 상정한 상태에서 목적함수를 정의, 초기화, 최적화하는 과정을 살펴보았다. 그렇다면 정작 $k$는 어떻게 결정하는가? K-Means 알고리즘에서 **클러스터의 개수 $k$는 사람이 직접 지정해주어야 한다**. 이는 해당 알고리즘의 단점으로 항상 지적되는 지점이다.  

최적의 클러스터 수를 정하는 것은 매우 중요하다. 만약에 $k$가 데이터 포인트 수만큼 크다면 각 데이터 포인트가 중심점이 되어버리기 때문에 목적함수는 0에 가까워지겠지만 클러스터링으로서 의미없는 작업이 된다. 반면 $k$를 $1$로 지정한다면 모든 데이터 포인트가 커다란 하나의 클러스터에 속하기 때문에 이 또한 의미가 없다.  

즉 단지 WCSS를 최소화하는 것만이 목적이 아니며, **데이터 포인트를 유의미하게 클러스터링하는 것** 그리고 **충분히 밀도 있는 클러스터를 찾기 위해 WCSS를 최소화하는 것** - 이 둘이 적절한 밸런스를 이루는 <mark>클러스터 개수</mark>를 찾는 것이 K-Means 알고리즘의 열쇠다.

클러스터 수를 결정할 때 사용하는 다양한 방법론 중 세 가지를 살펴보려고 한다.

## Rule of thumb

특정 이론이라기보단 관습적으로 사용하는 경험적인 기준이다. 주어진 데이터의 사이즈가 $n$일 때,

$$
k \approx \sqrt{n/2}
$$

## Elbow Method
특정 범위의 $k$를 하나씩 대입하며 클러스터 내 제곱합(WSCC)을 구한다. $k$가 커질수록 WCSS는 감소하는데 이 감소율이 급격하게 떨어지는 구간, 즉 Elbow Point의 $k$로 클러스터 개수를 결정한다.

![image](https://github.com/user-attachments/assets/28f30092-dc3f-4f4d-b9d1-3e4655dd57b4){: .center-image width="70%" }

<h3 class="no_toc"> 왜 값이 급격하게 떨어진 직후를 최적의 $k$로 뽑는가? </h3>

$k=1$로 시작할 경우 WCSS는 급격하게 감소하기 마련이다. 하나의 클러스터가 모든 데이터 포인트를 포함한다면 클러스터 내 분산은 매우 클 것이며, 여기에 개수가 하나씩 추가될수록 전반적인 클러스터의 분산합은 빠르게 줄어들 것이다.  
계속해서 클러스터가 추가된다면 WCSS는 계속 감소할 테지만 감소하는 폭은 줄어들 것이다. 데이터 포인트들이 이미 중심점에 충분히 가까워져 있기 때문이다.  

$k$가 클수록 모델의 복잡도(Complexity)는 커지는데 그에 비해 WCSS가 크게 감소하지 않는다면, 더이상 유의미하게 클러스터가 컴팩트해지지 않고 모델 성능이 개선되지 않는다는 의미다. 결국 Elbow Point 이후로는 클러스터 개수를 늘려가면서까지 모델의 복잡도를 증가시킬 가치가 없다. 다시 말해 **모델의 복잡도를 감수할 수 있을 정도로 WCSS가 '충분히' 줄어드는 지점**을 Elbow Point로 지정하는 것이다.

한번 더 강조하자면 K-Means 알고리즘의 목적은 단지 WCSS를 최소화하는 것만이 아니라, 충분히 WCSS를 감소시키면서 데이터 포인트를 유의미하게 클러스터링하는 최적의 Trade-off 지점을 찾는 것이다.

참고로 `Scikit-learn`과 같은 ML라이브러리에서는 Elbow Method에서 계산하는 WCSS를 `inertia`라고 표현한다.

## Silhouette Score
Silhouette Score(실루엣 지수)은 어떤 데이터 포인트가 자신이 속한 클러스터에 얼마나 응집되어 있는지(Cohesion), 그리고 자신이 속하지 않은 인근 클러스터로부터 얼마나 떨어져 있는지(Separation) 측정하는 지표다. 주로 K-Means 클러스터링의 결과를 평가할 때 사용하지만 $k$의 개수를 지정하는 데에도 활용할 수 있다.

먼저 주어진 특정 데이터 포인트 $i$에 대해서 두 개의 값을 계산한다.
- **Cohesion(응집도)** : 소속 클러스터의 다른 데이터 포인트들까지의 평균 거리, $a(i)$ 라고 표시한다.
- **Separation(분리도)** : *가장 가까운* 외부 클러스터의 데이터 포인트들까지의 평균 거리, $b(i)$ 라고 표시한다.

이를 활용하여 Silhouette Score를 계산한다. 지수는 $-1$과 $1$ 사이이며, $1$에 가까울수록 클러스터링 성능이 좋다고 평가한다. 

$$
s(i) = \frac{b(i) - a(i)}{\max{(a(i), b(i))}}
$$

- $1$에 가까울수록, $a(i)$가 $b(i)$에 비해 훨씬 작다는 의미이므로 알맞게 클러스터링 됐다고 평가한다
- $0$ 주변일수록, 해당 포인트가 두 클러스터의 경계 부분에 놓여 있다고 볼 수 있다 
- $-1$에 가까울수록, $a(i)$가 $b(i)$에 비해 크다는 의미이므로 해당 포인트가 다른 클러스터에 더 가까울 수 있음을 시사한다 (아예 잘못 클러스터링된 경우를 고려할 수 있다)

<h3 class="no_toc"> 활용 </h3>
Silhouette Score가 각 데이터 포인트에 대해 계산하는 값이기 때문에 이를 활용할 수 있는 방법은 다양하다.

- 모든 데이터 포인트에 대해 Silhouette Score를 각각 계산한 다음, 잘 클러스터링된/경계에 있는/잘못 클러스터링된 샘플들을 가려내기
- Silhouette Score의 평균값을 클러스터별로 집계하고 비교하여 잘못 응집된 클러스터를 다른 클러스터와 합치거나 더 쪼개기
- Silhouette Score의 전체 평균값을 집계하여 전반적인 클러스터링 성능을 평가하기
    - 이때 클러스터 개수 $k$별로 평균 Silhouette Score을 비교하여 클러스터 개수를 지정할 수 있다  
<br>

# 코드

## sklearn 라이브러리 활용
sklearn.Cluster의 [KMeans 모듈](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)과 sklearn.metrics [silhouette_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.silhouette_score.html)를 적용할 수 있다.  

```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

k = 3
model = KMeans(n_clusters=k)
pred = model.fit_predict(X)

# k별로 해당 속성값을 시각화하면 elbow point를 찾을 수 있다
print(model.inertia_) 

# 모든 데이터 포인트의 실루엣 스코어의 평균값을 출력한다
metric = silhouette_score(X, pred)
print(metric)
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