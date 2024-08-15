---
title: "[Android] 뒤로가기 이벤트 콜백 동작 원리 및 Compose에서 뒤로가기 제어"
categories: android
excerpt : "책임 연쇄 패턴에 따른 뒤로가기 동작 원리와 BackHandler를 활용한 Compose 뒤로가기 이벤트 제어"
tags:
    - [android, JetpackCompose, compose, BackHandler, Chain of Responsibility, 책임연쇄, OnBackPressedCallback, OnBackPressedDispatcher]
date : 2024-08-15 18:03
last_modified_at: 2024-08-15 18:03
toc : ture
toc_sticky : true
header:
  og_image: /assets/image/2024-08-15-15-29-12.png
---

## 뒤로가기 동작 제어 원리

액티비티에서 뒤로가기 이벤트가 발생시 `OnBackPressed`함수가 호출된다.

해당 함수를 오버라이드 해서 사용할 수 도 있지만 `OnBackPressedCallback`과 같은 콜백을 활용하여 **액티비티와 뒤로가기 이벤트 사이의 결합도를 낮추고** 유연한 코드 구조를 만들 수 있다.

### 동작 원리

![](/assets/image/2024-08-15-15-29-12.png)

1. `OnBackPressedCallback` 1,2,3이 순서대로 `OnBackPressedDispatcher`에 등록된다.
2. 뒤로가기 이벤트 발생
3. 액티비티 내부의 `onBackPressed`함수가 호출된다.
4. `OnBackPressedDispatcher`는 가장 마지막에 등록되었던 세번째 콜백 부터 순서대로 활성화 여부를 검토하여 가장 마지막에 추가된 활성화 된 콜백을 해당 이벤트에 연결한다.

### 구성요소

- [OnBackPressedDispatcher](https://developer.android.com/reference/androidx/activity/OnBackPressedDispatcher)
    - back 버튼 이벤트를 하나 이상의 `OnBackPressedCallback` 객체로 전달되는 방법을 제어한다.
    - 쉽게 표현하자면 여러개의 뒤로가기 제어 로직 중 어떤 로직을 적용할지 결정해주는 역할을 한다.
    - 어떤 콜백을 연결 할지는 ‘책임연쇄 패턴(Chain of Responsibility)’을 따른다.
        - 대충 미리 설명하자면 가장 마지막에 추가된 활성화된 콜백을 실행한다.
    - 이외에도 제어와 관련된 다양한 기능을 사용할 수 있다.
    - 콜백 추가 시 `addCallback()` 함수를 사용하며, 이 때 **lifecycleOwner**를 함께 넘겨주면 라이프사이클에 따라 자동으로 콜백을 추가 및 제거하므로 메모리 누수 방지에 도움이 된다. 
    
    (STARTED - 추가, DESTROY - 삭제)
    
- [OnBackPressedCallback](https://developer.android.com/reference/androidx/activity/OnBackPressedCallback)
    
    ```java
    public abstract class OnBackPressedCallback
    
    OnBackPressedCallback(boolean enabled)
    ```
    
    - 뒤로가기 이벤트(`OnBackPressedDispathcer.onBackPressed`)를 `ComponentAcitity`에 강하게 결합하지 않고 사용하기 위한 방법
    - 내부에 enable로 호출 제어
    - 해당 콜백이 enable 되어야만 해당 로직 실행
    

### Chain of Responsibility Pattern : 책임 연쇄 패턴

- 추가된 콜백은 추가된 순서의 **역순**으로 호출이 됨
- 예를들어 one, two, three순으로 추가되었다면 three, two, one순으로 호출된다.
- 체인의 각 콜백은 앞의 콜백이 `enable=false`일 경우에만 호출됨
- 그니까 만약 three가 `true`라면 그냥 three가 호출되는거고 `false`라면 three다음인 two를 검토하고 활성화 되어있다면 호출한다.

case | 나중에 추가된 콜백이 활성화 되어있는 경우 | 나중에 추가된 콜백이 비활성화 되어있는 경우
---|---|---
과정 | ![](/assets/image/2024-08-15-15-30-38.png) | ![](/assets/image/2024-08-15-15-30-48.png)
결과 | 맨 마지막에 등록된 콜백이 활성화 되어 있으므로 해당 콜백이 호출된다. | 맨 마지막 등록된 콜백이 비활성화 되어있으므로 해당 콜백의 다음 콜백을 검토하여 활성화된 가장 마지막 콜백을 실행한다.

## Compose에서 뒤로가기 동작제어 : `BackHandler`

### 개요

```kotlin
@Composable
fun BackHandler(enabled: Boolean = true, onBack: () -> Unit): Unit
```

컴포즈에서는 `BackHandler`를 통해 위의 과정을 대체한다.

실제로 [내부 코드](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:activity/activity-compose/src/main/java/androidx/activity/compose/BackHandler.kt?q=file:androidx%2Factivity%2Fcompose%2FBackHandler.kt%20function:BackHandler)를 보면 `onBackPressedCallback`과 `OnBackPressdDispatcher`를 활용하여 위 과정과 같이 동작한다.

```kotlin
var backHandlingEnabled by remember { mutableStateOf(true) }
BackHandler(backHandlingEnabled) {
    // Handle back press
}
```

모든 컴포저블 내부에 `BackHandler`를 설정할 수 있지만 연쇄 책임 패턴에 따라 **가장 내부의 `BackHandler`만 실행**되며, 가장 내부의 `BackHandler`가 `false`인 경우에는 그 전에 추가했던 `BackHandler`가 실행된다.

### 예제

깃헙 playground레포에서 배운 내용이 진짜인지 확인할 겸 BackHandler를 실험해 보았다.

엄청 자세한 예제는 아니고 책임 연쇄가 제대로 동작하는지 확인 하기 위한 코드이다.

아래 링크는 모두 같은 내용이며 편의를 위해 전부 올려두었다.

GithubRepo : [github.com/gogumaC/playground](https://github.com/gogumaC/playground/tree/compose/backHandler)

관련 이슈 : [playground/issues/5](https://github.com/gogumaC/playground/issues/5)

코드 : [gogumac/playgroundforandroid/MainActivity.kt](https://github.com/gogumaC/playground/blob/compose/backHandler/playgroundForAndroid/app/src/main/java/kr/co/gogumac/playgroundforandroid/MainActivity.kt)

### `PredictiveBackHandler`

문서를 보다보니 `PredictiveBackHandler`라는 것도 있었다.

안드로이드 13부터 '예측가능한 뒤로가기'인가 하는게 슬슬 나오고 안드 14부터 적용된다고 하는데 그것과 관련이 있는 것 같다.

하여간 일반 `BackHandler`와 차이점은 `BackHandler`는 뒤로가기 버튼을 클릭 시 동작하는 로직이라면 `PredictiveBackHandler`는 뒤로가기 전반적인 동작을 추적하고 커스텀 할 수 있게 도와주는 느낌인 것 같다.

| 기능 | 실행시점 | 예측동작 | 사용사례 |
| --- | --- | --- | --- |
| BackHandler | 뒤로가기 버튼을 누른 즉시 | X | 뒤로가기 동작을 가로채 특정 동작으로 커스텀 |
| PredictiveBackHandler | 뒤로가기 제스처 감지시(버튼 누르기 전) | O | 뒤로가기 제스처에 대한 애니메이션이나 시각적 피드백 제공 |

사실 이것도 BackHandler랑 같이 실험해보려고 했는데 예측가능한 뒤로가기 적용하는게 실패해서 실행을 못시켜봐서 저게 완전히 맞는 건지는 잘 모르겠다.

다음에 사용할 일이 있으면 확인해봐야 할 것 같다.

## 참고

[Jetpack Compose 뒤로가기 이벤트 처리하기](https://medium.com/sungbinland/jetpack-compose-뒤로가기-이벤트-처리하기-69cbc47268ea)

[맞춤형 뒤로 탐색 기능 제공  \|  Android Developers](https://developer.android.com/guide/navigation/navigation-custom-back?hl=ko)

[뒤로 탐색 예측 동작 지원 추가  \|  Android Developers](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture?hl=ko)

[Compose 및 기타 라이브러리  \|  Jetpack Compose  \|  Android Developers](https://developer.android.com/develop/ui/compose/libraries?hl=ko#handling_the_system_back_button)

[androidx.activity.compose  \|  Android Developers](https://developer.android.com/reference/kotlin/androidx/activity/compose/package-summary#BackHandler(kotlin.Boolean,kotlin.Function0))

[뒤로 탐색 예측 동작 지원 추가  \|  Android Developers](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture?hl=ko)

[예측 가능한 후면 디자인  \|  Mobile  \|  Android Developers](https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back?hl=ko)

[Activity  \|  Jetpack  \|  Android Developers](https://developer.android.com/jetpack/androidx/releases/activity#1.8.0)





