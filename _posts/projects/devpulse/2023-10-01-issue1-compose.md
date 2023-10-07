---
title: "[DevPulse❤️]Compose WrapContent"
categories: projects devpulse
tags:
    - [devpulse,project,compose,wrapContent]
date : 2023-10-01
last_modified_at: 2023-10-01
toc : ture
toc_sticky : true
---

데브 펄스는 클라임업 프로젝트를 하다 머리를 식힐 용도로 재미있게 만들어보려고 시작한 프로젝트이다.

간단한 ui로 만들 생각이었어서 컴포즈에 익숙해지기 좋겠다는 생각으로 클라임업을 시작하기 전에 손에 익히려고 잠깐 먼저 작업하는 중이다.

오랜만에 컴포즈로 작업하려니 가장 기본적인 UI 컴포넌트 배치에서부터 고난을 겪는것같다..😓

이번에도 원하던 위치에 컴포넌트가 제대로 배치되지 않는 이슈를 겪었는데 문제는 해당 프로그래스바를 포함한 화면인 TimeTrackScreen의 사이즈를 지정해주지 않았던게 문제였다..😅
[관련 이슈](https://github.com/gogumaC/DevPulse/issues/3)

문제는 해결되었지만 이외에 Modifier에 사이즈를 지정해주지 않았을때 어떤 방식으로 default사이즈가 결정되는지가 궁금해서 좀 더 실험하고 확인해 보았다.

결론을 먼저 말하자면 preview와 실제 실행에서 화면이 달랐다.

preivew의 경우에는 modifier에 사이즈를 지정해 주지 않았을 때 default가 wrapContent인것처럼 동작했다. 내용물이 없는 Box는 아래와 같이 미리보기가 되지 않았고 Text처럼 내용물이 있는 경우에는 내용물에 맞는 크기로 보여졌다.

에뮬레이터에서는 surface 스코프내에서는 화면 사이즈를 꽉 채워 width, height가 matchParent인 것 처럼 동작했지만 최상단에서는 나타나지 않았다.

에뮬레이터의 이러한 결과를 정리하기 위해 [공식문서의 관련 내용](https://developer.android.com/jetpack/compose/modifiers?hl=ko)을 요약해 보면 다음과같다.
 
1. 일반적으로 상위요소의 제약조건은 하위요소에 전달된다.
2. modifier를 하위 요소에 직접 전달하면 하위 요소가 상위 요소로부터 받은 제약 조건을 재정의 할 수 있다.
3. 하위 요소가 제약조건을 따르지 않으면 레이아웃 시스템은 상위 요소에서 하위 요소가 마치 제약 조건이 강제된것 처럼 하위 요소의 width와 height를 보여준다.
4. 이떄 하위요소는 상위요소가 할당한 공간 내에서 중앙에 배치한다.

---

이전에 공부했던 컴포즈를 다 잊어버린것같아서 헛공부했나 싶었는데 막상 문제를 맞닥드리니 '맞다 이랬었지' 하는 생각이 난다. 
공부했던 내용들이 어딘가에는 잘 남아있는것 같아서 다행이라는 생각이든다!


