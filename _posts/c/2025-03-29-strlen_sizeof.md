---
title: "[C] strlen vs sizeof"
categories: C
tags: 
    - [c, strlen, sizeof]
date: 2025-03-29 14:10
last_modified_at: 2025-03-29 14:10
layout: single
toc : ture
toc_sticky : true
---

이전에 알고리즘 문제를 풀다가 char array에 `strlen`을 쓸 수 있는지 궁금했던 적이 있었다.
그때 써봤는데 의외로 제대로 동작했지만 모르고 쓰기에는 찝찝해서 정리해두고 넘어가려고 한다.

또 생각해보니 둘의 차이도 좀 애매하게 알고 있는 것 같아서 짚고 넘어가려고 한다.

‼️우선 내가 가장 크게 착각하고 있던 점!

C에는 string자료형이 없다. **string은 개념에 가까운 느낌이고 사실상은 null-terminated char array이다..!**

그니까 char array인데 `\0` 으로 끝나면 string이라고 할 수 있다는 의미이다.

## strlen vs sizeof

string.h에서는 문자열에 관련된 여러 함수를 제공한다. 

여러가지가 있는데 대표적으로 `strcpy`, `strlen`, `strcat`, `strcmp` 등이 있다.

이 중 내가 궁금했던 건 왜 char array에서 `strlen`이 제대로 작동하는가와, `sizeof`와 내부적으로 어떤 차이가 있느냐였다.

### strlen

먼저 `strlen`의 구현 예제를 먼저 확인해보면 아래와 같다.

```c
size_t strlen(const char *s) {
  const char *eos = s; 
  while (*eos++);
  return (int)(eos - s - 1);
}
```

eos(end of string)이 0 (`\0`)되면 `\0` 이 들어있던 주소값과 시작 주소값의 차를 구해서 문자열의 길이를 구한다.

그러니까 사실 문자열 내에 문자가 몇 개 있나 보다는 시작주소부터 `\0` 전까지 몇 바이트가 있나를 반환하게 된다.

그래서 실제로 `“안녕”`같은 한글을 넣게 되면 UTF-8 기준 한글은 각 글자마다 3바이트 크기를 차지하므로 6을 반환하게 된다.

```c
#include <stdio.h>
#include <string.h>

int main() {
    int l = strlen("안녕"); //"안" 3byte , "녕" 3byte
    printf("%d",l); //output : 6
}
```

### sizeof

사실 진짜 많이 쓰는 함수인데 어떻게 동작하는지는 딱히 생각 안 해봤다. 그냥 알아서 잘 하겠거니 하고 썼다.

근데 이것도 알고 보니 꽤 재밌다.

일단 sizeof는 함수가 아니라 연산자였다!!🤯 

그래서 무려 괄호가 없어도 쓸 수 있다.

```c
int main() {
    char a[] ="abc";
    char b[] ="abcd";
    size_t la = sizeof a;
    size_t lb = sizeof(b);
    printf("%d %d",la,lb); //4 5
}
```

또한 컴파일 타임에 계산되기 때문에 런타임에서 오버헤드가 발생하지 않는다. 

변수든 타입이든 상관없이 해당 객체가 차지하는 메모리 크기를 반환한다. 

해당 객체가 차지하는 메모리 크기를 계산하는 방법은 컴파일러가 사전에 가지고 있는 정보를 활용한다. 

## 왜 strlen가 char array에서 제대로 동작할 수 있었나🤔

사실상 이게 가장 궁금했던 부분이다.

strlen은 `\0` 이전까지의 바이트 수를 반환하는 함수인데 어떻게 char array에서 제대로 동작할 수 있었을까?

내가 추측하는 원인은 두 가지이다.

1. 처음부터 char array가 (`\0` 을 포함하는) 문자열 형태로 이루어져 있어서 종료 문자가 포함되어있었다. (이거일 가능성이 높다)
2. 운이 좋게 char array가 끝나는 영역 이후에 0 이 들어있어서 이를 `\0` 으로 인식하고 결과를 반환했다.

### 실험

가설을 확인하기 위해 실험을 해봤는데 그냥 그때는 내가 운이 좋았던 것 같다.

```c
#include <stdio.h>
#include <string.h>

int main() {
    char a[] = {'a','b','c'};
    
    for(int i=0;i<5;i++){
        printf("%d ",*(a+i)); //97 98 99 -99 0 
    }
    printf("\nres : %d",strlen(a)); //4
}
```

`\0`이 없는 char array에 `strlen`을 썼더니 잘못된 결과가 나왔다. 메모리를 보니 그냥 0이있는곳까지 계속 읽는다.

```c
#include <stdio.h>
#include <string.h>

int main() {
    char a[] = {'a','b','c'};
    char b[] = {'d','e','f'};
    printf("a_addr : %p, b_addr : %p\n",a,b); //a_addr : 0x7ffc12cbc3d2, b_addr : 0x7ffc12cbc3d5
    printf("%d",strlen(a)); //7
}
```

이것도 마찬가지로 `\0` 이없는 char array를 두개 연달아 붙여 선언했더니 `strlen`에서 둘을 더한것보다 약간 더 큰값이 나왔다.

```c
#include <stdio.h>
#include <string.h>

int main() {
    char a[] = "abc";
    printf("res : %d",strlen(a)); //3
}
```

뭐 이건 당연한 거지만 문자열 데이터를 가진 char array에서는 정확한 값이 나왔다.

## 결론 

### 문자열 데이터가 아닌 char array와 strlen을 함께 사용하면 안된다.

문자열 데이터를 가진 char array에서는 문제가 없었지만 그렇지 않은 char array에서는 계속해서 종료 문자(`\0` )을 찾으며 메모리 경계를 넘어 쓰레기 값을 읽는다.

그러다 접근 권한이 없는 메모리까지 가버리면 segmentation fault가 발생하게 된다.

앞으로는 들어가는 데이터를 잘 생각하고 주의해서 strlen을 써야 할 것 같다.

### sizeof vs strlen

공부를 하다보니 strlen과 sizeof는 생각 보다 많이 다르다.

정리하자면 아래와 같다.

- strlen : 문자열 형태의 데이터에 `\0` 까지의 길이를 찾는 용도.

- sizeof : 컴파일 타임에 실행되며 미리 알고있는 정보를 활용하여 객체에 할당된 메모리 크기를 구하는 연산자. 

## +) char pointer, char array

공부하다 보니 생각보다 재밌는 부분이 좀 더 있어서 메모할 겸 추가해둔다.

```c
char* c1 = "abcd"; //"abcd"는 .rodata에 저장되며 수정할 수 없다.
char c2[] = "efgh"; // "efgh"는 stack영역에 저장되며 수정이 가능하다.
```

## 참고

[https://www.ibm.com/docs/ko/i/7.3?topic=functions-strlen-determine-string-length#strlen](https://www.ibm.com/docs/ko/i/7.3?topic=functions-strlen-determine-string-length#strlen)

[https://modoocode.com/106](https://modoocode.com/106)

[https://velog.io/@french_ruin/C-언어-String](https://velog.io/@french_ruin/C-%EC%96%B8%EC%96%B4-String)