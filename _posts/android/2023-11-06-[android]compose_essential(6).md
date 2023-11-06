---
title: "[android] Compose 기본사항(마지막) 정리"
categories: android jetpackCompose
excerpt : "Compose 기본사항(6) : Jetpack Compose의 상태 "
tags:
    - [android, JetpackCompose, compose, state]
date : 2023-11-06 13:30:00
last_modified_at: 2023-11-07 13:30:00
toc : ture
toc_sticky : true
---
[Jetpack Compose의 상태  -  Android Developers](https://developer.android.com/codelabs/jetpack-compose-state?hl=ko&continue=https%3A%2F%2Fdeveloper.android.com%2Fcourses%2Fpathways%2Fjetpack-compose-for-android-developers-1%3Fhl%3Dko%23codelab-https%3A%2F%2Fdeveloper.android.com%2Fcodelabs%2Fjetpack-compose-state#12)

이 코드랩은 원래 옛날옛적에 했던 코드랩인데 그동안 여차저차 다른일에 눈이 돌아가다 보니 오늘에서야 정리를 하게됐다.

오랜만에 보니 이 코드랩의 코스 이름이 몽땅 바뀌어서 이게 그건지 약간 헷갈리긴했는데 어쨌든 어떻게 잘 찾아냈다.

이전 포스팅들은 뭔가 엄청 꼼꼼히 적었던것 같은데 이건 그렇게 적지 않고 그냥 핵심! 만 골라서 오래도 잡아뒀던 이 코드랩 포스팅을 빠르게 끝내 보려고 한다.

## stateless
먼저 내용에 앞서 compose의 state에 대해 공부한다면 이 내용이 빠질 수 없는것 같다.

왜냐면 기존의 뷰와 가장 큰 차이점 중 하나이기 때문이다.

기존의 뷰에서 우리는 뷰 내부에서 상태를 저장하고 각 뷰가 가진 내부 상태를 기반으로 ui를 구성하였다.(stateful)

그러나 컴포즈에서는 컴포저블 함수는 자신의 상태를 스스로 저장하지 않고 (재사용성이나 테스트 용이성때문에) 외부에서 받은 상태를 기반으로 ui를 구성하는것을 권장한다.(stateless)s

대충 기억의 끄트머리에 있는 내용을 주섬주섬 주워 정리한 내용이라 더 자세한 내용이 필요하면 공식 문서나 [이 글](https://medium.com/androiddevelopers/adopt-compose-for-view-based-libraries-8db5badf1afc)을 참고하길 바란다.

( 사실 위의 링크는 상태관리가 주제인 글은 아니지만 내가 가장 최근에 봤기때문에 아마 저 글에 포함된 stateful,stateless에 대한 개념에 가장 큰 영향을 받은 것 같아서 남겨둔다. )


## Compose의 event

compose는 어떻게 onClick과 같은 이벤트를 받을 수 있는가.
컴포저블 함수에 onClick함수를 전달한다.

```kotlin
Button(onClick = { count++ }, Modifier.padding(top = 8.dp)) {
           Text("Add one")
       }
```

## Composable function의 메모리

- 컴포지션 : jetpackCompose에서 빌드한 ui 설명(?이라고 나와있는데 대충 정보나 상태인것 같다)
- 리컴포지션 : 데이터가 변경된때 컴포지션을 업데이트하기위해 컴포저블 재실행


## State, MutableState

> 데이터가 언제 변경되는지 얘가 어떻게 알고 리컴포지션을 하나?

- 이 변수는 state니까 데이터가 변하는지 추적해줘! 느낌 + 데이터가 변하면 리컴포지션해줘!

```kotlin
val count: MutableState<Int> = mutableStateOf(0)
```

## remember

> 하지만 리컴포지션되면 계속 초기화 값으로 초기화 되어버리는거 아닌가?

- 이 변수는 초기 컴포지션에만 저장하고 리컴포지션시에는 값을 초기화 하지 말아라! 느낌

```kotlin
val count: MutableState<Int> = remember { mutableStateOf(0) }
//이렇게 쓰면 count값 접근시 count.value로 접근

var count by remember { mutableStateOf(0) }
//이렇게 쓰면 그냥 count로 접근
```

## rememberSaveable

> 그럼 화면 돌려도 저장되나?

- 구성 변경간에 값을 유지하고 싶다면 rememverSaveable
- bundle에 저장할 수 있는값을 자동으로 저장, 혹은 커스텀 Saver객체 전달 가능

```kotlin
var count by rememberSaveable { mutableStateOf(0) }
```

## State Hoisting

> 근데 이렇게 remember를 사용해서 컴포저블 안에 상태를 저장하면 이건 stateful인것 같은데? stateless로 만드려면 어떻게 해야하나?

- 상태를 외부에서 파라미터로 받아서 해당 컴포저블에서 표시

- 일반적 패턴
    - value:T
    - onValueChange:(T)->Unit

- 특징
    - 단일 소스 저장소 
    - 끌어올린 상태를 여러 컴포저블과 공유 가능
    - 상태 변경 전 이벤트를 무시할지 결정가능(가로채기 가능)
    - 독립되고 분리되어 있으므로 어디에든 저장가능


## Lazy***

- 아이템 상태를 컴포저블 종료 이후에도(화면에서 사라졌다 다시 나타나는 경우) 유지키시고 싶다면 rememberSaveable

- 아이템 삭제를 위한 조취
    1. mutableStateList를 사용(toMutalbeStateList, mutableStateListOf())
    2. items메서드의 key(기본적으로 위치 기반으로 지정됨)를 각 아이템의 id로 사용하여 문제를 방지 

- 주의

```kotlin
// Don't do this!

val list = remember { mutableStateListOf<WellnessTask>() }

list.addAll(getWellnessTasks())

// Do this instead. Don't need to copy

val list = remember {

mutableStateListOf<WellnessTask>().apply { addAll(getWellnessTasks()) }

```

- Lazy*** 에서 화면이 넘어가면 해당 컴포저블이 종료되며 remember도 종료되어 상태가 유지되지 않으므로 사용
- rememberSaveable을 사용해 목록의 초기상태 만듦


## viewModel로 상태 이전

- state는 backing property로 지정하여 외부에서 수정할 수 없도록함

- 뷰모델 인스턴스를 다른 컴포저블에 전달하는것은 지양


### 컴포저블에서 viewModel접근

1. 라이브러리 추가 [(최신버전)](https://developer.android.com/jetpack/androidx/releases/lifecycle?hl=ko)

`implementation("androidx.lifecycle:lifecycle-viewmodel-compose:{latest_version}")`

2. viewModel()함수로 뷰모델 접근
    - 컴포저블이 액티비티에서 사용되고있는 동안 같은 인스턴스 반환

```kotlin
@Composable
fun WellnessScreen(
    modifier: Modifier = Modifier,
    wellnessViewModel: WellnessViewModel = viewModel()
) { ... }
```

<br>

## + 추가

- layoutInspector로 컴포지션 상태를 볼수있다(트리구조)





