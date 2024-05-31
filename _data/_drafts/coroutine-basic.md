---
title: "Coroutine basic"
categories: android coroutine
tags:
    - [android]
date : 2024-05-29 15:20
last_modified_at: 2024-05-29 15:20
toc : ture
toc_sticky : true
---

오늘은 비동기 작업에 많이 사용하는 코루틴에 대해 정리해 보기로 했다.

## Why Coroutine? : 코루틴의 장점

1. 가벼움

## Thread vs Coroutine

안드로이드 비동기 작업 문서를 보면 java 프로젝트의 경우 thread, kotlin 프로젝트의 경우 coroutine을 사용하라고 권장한다.

### 개념

코루틴 공식 문서를 살펴보면 다음과 같이 스레드와 코루틴을 비교하고 있다.

> 코루틴과 스레드는 다른 코드와 동시에 실행되는 코드 블럭을 실행한다는 점에서 개념적으로 유사하다.

> 그러나 코루틴은 어떤한 특정 스레드에 제한되지 않는다. 
> 예를 들어 하나의 스레드에서 해당 실행을 일시 중단하고, 다른 스레드에서 이를 재게한다.

### 자원 소모

코루틴은 경량화된 스레드라고 생각할 수 있지만, 스레드와 다른 몇가지 주요한 차이점이 있다.




## 용어

**coroutineScope**
- 해당 코루틴의 수명을 제한
- 내부 child가 완료될때까지 종료되지 않는다.

**scope builder**
- courintineScope로 코루틴 스코프를 만들 수 있다. 
- suspending function이다

**coroutine builder**
- launch
- 새로운 코루틴을 만든다.
- 

**suspending function**
- 코루틴에서 사용할 수 있는 함수
- 내부에서 다른 suspend function 사용가능
- delay : 코루틴을 일시정지 시키는 함수 -> 스레드는 block하지 않고, 해당 코루틴만 일시정지


## Structed Concurrency 원칙

- 코루틴은 structed concurrency principle을 따른다.

> 새로운 코루틴은 특정한 coroutineScope에서만 launch 된다.
> 
