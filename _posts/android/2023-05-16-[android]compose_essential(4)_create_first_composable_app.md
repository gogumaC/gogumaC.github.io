---
title: "[android] Compose 기본사항(4) 정리"
categories: 안드로이드 jetpackCompose
excerpt : "Compose 기본사항(4) : 첫 번째 Compose 앱 만들기"
tags:
    - [android, JetpackCompose, compose,compose_essential_4]
date : 2023-05-16
last_modified_at: 2023-05-16
toc : ture
toc_sticky : true
---

[이 코드랩](https://developer.android.com/codelabs/jetpack-compose-basics?hl=ko&continue=https://developer.android.com/courses/pathways/jetpack-compose-for-android-developers-1?hl=ko#codelab-https://developer.android.com/codelabs/jetpack-compose-basics#0)에서는

- UI구성요소=구성 가능한 함수=composable
- Material 3 사용

## ⚒️ [Modifier](https://developer.android.com/jetpack/compose/modifiers-list?hl=ko)

### 패딩

- 음수가 안되게 주의 → 앱이 다운 될 수 있음
    - `T.coerceAtLeast(minimumValue:T)`로 minimumValue를 0으로 설정해 음수가 안되게 할 수 있음([참고](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/coerce-at-least.html))

```kotlin
Modifier.padding(x.dp)

Modifier.padding(vertical=x.dp, horizontal=x.dp)

Modifier.padding(start,up,end,bottom)

//패딩이 0 이하로 내려가지 않도록함
Modifier.padding(x.dp.coerceAtLeast(0.dp))
```

### 넓이 맞추기

- matchParent느낌

```kotlin
Modifier.fillMaxWidth()
Modifier.fillMaxHeight()
Modifier.fillMaxSize()
```

### 가중치 설정

- 가중치 없는(유연성이 부족한) 다른 요소를 밀어냄

```kotlin
Modifer.weight(1f)
```

### 콘텐츠 자르기

- `clip(shape:Shape)`

```kotlin
Modifier.clip(RoundedCornerShape(12.dp))
```

### 그림자 설정

```kotlin
Modifier.shadow(evaluation=10.dp)
```

### 애니메이션 설정

```kotlin
Modifier.animateContentSize(
	animationSpec=spring(
		dampingRatio=Spring.DampingRatioMediumBouncy,
		stiffness=Spring.StiffnessLow
	)
)
```

## 🧱 Composable

### 코드랩에서 MainActivity 컴포저블 구조

```kotlin
...
setContent{
	***Theme{
		//앱 컴포저블 함수
		MyApp(modifier.Modifier.fillMaxSize())
	}
}
```

### 컴포저블 함수 정의

- (권장) 빈 Modifier매개변수를 포함하여 외부에서 컴포저블을 조정 가능하도록 함

```kotlin
@Composable
private fun MyApp(modifier:Modifier=Modifier){
	...
}
```

### 컴포저블 숨기기

- 컴포즈에서는 UI요소를 invisable같은 걸로 숨기지 않음
- 조건문 등을 사용하여 재구성시 컴포지션에 UI요소를 추가하지 않아 Compose가 생성하는 UI트리에 추가되지 않게함

### 컨테이너로 활용 가능한 컴포저블 만들기

- 매개변수로 `@Composable()→Unit` 넘겨줌
- 람다식으로 사용가능

```kotlin
@Composable
fun Container(
	modifier=...,
	content: @Composable()->Unit
){...}

//사용
@Composable
fun Screen(...){
	Container(){ 
		Text(...)
	}
}
```

### Text

```kotlin
Text(
	text="",
	modifier=...,
	style=MaterialTheme.typography.headlineMedium, //MaterailTheme안쓰고 고유한 TextStyle만들 수 도 있음.
	
)
```

### Surface

- 컨테이너 역할

```kotlin
Surface(
	color=MaterialTheme.colorScheme.color_name,
	modifier=...,
){...}
```

### Column, Row, Box

<img src="/assets/image/android/230516-android-compose_essential(4)_create_first_composable_app/column_row_box.png">

```kotlin
Coloumn(  //or Row, Box
	modifier=...,
){}
```

### Button

- Button
- ElevateButton
- FilledTonalButton
- OutlinedButton
- TextButton

```kotlin
Button(
	onClick={/*클릭시 실행할 함수*/}
){...}
```

### IconButton+Icon

- material-icons-extended에서 사용 가능

```kotlin
// build.gradle(app)
implementation "androidx.compose.material:material-icons-extended:$compose_version"
```

```kotlin
IconButton(
	onClick={},
	modifier=...
){
	Icon(
		imageVector = if (expanded) Filled.ExpandLess else Filled.ExpandMore, //아이콘 이미지 설정
		contentDescription=if(expanded)stringResource(...)elsestringResource(...),
	){}
}
```

### Card

```kotlin
Card(
	colors=CardDefaults.cardColors(
		containerColor=MaterialTheme.colorScheme.primary
		),
		modifier=...
){}
```

### LazyColumn , LazyRow

- view의 리사이클러뷰와 유사
- 리사이클러뷰처럼 하위요소 재활용하지않고 새 Composable을 방출하는 식으로 구현됨
    - 요소가 화면 밖으로 나갔다가 다시 그려지는 경우 재구성되므로 상태를 저장하고 싶으면 `rememberSaveable`사용
- items : 뷰홀더 느낌, 요소 각각을 관리

```kotlin
import androidx.compose.foundation.lazy.items
//안드로이드 스튜디오는 다른 items함수를 선택하므로 필요함

...

LazyColumn(
	modifier=...,
){
	items(items=itemList){it->
		...
	}
}
```

## 🤝 State

### 컴포저블에 내부상태 추가

- `mutalbeStateOf` : 상태 할당, Compose가 이 state를 읽는 함수를 재구성
    - 얘만 사용하면 같은 값으로 값을 재설정 하는 경우에도( ex) false→ false ) 리컴포지션 해버린다는 것 같음
    - 따라서 `remember`로 이전 상태를 기억해서 위와 같은 경우에서 리컴포지션을 방지해야함
- `remember` : 상태 기억
- 컴포저블 함수는 상태를 자동으로 구독하여 상태변경시 이 상태를 읽는 컴포저블은 재구성되어 업데이트 표시하게됨.

```kotlin
val isExpanded= remember {mutalbeStateOf(false)}
//isExpanded.value 로 접근

val isExpanded by remember{mutableStateOf(false)}
//isExpanded 로 접근
```

### 상태 호이스팅(끌어올림)

- 컴포저블 함수에서 여러 함수가 읽거나 수정해야하는 상태를 공통의 상위 항목에 위치 시키는것
- 상위 요소에서 제어할 필요가 없는 상태는 호이스팅 되면 안됨!
- 예시

<img src="/assets/image/android/230516-android-compose_essential(4)_create_first_composable_app/composable_structure_example.png" width=300px >
<img src="/assets/image/android/230516-android-compose_essential(4)_create_first_composable_app/click_event_flow.png" width=500px >


### 상태유지

- `remember`는 컴포저블이 컴포지션에 유지되는 동안만 작동
    
    → 기기회전시 전체 액티비티가 다시 시작되므로 모든 상태가 손실됨. 
    
    → 구성변경, 프로세스 중단시에도 손실
    
- `rememberSaveable` : 구성변경과 프로세스 중단에도 각 상태를 저장

```kotlin
var state by rememberSaveable{ mutalbeStateOf(true)}
```

## 🏃 [애니메이션](https://developer.android.com/jetpack/compose/animation?hl=ko)

### 애니메이션 추가

- `animate**AsState(목표값 : **)`
- 해당 목표값에 도달하는 애니메이션 추가됨

```kotlin
//animateDpAsState(목표값:Dp)
val extraPadding by animateDpAsState( 
	if (...)48.dp else 0.dp
)
```

### 애니메이션에 효과 추가 (animationSpec)

```kotlin
val extraPadding by animateDpAsState( 
	30.dp,
	animationSpec=spring( //스프링 효과
		dampingRatio=Spring.DampingRatioMediumBouncy, //감쇠비율
		stiffness=Spring.StiffnessLow //강성
	)
)
```

### Modifier를 통한 애니메이션 추가

- [Modifer에서 설명](#애니메이션-설정)

## 🎨 테마

- ui/theme폴더에 현재 테마와 관련된 모든 항목 보관

### 앱이름Theme

- ui/theme/Theme.kt에 구현되어있음
- 기본적으로 MaterialTheme을 내부적으로 래핑하여 Material디자인 적용

### MaterialTheme

- Material 디자인 사양의 스타일 지정원칙 반영한 컴포저블 함수
- content로 들어오는 하위 컴포저블 요소에 적용됨
- 모든 하위 컴포저블은 MaterialTheme의 속성을 사용 가능
- 속성
    1. colorScheme
    2. typography
    3. shapes

```kotlin
Text(
	...,
	style=MaterialTheme.typography.headlineMedium
	//MaterialTheme에 저장된 textStyle
	// displayLarge, headlineMedium, titleSmall, bodyLarge, labelMedium 등
)
```

- 일반적으로 Material 내부 스타일 유지하는게 직접 하드코딩하는것보다 오류발생 가능성이 적어서 권장
- 약간의 수정은 `copy`를 사용

### 미리 정의된 스타일을 수정(`copy`)

```kotlin
Text(
	...,
	style=MaterialTheme.typography.headlineMedium.copy(
		fontWeight=FontWeight.ExtraBold
	)
)
```

### 새로운 색상 정의 및 테마에 적용

- ui/theme/Color.kt

```kotlin
val Navy=Color(0xFF0730422)
```

- MaterialTheme 팔레트에 색상 할당 (ui/theme/Theme.kt)
    
    (미리보기에서는 기본적으로 [dynamicColor](https://m3.material.io/styles/color/dynamic-color/overview)가 사용되므로 아래와 같이 변경해도 반영되지 않음.)
    

```kotlin
private val LifhgtColorScheme=lightColorScheme(
	surface=Blue,
	onSurface=Color.White,
	primary=LightBlue,
	onPrimary=Navy
)
```

- 다크모드 팔레트 정의 (ui/theme/Theme.kt)

```kotlin
private val DarkColorScheme = darkColorScheme(
    surface = Blue,
    onSurface = Navy,
    primary = Navy,
    onPrimary = Chartreuse
)
```

## 👀 Preview

```kotlin
@Preview(
	showBackground = true, // 배경색 보이기
	widthDp=320, // 미리보기 가로 dp 설정
	heightDp=320, //미리보기 세로 dp 설정
	uiMode=UI_MODE_NIGHT_YES, //다크모드 설정
	name="Dark", //미리보기 이름 설정
)
```

## 🎸기타

### 문자열 리소스 사용

- 문자열 리소스 추가(app/src/res/values/strings.xml)

```kotlin
<string name="string_name">String Contents</string>
```

- 사용

```kotlin
stringResource(R.string.string_name)
```