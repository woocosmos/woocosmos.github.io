---
layout: post
title: "결정트리"
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

# 개요

내용

# 정의

내용


# 목적

목적함수

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