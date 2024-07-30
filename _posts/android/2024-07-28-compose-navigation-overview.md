---
title: "Compose Navigation Overview"
categories: android jetpackCompose
tags:
    - [android, compose, navigation]
date : 2024-07-28 14:53
last_modified_at: 2024-07-28 14:53
toc : ture
toc_sticky : true
excerpt : "compose navigation 간단한 사용법 및 type safety"
---

여차저차 하다보니 프로젝트 코드의 네비게이션 부분을 날려버렸다🥲

다시하려고 하는데 코드를 잊어버려서 나중에 또 이럴까봐 미리 공식 문서를 좀 정리했다.

사실 귀찮은 작업일 줄 알았는데 그동안 새로 업데이트된 부분을 접해보게 되어서 나름 보람있었다.

## compose navigation은 왜 필요한가?

사실 처음에는 컴포즈에 이런 라이브러리를 굳이 사용할 필요가 있을까 생각이 들었다.

조건문으로 UI를 제어하면 화면 전환을 구현할 수 있을거라고 생각했기 때문이다.

그렇지만 화면을 제어한다는 것은 화면의 이동 뿐만 아니라 그 이동 간 데이터 전달, 백스택 관리 등 생각보다 고려해야할 사항이 많았고, compose navigation를 통해 이러한 부분을 간편하게 사용할 수 있다는 점이 장점이라고 생각한다.


## 용어

- `Controller` : destination간 이동을 제어하는 central coordinator.
- `Host` : 현재 화면을 포함하는 UI요소, 대충 액자 같은거라고 생각하면 편함. 내부에 화면을 슉슉바꿔서 원하는 destination을 보여줄 수 있는 화면 액자같은 느낌.
- `Graph` : 앱 내의 모든 navigation destination과 화면 연결 방식을 정의하는 자료구조. 여기에 미리 정의된 화면으로만 이동할 수 있다. 대충 지도 느낌.
- `Destination` : navigation graph의 노드. host가 보여주는 화면
- `Route` : destination으로 이동하는데 사용되는 경로. destination과 이동 시 필요한 데이터를 고유하게 식별하기 위한 Serializable객체(ex 문자열)

개인적으로는 개념 자체는 약간 이런 느낌이다.

![](/assets/image/2024-07-28-14-53-06.png)

## dependency

compose navigation을 사용하기 위해서는 모듈 레벨의 build.gradle 파일에 아래와 같은 의존성을 추가해 주어야한다.

`2.8.0-alpha08` 이 버전을 분기로 타입 안전성을 가진 route에 대한 업데이트가 있었다.

타입 안전성을 위한 route 업데이트를 적용하려면 해당 버전 이상으로 버전을 설정해야한다.

```kotlin
dependencies{
    val nav_version="2.8.0-alpha08"
    implementation ("androidx.navigation:navigation-compose:$nav_version")
}

```


## 간단한 사용법

### 1. navigation Controller생성

```kotlin
val navController=rememverNavController()
```

- 컴포저블 계층구조에서 참조할 모든 컴포저블을 참조 할 수 있는 계층에서 생성해야한다. (state hoisting)

### 2. navigation Host생성

**방법1)** route를 타입으로 전달하기 (*[Navigation 2.8.0-alpha08](https://developer.android.com/jetpack/androidx/releases/navigation?hl=ko#2.8.0-alpha08) 이상에서만 가능)

- 매개변수 보내는데 타입 안전성을 더할 수 있는 방법이다.

```kotlin
//@Serializable어노테이션 사용을 위한 의존성 추가
//build.gradle(module)
plugins {
    kotlin("plugin.serialization") version "2.0.0" // 사용중인 코틀린 버전에 맞춰야 오류가 안나는것 같다.
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.1")
}

```

```kotlin
@Serializable
object Profile
@Serializable
object FriendsList

NavHost(navController=navController,startDestination=ScreenA){
//요기가 NavGraphBuilder영역으로, 여기 코드로 NavGraph가 정의되어 NavHost에게 전달된다.
	composable<ScreenA>{ScreenA(/*...*/)}
	composable<ScreenB>{ScreenB(/*...*/)}
}
```

**방법2)** route에 string이나 id전달

- NavHost에서 NavGraph를 만들때 route에 string이나 정수 id를 전달할 수 있다.

🚨 이 경우 나중에 매개변수를 보낼 때 “screenA/arg1/arg2” 뭐 이런 식으로 route를 전달하게 되서 Type safety하지 않다.

```kotlin
NavHost(navController=navController,startDestination="ScreenA"){
//개인적으로 이부분은 다른 파일이나 하여간 따로 관리해도 좋을것같다.
	composable(route="ScreenA"){ScreenA(/*...*/)}
	composable(route="ScreenB"){ScreenB(/*...*/)}
}
```

```kotlin
graph:NavGraphBuilder.()->Unit={
	composable(route="ScreenA"){ScreenA(/*...*/)}
	composable(route="ScreenB"){ScreenB(/*...*/)}
}

NavHost(navController=navController,startDestination=ScreenA,builder=graph)
//화면이 많으면 graph부분을 다른 파일로 빼는게 도움지 될 수 있지 않을까?
```

⚡️ **NavHost**

```kotlin
@Composable
public fun NavHost(
    navController: NavHostController,
    startDestination: String,
    modifier: Modifier = Modifier,
    contentAlignment: Alignment = Alignment.Center,
    route: String? = null,
    enterTransition: (AnimatedContentTransitionScope<NavBackStackEntry>.() -> EnterTransition) =
        { fadeIn(animationSpec = tween(700)) },
    exitTransition: (AnimatedContentTransitionScope<NavBackStackEntry>.() -> ExitTransition) =
        { fadeOut(animationSpec = tween(700)) },
    popEnterTransition: (AnimatedContentTransitionScope<NavBackStackEntry>.() -> EnterTransition) =
        enterTransition,
    popExitTransition: (AnimatedContentTransitionScope<NavBackStackEntry>.() -> ExitTransition) =
        exitTransition,
    builder: NavGraphBuilder.() -> Unit
)
```

⚡️ **NavGraph**

```kotlin
public fun NavGraphBuilder.composable(
    route: String,
    arguments: List<NamedNavArgument> = emptyList(),
    deepLinks: List<NavDeepLink> = emptyList(),
    enterTransition: (@JvmSuppressWildcards
        AnimatedContentTransitionScope<NavBackStackEntry>.() -> EnterTransition?)? = null,
    exitTransition: (@JvmSuppressWildcards
        AnimatedContentTransitionScope<NavBackStackEntry>.() -> ExitTransition?)? = null,
    popEnterTransition: (@JvmSuppressWildcards
        AnimatedContentTransitionScope<NavBackStackEntry>.() -> EnterTransition?)? =
            enterTransition,
    popExitTransition: (@JvmSuppressWildcards
        AnimatedContentTransitionScope<NavBackStackEntry>.() -> ExitTransition?)? =
            exitTransition,
    content: @Composable AnimatedContentScope.(NavBackStackEntry) -> Unit
)
```

### 3. destination으로 이동

navController를 활용하여 destination으로 이동할 수 있다.

다양하게 [overload](https://developer.android.com/reference/kotlin/androidx/navigation/NavController#navigate(kotlin.Int)) 되어 있어 상황에 맞춰 사용하면 된다.

```kotlin
@MainThread
public void navigate(@NonNull Uri deepLink)

@MainThread
open fun navigate(resId: @IdRes Int): Unit

@MainThread
open fun navigate(directions: NavDirections): Unit

//.. 등등

```

- Composable로 이동 시

```kotlin
@Serializable
object FriendsList

navController.navigate(route = FriendsList)

//or route를 string으로 사용시

navController.navigate("FriendsList")

```

🚨 주의할점은 만약 컴포저블 내부에서 화면이동을 제어하고 싶을 시 자식 컴포저블로 navController를 보내서 자식 컴포저블 내부에서 navigate를 호출하면 안된다. UDF(단방향 데이터플로우)원칙에 따라 이벤트를 노출해서 상위에서 NavController를 제어해야한다.

```kotlin
@Composable
fun Parent(){
	val navController=rememberNavController()
	//...
	Child(){
		navController.navigate(/*destination route*/)
	}
}

@Composable
fun Child(onScreenChange:()->Unit){
}
```

## 참고

[Navigation with Compose  \|  Jetpack Compose  \|  Android Developers](https://developer.android.com/develop/ui/compose/navigation)

[Navigation  \|  Android Developers](https://developer.android.com/guide/navigation)

[Kotlinx-Serialization  \| 매쉬업 안드로이드 개발자](https://mashup-android.vercel.app/mashup-12th/jieun/kotlinx-serialization/)

[Serialization \| Kotlin](https://kotlinlang.org/docs/serialization.html#add-plugins-and-dependencies)

[GitHub - Kotlin/kotlinx.serialization: Kotlin multiplatform / multi-format serialization](https://github.com/Kotlin/kotlinx.serialization)

[NavController  \|  Android Developers](https://developer.android.com/reference/androidx/navigation/NavController#navigate(android.net.Uri))

