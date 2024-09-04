---
layout: post
title: PyTorch 파이토치 기초 모음집
tags: [PyTorch]
comments: True
toc: true
---

PyTorch의 구성 요소와 동작 원리를 살펴본다. 

# 개발 환경

**Windows**  

1. 파이썬과 패키지툴을 준비한다
- **python 3.8** : [공식 문서](https://pytorch.org/get-started/locally/#windows-python)에 따르면 현재<sub>2024-09-03</sub> 윈도우에서 파이토치는 파이썬 3.8-3.11 버전만 지원된다. *나는 파이썬 버전 관리를 위해 윈도우용 pyenv인 [pyenv-win](https://github.com/pyenv-win/pyenv-win)를 사용했다* 
- **pipenv** : 파이썬에서 공식으로 권장하는 패키지 관리툴  


2. 프로젝트 폴더에 접근하여 pipenv 의 파이썬 버전과 가상환경을 설정한다
```bash
cd /path/to/project
pipenv --python 3.8
pipenv shell
```  

3. 생성된 `Pipfile`파일에 파이토치 설치를 위한 주소를 추가한다.
```
[[source]]
url = "https://download.pytorch.org/whl/cu118"
verify_ssl = true
name = "pytorch"
```

4. 파이토치를 설치한다
```bash
pipenv install --index=pytorch torch
```
<br>

**Ubuntu (WSL)**
1. miniconda 로 파이썬 버전을 명시한 새 환경을 생성한다
```bash
conda create -n my-env python==3.8.2
```

2. PyTorch 및 CUDA를 설치한다
```bash
conda install cudatoolkit=11.8 -c conda-forge
conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c pytorch -c nvidia
```
<br>

**테스트**  
pipenv shell 혹은 conda activate my-env 으로 가상 환경에 접근한 다음, 파이썬으로 아래 요소들을 호출한다.
```python
import torch

torch.cuda.is_available()
torch.cuda.device_count()
torch.cuda.current_device()
torch.cuda.device(0)
torch.cuda.get_device_name(0)

torch.__version__ 
torch.version.cuda
```

# Tensor(텐서)

Tensor는 **모델의 파라미터와 입출력을 인코딩할 때 사용하는, <mark>배열 및 행렬</mark>과 매우 유사한 자료구조**이다. list나 numpy array로부터 **텐서를 생성**할 수 있다. 

``` python
# 원본 데이터
my_list = [[1, 2, 3], [4, 5, 6]]
my_arr = np.array(my_list)
 
# 방법1. tensor() 함수
t1 = torch.tensor(my_arr)
 
# 방법2. from_numpy() 함수
t2 = torch.from_numpy(my_arr)
 
# 방법3. as_tensor() 함수
t3 = torch.as_tensor(my_arr)
```

전달된 배열을 sharing 하는 `from_numpy()`, `as_tensor()` 과 다르게, `tensor()`은 배열을 **복제(copy)**한다. 따라서 원본 배열의 요소를 수정하여도 **`tensor()`로 변환된 텐서는 영향을 받지 않는다**.
```
my_arr[0, 0] = 999
 
print(t1)   # tensor([[1, 2, 3], [4, 5, 6]])
print(t2)   # tensor([[999, 2, 3], [4, 5, 6]])
print(t3)   # tensor([[999, 2, 3], [4, 5, 6]])
```

별도 인자를 주어 **dtype을 오버라이딩**할 수 있다. `t1.dtype`을 출력하여 비교할 수 있다. 단, `from_numpy`는 이런 기능이 없다.
```python
t1 = torch.tensor(my_list, dtype=torch.float)
```

텐서를 생성할 때 **shape(size)를 지정**할 수 있다.
```python
shape = (2,3,)
rand_tensor = torch.rand(shape)
ones_tensor = torch.ones(shape)
zeros_tensor = torch.zeros(shape)
```  
<br>

✅ **torch.Tensor vs. torch.tensor**  
torch.Tensor 는 <u>클래스(class)</u>다. 따라서 모든 텐서는 torch.Tensor 클래스의 객체이다. 반면 torch.tensor() 는 텐서를 반환하는 <u>함수</u>다.  
각각을 인자 없이 호출할 경우, 전자는 빈 텐서 객체로 생성되지만 후자는 변환할 배열 즉 data를 인자로 받지 못해 에러가 발생한다.
```
torch.Tensor() # tensor([])
torch.tensor() # TypeError: tensor() missing 1 required positional arguments: "data"
```

---

PyTorch의 텐서는 CPU에 생성되는 것이 디폴트지만 **GPU에 올려 연산**할 수 있다. GPU의 RAM에 저장된다는 의미다. 
```python
t1 = torch.FloatTensor([0., 1., 2.])
t1.is_cuda  #False
```  

텐서를 GPU에 올리는 두 가지 방법이 있다.  
1. 처음부터 GPU에서 텐서를 생성한다
```
gpu_tensor = torch.tensor([[1, 2], [3, 4]], device='cuda')
```

2. CPU에서 생성된 텐서를 GPU로 복사한다. 한번 GPU에 복사된 텐서는 계속해서 GPU에서 연산된다.
```
gpu_tensor = cpu_tensor.to(device='cuda')
```  
다시 CPU로 돌아가게 만드는 방법도 있다.
```
back_to_cpu = gpu_tensor.to(dvice='cpu')    # 모델을 GPU에 올릴 때에도 사용
back_to_cpu = gpu_tensor.cpu()
```  
<br>

✅ **CUDA Caching Memory Allocator**
> 파이토치는 tensor를 GPU에 올릴 때 <u>메모리를 빠르게 할당하기 위해</u> **caching allocator**를 사용한다. allocator는 CUDA로부터 메모리 블럭들을 요청한 후, 블럭을 쪼개고 (CUDA에 반환하지 않은 채로) 재사용한다. 따라서 tensor가 지워져도 allocator는 메모리를 keep해둔다. 결국에 <u>메모리가 실제로는 사용되고 있지 않더라도</u> 이 allocator에 의해 차지되어 **사용 중인 것으로 표기**될 수 있다.  

```
# 파이토치에서 실제로 사용하고 있는 메모리를 확인하기 (1024로 두 번 나누어주어야 MB 단위가 됨)
torch.cuda.memory_allocated()

# 실제로는 사용하지 않는 메모리를 반환시키기
torch.cuda.empty_cache() 
```  
<br>

✅ **in-place operations**  
언더스코어(`_`)로 끝나는 연산 함수는 텐서 변수를 in-place로 변환한다. 메모리를 아끼는 데 도움이 될 수 있지만 derivative를 계산할 때 문제가 될 수 있으므로 사용을 권장하지는 않는다.
```python
t1 = torch.rand(2,3,)
t1.add_(5)
```
<br>

# Autograd (자동미분)

Autograd는 역전파(back propagation)를 시행하여 체인룰(chain rule)에 따라 말단 노드(leaf)까지 변화도(=gradient)를 연산하는 기능이다.

Forward
: loss function의 값을 계산하는 것. 레이어의 output이 다음 레이어의 input으로 전달됨으로써 연산된다.

Backward
: 학습 파라미터의 gradient를 계산하는 것. chain rule를 기반으로, 파라미터가 loss fuction에 기여한 가중치를 연산한다.  

<br>
자동미분은 뿌리 노드가 계산되기까지 사용된 모든 변수의 미분값, 즉 'history' 를 그래프 형태로 저장함으로써 동작한다. 이때 그래프는 방향이 있는 비순환 그래프(DAG, directed acyclic graph) 이며 학습 iteration 마다 새로 구성된다. *(c.f. tensorflow의 경우 Static Computational Graphs 를 사용한다)*  
예를 들어 아래 연산 과정을 그래프로 나타낼 수 있다.

```
A = torch.tensor([10.], requires_grad=True)
B = torch.tensor([20.], requires_grad=True)
F = A * B
G = F * 2
```  
![image](https://github.com/user-attachments/assets/4d2452a0-9563-455b-b9f4-edd06de5c8b1){: .center-image}

이렇듯 역전파는 그래프를 거꾸로 거슬러 올라가며 G가 계산되기까지 A, B의 gradient를 계산하는 과정이다.  
<br>

✅ **Leaf Tensor & gradient**


텐서는 두 가지 <u>조건</u>에 따라 분류할 수 있다.
- 그래디언트 계산이 필요한가? (requires gradient) 
- 연산의 결과인가? (explicitly created by the user, 즉 사용자가 명시적으로 생성한)  

> "그래디언트 계산이 필요한가?" 는 결국 "상수(constant)인가 변수(variable)인가?"라는 질문과 같다


이는 텐서의 두 가지 <u>속성</u>과 관련되는 것이다.
- **`requires_grad`** : boolean으로 표현
- **`grad_fn`** : 연산에 사용된 함수(*ex. Add, Mul, ...*)  

> 유저가 생성했거나 (=연산의 결과가 아님) 그래디언트 계산이 필요하지 않으면, `grad_fn`는 값이 없다(None)

```
user_created_tensor = torch.tensor([10.], requires_grad=True)   # 텐서를 초기화하면서 gradient 계산이 필요하다고 설정하였습니다
print(user_created_tensor.requires_grad)                        # True
print(user_created_tensor.grad_fn)                              # None
 
calcuated_tensor = user_created_tensor*2                        # 이 텐서는 곱셈 연산의 결과입니다
print(calcuated_tensor.requires_grad)                           # True
print(calcuated_tensor.grad_fn)                                 # <MulBackward0 object at 0x7fc5d71a5df0>
```  
<br>


이처럼 텐서는 조건에 따라 leaf tensor인지, gradient를 저장할지(populated) 결정된다.  
> **Grad Populated** : 해당 텐서에 대한 gradient 저장. backward 후 grad 속성이 존재.

<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td:first-child {
  background-color: #f2f2f2; /* Green color for header row */
}
</style>

| case | **requires_grad** | **grad_fn** | **is_leaf** | **grad** |
|-------|----------|----------|----------|
| gradient 계산이 필요하고, 유저가 생성하였다	         | True  | None   | <mark>True</mark>   | <mark>True</mark>   |
| gradient 계산이 필요하고, 연산의 결과이다	             |  True  | not None   | False   | False   |
| gradient 계산이 필요하지 않고, 유저가 생성하였다	     | False   | None   | True   | False   |
| gradient 계산이 필요하지 않고, 연산의 결과이다	     | False   | None   | True   | False   |

**<u>leaf</u>**는 그래프 상 자식이 없는 말단 노드를 말한다. 파이토치에서 gradient 계산이 필요하지 않은 텐서는 모두 leaf tensor로 여긴다. 중요한 것은 **'gradient 계산이 필요하고 유저가 명시적으로 생성한 텐서'를 leaf tensor로 여긴다**는 것이다.

**<u>grad</u>**는 누적 계산된 gradient다. gradient 계산이 필요한 leaf tensor에 대해 누적 연산한 결과다. 이때 어떤 tensor가 gradient 계산이 필요하더라도 <u>연산의 결과</u>라면 non-leaf tensor로 여겨 `grad`가 저장되지 않는다.

```
print(user_created_tensor.is_leaf)  # True
print(calcuated_tensor.is_leaf)     # False
 
# gradient 계산하여 grad 가 저장되는지 확인
calcuated_tensor.backward()
print(user_created_tensor.grad)     # tensor([2.])
print(calcuated_tensor.grad)        # None (UserWarning: The .grad attribute of a Tensor that is not a leaf Tensor is being accessed)
```

> 왜 이러한 개념들을 알아야 하는가? 자동 미분은 어떤 변수가 계산되는 데 사용된 모든 변수의 미분값, 즉 history를 computational graph 형태로 저장함으로써 동작하기 때문이다. `requires_grad=True` 옵션으로 표시해야만 처음 연산이 시작된 곳까지 거슬러 올라가며 그 변수의 연산들을 역추적한다.  

참고 // 텐서에 저장된 gradient 관련 속성을 확인하는 코드.

```python
def check_attr(t : torch.tensor):
    print(t.requires_grad)
    print(t.grad_fn)
    print(t.is_leaf)
    print(t.grad)
```  
<br>

✅ **requires_grad**  


`requires_grad`를 통해 어떤 텐서에 대해 gradient 계산이 필요한지 설정할 수 있다.

```python
# 방법1. 변수 초기화할 때 인자로 표시하기
t1 = torch.randn((3, 3), requires_grad=True)
 
# 방법2. 변수를 생성한 후에 속성 바꾸기
t2 = torch.randn((3, 3))
t2.requires_grad = True
t2.requires_grad_(True)
```  

`requires_grad`는 <u>전염</u>된다. 연산에 사용된 텐서 중 하나라도 requires_grad 가 True로 설정되어 있다면, 그 연산 결과의 requires_grad도 True이다

```python
# 두 텐서 중 하나만 requires_grad=True로 설정한다
t1 = torch.randn((3, 3))
t2 = torch.randn((3, 3))
t1.requires_grad = True
 
# 연산 결과가 requires_grad=True로 나타난다
t3 = t1 @ t2
print(t3.requires_grad)     # True
```  
이러한 특성을 활용해 layer freezing과 같은 기법을 구사할 수 있다. 이미지는 `b` 의 `requires_grad`를 false로 세팅한 경우.
![image](https://github.com/user-attachments/assets/8d0d81ef-61e6-488b-a0b2-1948feac4d07)


✅ **torch.no_grad()**  

모델로부터 값을 **추론(inference)**할 때는 그래프를 생성하고 gradient를 계산하는 과정이 필요없기 때문에 context manager를 활용해 메모리를 아낄 수 있다.

```python
with torch.no_grad():
    ...
```

<b>*eval()과는 무슨 차이?*</b>  
`eval` 함수는 train과 evaluation 시 다르게 동작하는 layer들 (ex. Dropout, BatchNorm) 을 eval 모드로 바꿔준다. 따라서 모델을 평가할 때는 no_grad와 eval을 모두 사용하는 것이 옳다.

```python
model.eval()
with torch.no_grad():
   ... 
```
<br>

✅ **backward()**    

지금까지의 개념을 토대로 역전파 과정을 유사코드로 구현해본다. graph 를 거꾸로 거슬러 올라가며 recursive하게 반복하다가, leaf node에 다다르면 grad_fn가 None이기 때문에 중단된다.

```python
def backward(gradients):
    '''self.Tensor : 역전파 연산의 대상이 되는 텐서(=loss)'''
    self.Tensor.grad = gradients
     
    for inp in self.inputs:
        if inp.grad_fn is not None:
            new_gradients = gradients * local_grad(self.Tensor, inp)
            inp.grad_fn.backward(new_gradients)
        else:
            pass
```  


한편 `backward()` 함수는 **scalar 텐서**에만 작동한다. vector 텐서에 부를 경우 이러한 에러를 마주하게 된다.
> RuntimeError: grad can be implicitly created only for scalar outputs

만약 벡터 텐서에 대해 역전파를 수행하고 싶다면 Jacobian Matix를 활용하거나, 사이즈에 맞는 1값 텐서를 입력으로 주어 처리할 수 있다.

```python
G.backward(torch.ones(G.shape))
```  

## 예제  

앞서 살펴본 연산식을 활용해 backward 함수를 호출하고 grad 속성을 확인해본다.

```python
a = torch.tensor([10.], requires_grad=True)
b = torch.tensor([20.], requires_grad=True)
F = a * b
G = F * 2
```  
![image](https://github.com/user-attachments/assets/4d2452a0-9563-455b-b9f4-edd06de5c8b1){: .center-image}  


| case | **node** | 
|-------|----------|
| gradient 계산이 필요하고, 유저가 생성하였다	         | A, B  |
| gradient 계산이 필요하고, 연산의 결과이다	             | F, G  |
| gradient 계산이 필요하지 않고, 유저가 생성하였다	     |  -  |
| gradient 계산이 필요하지 않고, 연산의 결과이다	     |  -  |

여기서 최적화하고자 하는 대상은 **G**이다. chain rule에 따라 backward 하여 G가 출력되기까지 a, b의 gradient를 계산한다.  
F 또한 requires_grad=True를 상속 받기 때문에 gradient를 계산하며 `grad_fn`을 확인할 수 있다. 하지만 leaf tensor가 아니기 때문에 grad를 저장하지 <u>않는다</u>.

```python
G.backward()
 
# a의 gradient(가중치)가 상대적으로 높게 계산됨
print(a.grad) # tensor([40.])
print(b.grad) # tensor([20.])
print(F.grad) # UserWarning: The .grad attribute of a Tensor that is not a leaf Tensor is being accessed. Its .grad attribute won't be populated during autograd.backward()
print(F.grad_fn)    # <MulBackward0 object at 0x7f0cb7703250>
```  

만약 F.grad를 저장하고 싶다면 backward 전에 `retain_grad()`를 호출하여 중간 텐서 F에 대해서도 gradient를 유지하도록 할 수 있다.
```
F.retain_grad()  
G.backward()     

print(F.grad)  # F의 gradient 출력
```

<br>


✅ **GPU 케이스**  

앞선 예제와 동일한 연산을 수행하되, 이번에는 a와 b를 GPU에 할당하는 중간 단계를 거친다.

```python
a = torch.tensor([10.], requires_grad=True)
b = torch.tensor([20.], requires_grad=True)

# 추가
a_cuda = a.to('cuda')
b_cuda = b.to('cuda')
 
F = a_cuda * b_cuda
G = F * 2
```

backward 결과 CPU 위의 a, b에만 gradient가 저장되고, **GPU 위의 a_cuda, b_cuda는 비어 있다**. 이는 CPU 위의 텐서들이 최적화 변수로 남아있고, a와 b 로부터 생성된 a_cuda, b_cuda는 leaf tensor가 아닌 **중간 텐서(intermediate tensor)**로 여겨지기 때문이다. 텐서를 GPU로 옮기는 intermediate한 과정으로 인한 것이다.

```python
G.backward()
print(a.grad)       # tensor([40.])
print(b.grad)       # tensor([20.])
print(a_cuda.grad)  # None (UserWarning: The .grad attribute of a Tensor that is not a leaf Tensor is being accessed.)
print(b_cuda.grad)  # None (UserWarning: The .grad attribute of a Tensor that is not a leaf Tensor is being accessed.)
```

따라서 **<u>처음부터 GPU 위에서 변수를 생성한 후 역전파를 수행</u>**하자.

```python
a_cuda = torch.tensor([10.], requires_grad=True, device='cuda')
b_cuda = torch.tensor([20.], requires_grad=True, device='cuda')
 
F = a_cuda * b_cuda
G = F * 2
 
G.backward()
 
print(a_cuda.grad)      # tensor([40.], device='cuda:0')
print(b_cuda.grad)      # tensor([20.], device='cuda:0')
```

# 학습

파이토치에서의 학습 과정을 예제를 통해 살펴본다. 전체 과정은 아래 단계로 이루어진다.

1. DataLoader 클래스 정의 및 객체 생성
2. model 클래스 정의 및 객체 생성
3. loss function, optimizer 정의
4. epoch와 training loop  

<br>
**1. DataLoader 클래스 정의 및 객체 생성**  

커스텀 DataLoader 클래스에는 `__init__`, `__len__`, `__getitem__` 함수를 정의해야 한다. 이 중 `__getitem__` 함수는 인자 `index`를 통해 데이터 샘플을 반환하는 역할을 한다.  
학습과 평가를 위한 DataLoader 객체를 각각 생성한다: train_dataloader, test_dataloader

```python
import pandas as pd

from torch.utils.data import Dataset
from torch.utils.data import DataLoader

class CustomDataset(Dataset):
    def __init__(self):
        self.sample = pd.read_csv('/path/to/data.csv')
        self.x = np.array(self.sample[['feature1', 'feature2', 'feature3']])
        self.y = np.array(self.sample[['label']])
 
    def __len__(self):
        return len(self.sample)
     
    def __getitem__(self, index):
        x = torch.tensor(self.x[index].reshape(1, -1), dtype=torch.float32)
        y = self.y[index]
        return x, y
 
training_data = CustomDataset()
train_dataloader = DataLoader(training_data, batch_size=64, shuffle=True)
```

DataLoader 객체에서 데이터 샘플을 뽑아보고 싶다면 iter, next 내장함수를 사용한다.

```python
data_iterator = iter(train_dataloader)
features, label = next(data_iterator)
```

<br>
**2. model 클래스 정의 및 객체 생성**

파이토치의 `nn.Module`를 상속 받아 모델 클래스를 정의한다. `__init__` 함수에서 레이어를 초기화하고 `forward` 함수에서 순전파 구조를 정의한다.  
입력 데이터와 아웃풋의 사이즈를 잘 고려해야 한다. 연속된 레이어를 쌓아주는 `nn.Sequential`도 쓸 수 있다.

```python
import torch.nn as nn
import torch.nn.functional as F
 
class CustomClassifier(nn.Module):
    def __init__(self):
        super(CustomClassifier, self).__init__()
 
        self.input_size = 3
        self.output_size = 10
        self.hidden_dim1 = 64
        self.hidden_dim2 = 128
 
        self.fc1 = nn.Linear(self.input_size, self.hidden_dim1)
        self.fc2 = nn.Linear(self.hidden_dim1, self.hidden_dim2)
        self.fc3 = nn.Linear(self.hidden_dim2, self.output_size)

        # 이렇게도 할 수 있다
        # self.net = nn.Sequential(
        #     nn.Linear(self.feature_num, self.hidden_dim1),
        #     nn.ReLU(),
        #     nn.Linear(self.hidden_dim1, self.hidden_dim2),
        #     nn.ReLU(),
        #    nn.Linear(self.hidden_dim2, self.output_size),
        # )
 
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        output = self.fc3(x)
        
        # 이것과 같다
        # output = net(x)

        return output
```

모델 클래스를 생성하고 전반적인 정보를 확인한다. `torchsummary`를 활용하면 그냥 print하는 것보다 훨씬 보기 좋게 확인할 수 있다.

```python
from torchsummary import summary

model = CustomClassifier()
model = model.to('cuda')

batch_size, feature_num = 64, 3
summary(model, input_size=(batch_size,  feature_num))
```

![image](https://github.com/user-attachments/assets/bc05f826-bcb2-4f33-8da5-74ebd41b3012){: .center-image}


특정 레이어의 파라미터 값을 확인하고 싶다면 `named_parameters()` 혹은 `parameters()`를 사용한다.

```python
# for param in model.parameters():
for name, param in model.named_parameters():
    if param.requires_grad:
        print(name, param.data)
```

<br>
**3. loss function, optimizer 정의**  

라벨 수가 10인 다중분류를 상정하여 `CrossEntropyLoss`를 손실함수로 정의하고 임의의 입력값을 통해 loss를 연산한다.

```python
loss_fn = nn.CrossEntropyLoss()
 
output_size = 10
dummy_outputs = torch.rand(batch_size, output_size)
dummy_labels = torch.randint(output_size, (batch_size,))
 
loss = loss_fn(dummy_outputs, dummy_labels)
```

옵티마이저(otpimizer)는 아주 다양한 종류가 있지만 이곳에서는 SGD를 예시로 든다.

```python
optimizer = torch.optim.SGD(model.parameters(), lr=0.001)
```

<br>
**4. epoch와 training loop**

<u>한 번</u>의 학습 epoch를 정의했다.  
1. dataloader 객체에서 한 배치의 데이터를 꺼내며 gradient를 초기화한다(`zero_grad`)
2. 한 배치의 데이터를 모델에 통과시키고(`model`) 그 값으로 loss를 계산한다(`loss_fn`)
3. loss에 대해 gradient를 계산한 후(`loss.backward`), 그 값을 기반으로 모델을 업데이트한다(`optimizer.step`)

```python
running_loss = 0.0
model.train()

for data in training_loader:
    inputs, labels = data
    
    optimizer.zero_grad()
 
    outputs = model(inputs)
    loss = loss_fn(outputs, labels)

    loss.backward()
    optimizer.step()
 
    running_loss += loss.item()
```

<h4 class='no_toc'> ✅ 동 떨어져 있는 optimizer.zero_grad(), loss.backward(), optimizer.step()이 각각 호출되는데 어떻게 모델이 업데이트되는가? </h4>

optimizer 를 정의할 때 모델의 파라미터를 넘겨주기 때문에 - `torch.optim.SGD(model.parameters(), lr=0.001)`  
내부적으로 grad를 저장하고 값을 업데이트한다. 달리 말해 optimizer가 활용하는 값은 loss도 아닌 `model.parameters()`의 **`param.grad`** 이다.

이때 모델을 GPU로 옮기고 난 <u>후</u>에 optimizer를 정의하는 것이 좋다.  
만약 모델을 GPU로 옮기기 전에 optimizer를 정의하면, optimizer는 CPU 위 파라미터를 추적하게 된다. 그 결과 optimizer가 추적하는 파라미터와 실제 모델의 파라미터가 달라지는 문제가 발생할 수 있다.

---

비슷한 방식으로 validation 을 정의할 수 있다. 단 모델 평가 단계이므로 모델을 `eval` 모드로 바꾸고 `torch.no_grad` 안에서 추론이 이루어진다.  
또한 "loss에 대해 gradient를 계산한 후 그 값을 기반으로 모델을 업데이트"하는 과정은 생략된다.

```python
test_loss = 0.0
model.eval()

with torch.no_grad():
    for data in test_dataloader:
        inputs, labels = data

        outputs = model(inputs)
        loss = loss_fn(outputs, labels)

        test_loss += loss.item()
```

전자를 `train_loop`, 후자를 `test_loop` 이라는 함수로 정의한다면 전체 학습 loop는 이렇게 정의할 수 있다.

```python
num_epochs = 100
for epoch in range(num_epochs):
    train_loop()
    
    if epoch % 10 == 0:
        test_loop()
```