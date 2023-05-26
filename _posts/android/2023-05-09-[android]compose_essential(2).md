---
title: "[android] Compose 기본사항(2) 정리"
categories: 안드로이드 jetpackCompose
excerpt : "Compose 기본사항(2) : Compose 개요 (2021 Google IO)"
tags:
    - [android, JetpackCompose, compose, 2021GoogleIO,]
date : 2023-05-09
last_modified_at: 2023-05-09
toc : ture
toc_sticky : true
---
[2021 Google IO - Jetpack Compose](https://youtu.be/7Mf2175h3RQ) 
내용 정리

## Compose 개발 배경

<img src="/assets/image/android/230509-android-compose_essential(2)_compose_outline/2023_google_IO_view_history.png">

- 원래 사용했던 XML기반 Views는 10년전에 개발됨(2010)
- 지금은 상황이 변화됨
    - 기기성능 향상
    - UI가 더 동적이고 표현이 풍부해짐
- 따라서 최신아키텍처를 기반으로 하고 코틀린을 활용하는 현대적인 도구 키트에 대한 니즈가 생김
- → 니즈에 맞춰 개발된게 **Jetpack Compose**!

### Jetpack compose가 UI를 빠르고 쉽게 구축할 수 있는 이유

- jetpack compose = **선언적 UI Tookit**

### 선언적

- 요즘앱은 데이터가 동적이고 실시간으로 업데이트됨
- **XML기반 Views**를 사용할 경우 데이터가 바뀌면 UI도 업데이트해야함→XML레이아웃과 UI의 state를 동기화 해야함 → state를 동기화하는 과정에서 버그 발생 여지가 커짐

<img src="/assets/image/android/230509-android-compose_essential(2)_compose_outline/2023_google_IO_views.png">

- **compose**의 경우 state를 ui로 변환
- 컴포저블은 데이터를 UI로 바꾸는것→따라서 UI동기화 문제가 없다
- UI는 변경불가, 한번 생성시 업데이트 불가능
- 따라서 state가 변하면 ui를 새로 생성(**리컴포징,재생성**)하므로 동기화 문제 해결
- 변경되지 않은 요소에 대한 작업은 건너뜀
- 코드는 특정 상태에 대한 UI형태를 설명할뿐 생성방법을 지정하지 않음
- 재사용 가능한 요소로 구성된 라이브러리로 UI를 나누는것이 좋음
- 각 **컴포저블은 변경불가**→ 컴포저블 참조하거나 나중에 쿼리하거나 내용 업데이트 불가
- 체크박스에서 상태변화 안 시켜주면 터치해도 시각적 변화는 없음
- 유지하고 싶은 변수는 **remember**을 사용해 저장해서 재할당을 방지하거나 상태에 고정 가능

- 특정상태에서 UI형태를 완전히 설명하고 상태가 바뀌면 프레임워크에서 UI업데이트 처리
- 컴포즈는 단방향 데이터 플로우를 따르는 아키텍처와 잘맞음

### UI toolkit

- Material design, theme시스템 구현

- Row〰️Horizontal LinearLayout
- Column〰️Vertical LinearLayout
- Box〰️FrameLayout

- 컴포즈 레이아웃 모델은 여러 적도를 전달할 수 없어서 중첩된 레이아웃에 적합
- Compose DSL을 적용한 ConstraintLayout사용시 커스텀 레이아웃도 간단하게 구현가능
- 애니메이션 사용 편해짐
- 컴포즈는 테스트와 접근성이 젤중요
- UI에 병렬 트리를 생성하는 시맨틱 시스템 기반
- 컴포저블 테스트가능
- 컴포즈는 코틀린으로만 개발→언어적 이점을통해 강력하고 간결하고 직관적 API구축
- 코루틴으로 간단하게 비동기식 API작성가능
- 컴포즈는 기존 뷰와 호환됨
- 다른 주요 라이브러리,아키텍처랑 호환됨
- 다양한 크기의 플랫폼호환