---
title: "안드로이드 면접 정보"
categories: android interview
tags:
    - [android, JetpackCompose, compose, annotation, "@jvmName", overloading]
date : 2024-05-27 14:00
last_modified_at: 2024-05-27 14:00
toc : ture
toc_sticky : true
---

# 안드로이드 면접질문

다음주에 면접이 있어서 정리하는 김에 포스팅으로 남기기로 했다.


## UI

### Activity 생명주기

<img src="/assets/image/activity_lifecycle.png">

`onCreate()`
   
- 시스템이 액티비티를 처음으로 만들었을 때 트리거
- setContentView()메서드를 통해 화면 정의

`onStart()`

- 액티비티가 유저에게 보여지기 시작할 때 트리거
- UI관리 코드 위치함

`onResume()`

- 앱이 포그라운드 상태로 들어감
- 액티비티가 유저와 상호작용 가능

`onPause()`

- 백그라운드 상태 진입했지만 화면 일부가 보여지고 있는 상태
- 예를 들어 multi-window, 전화올 때 등
- 수행시간이 매우 짧으므로 데이터 저장, 네트워크 작업 등 오래 걸리는 하기에 적합하지 않음
- 시스템에 의해 프로세스가 kill되지 않는 한 시스템은 액티비티 객체를 메모리에서 삭제하지 않으므로 onResume으로 돌아갔을때 객체를 다시 초기화할 필요가 없음

`onStop()`

- 백그라운드 상태로 진입했고, 화면이 보이지 않음
- 불필요한 리소스 해제 및 관리
- 상대적으로 cpu를 많이 쓰는 종료작업 수행 ex) DB에 데이터 저장

`onDestroy()`
- 유저가 앱을 종료하거나, 시스템에 의해 일시적으로 앱이 종료되는 경우 호출(ex. configuration변경,기기 회전)
- 뷰모델을 사용하여 상태를 쉽게 복원가능
- onStop에서 해제하지 않는 모든 자원 해제


### Fragment 생명주기

<img src="/assets/image/fragment-view-lifecycle.png">

뭐가 많아 보이지만 자세히 보면 크게 어려운건 없다.

> CREATED : 

`onAttach()`

- 프래그먼트가 액티비티에 포함되는 순간 호출

 , `onCreate()` , `onCreateView()` , `onViewCreated()` , `onViewStateRestored()`


- FragmentManager에 프래그먼트가 추가되고, onAttach()가 호출됨
- 뷰의 상태 초기화는 반드시 뷰가 생성된 이후인 onViewCreated()에서 수행해야함


`onStart()`
`onResume()`
``

### Rxjava vs coroutine

rxjava

- 