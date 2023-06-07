---
title: "[android] Compose 기본사항(5) 정리"
categories: android jetpackCompose
excerpt : "Compose 기본사항(5) : Compose의 기본 레이아웃 "
tags:
    - [android, JetpackCompose, compose]
date : 2023-05-26
last_modified_at: 2023-05-26
toc : ture
toc_sticky : true
---
[Compose의 기본 레이아웃  -  Android Developers](https://developer.android.com/codelabs/jetpack-compose-layouts?hl=ko&continue=https://developer.android.com/courses/pathways/jetpack-compose-for-android-developers-1?hl=ko#codelab-https://developer.android.com/codelabs/jetpack-compose-layouts#0)

❗ 레이아웃을 다루는 코드랩이므로 상태와 관련된 내용은 무시했음을 주의 ❗ 

## 🎨 디자인 분석

- 재사용 사능한 컴포저블로 나누기
- 가장 낮은 수준 컴포저블로 시작해 복잡한 컴포저블 순으로 구현

<br>

## ✨ Modifier

- 컴포저블의 크기,레이아웃,동작,모양 변경
- 접근성 라벨과 같은 정보 추가
- 사용자 입력 처리
- 요소를 클릭,스크롤,드래그,확대/축소 가능하게 만드는 것과 같은 상호작용 추가

### 요소 최소 높이 지정

    ```kotlin
    //높이 지정
    Modifier.height(56.dp)
    //최소 기본 높이 지정 - 단, 사용자가 글꼴 크기 확대 시 크기 커질 수 있음
    Modifier.heightIn(min=56.dp) 
    ```

### 베이스라인 패딩

```kotlin
//컨텐츠외곽선으로 부터 패딩
Modifier.padding(...)
//베이스 라인(컨텐츠가 놓여있는 선)으로 부터 패딩
Modifier.paddingFromBaseLine(top=40.dp,bottom=8.dp)
```

### clip : 컴포저블 모양 조정

```kotlin
import androidx.compose.foundation.shape.CircleShape

Modifier.clip(CircleShape) // 원형으로 clip
//둥근 코너 모양 : RoundedCornerShape(3.dp)
```

### Size : 컴포저블 사이즈 조정

```kotlin
Modifier.size(56.dp)
```

### verticalScroll(Column), horizontalScroll(Row) : 수동으로 스크롤 동작 추가

```kotlin
Column(
	modifier.verticalScroll(rememberScrollState()) 
)
```

- ScrollState
    - 스크롤의 현재상태를 포함
    - 외부에서 스크롤 상태 수정에 사용
    - 스크롤 상태 수정이 필요 없다면 위의 예시처럼 사용

<br>

## 🥨 정렬(Alignment)

```kotlin
***(
	horizontalAlignment=Alignment.~ //Column의 하위 요소 기본 정렬 설정
	verticalAlignment=Alignment.~ //Row의 하위 요소 기본 정렬 설정
	contentAlignment=Alignment.~ //Box의 하위 요소 기본 정렬 설정
){
	Sub***(
		//해당요소의 상위 요소에 대한 정렬 설정
		modifier=modifier=Modifier.align(Aligment.~)
	)
}
```

### (Lazy)Column

- 하위요소를 가로로 정렬

```kotlin
//왼쪽 정렬
horizontalAlignment=Alignment.Start 
//오른쪽 정렬
horizontalAlignment=Alignment.End 
//가운데 정렬
horizontalAlignment=Alignment.CenterHorizontally 
```

### (Lazy)Row

- 하위 요소를 세로로 정렬

```kotlin
//위쪽 정렬
verticalAlignment=Alignment.Top
//아래쪽 정렬
verticalAlignment=Alignment.Bottom 
//가운데 정렬
verticalAlignment=Alignment.CenterVertically
```

### Box

- 하위 요소를 가로 및 세로로 정렬

```kotlin
//왼쪽 위 정렬
contentAlignment=Alignment.TopStart 
//가운데 위 정렬
contentAlignment=Alignment.TopCenter 
//오른쪽 위 정렬
contentAlignment=Alignment.TopEnd

//왼쪽 가운데 정렬
contentAlignment=Alignment.CenterStart 
//중앙에 정렬
contentAlignment=Alignment.Center
//오른쪽 가운데 정렬
contentAlignment=Alignment.CenterEnd 

//왼쪽 아래 정렬
contentAlignment=Alignment.BottomStart 
//가운데 아래 정렬
contentAlignment=ALignment.BottomCenter
//오른쪽 아래 정렬
contentAlignment=Alignment.BottomEnd 
```

<br>

## 🍞 배치(Arrangement)

정렬(Alignment)이랑 스펠링이 비슷(?)하지만 완전 다르므로 구분해야 한다!

- 정렬(Alignment) : 기준축에 수직 방향으로 작용
- 배치(Arrangement) : 기준축 방향으로 작용

### (Lazy)Column

```kotlin
//요소사이 고정된 간격추가
verticalArrangment=Arrangement.spacedBy(8.dp)
```

<img src="\assets\image\android\230526-android-compose_essential(5)\arrangement_column.gif" width=300px>

### (Lazy)Row

```kotlin
//요소사이 고정된 간격추가
horizontalArrangment=Arrangement.spacedBy(8.dp)
```

<img src="\assets\image\android\230526-android-compose_essential(5)\arrangement_row.gif" width=500px>

<br>

## 🧱 Composable

### TextField : 검색창 만들기

```kotlin
//material 3
TextField(
        //입력 가능한 텍스트 요소
        value = "",//초기값 지정
        onValueChange = {},//값 바뀔때 호출
        leadingIcon = { //앞쪽 아이콘
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = null,
            )
        },
        colors = androidx.compose.material3.TextFieldDefaults.colors(//textFiledDefault에서 변경된 backgroundColor만 변경
            unfocusedContainerColor = MaterialTheme.colorScheme.surface
        ),
        placeholder = {
            Text(stringResource(id = R.string.placeholder_search))
        },
        modifier = modifier
            .fillMaxWidth() //상위요소의 전체 가로 공간 차지하도록 설정
            .heightIn(min = 56.dp), //요소의 높이를 고정 높이가 아닌 최소높이로 지정하여 내용물에 따라 크기 변할 수 있도록 설정(권장)

    )
```

```kotlin
//그냥 material1을 사용할 때 변경사항
colors= TextFieldDefaults.textFieldColors(
			backgroundColor=MaterialTheme.colors.surface //textFiledDefault에서 변경된 backgroundColor만 변경
		)
```

### Image : 이미지를 자르고 스케일을 설정하기

```kotlin
Image(
	painter = painterResource(R.drawable.~), // 이미지에 들어갈 드로어블
	contentDescription=null, // 이미지 설명(권장), 다른 부분에 이미지 설명이 있다면 없어도 됨.
	contentScale=ContentScale.Crop, //이미지 스케일링 설정
	modifier=Modifier.
		.size(88.dp) //이미지 크기 설정
		.clip(CircleShape) // 이미지 모양 설정
)
```

<img src="\assets\image\android\230526-android-compose_essential(5)\contentScale_option.png" width=500px>

### Surface : 모양 설정하기

```kotlin
Surface(
	shape=MaterialTheme.shapes.small
){
	...
}
```

### Text : 텍스트 스타일 변경

- 웬만하면 material에 정해진 기본 스타일 추천

```kotlin
Text(
	text=...,
	style=MaterialTheme.typograpgy.***)
```

### 요소 사이 간격 지정, 내용물 패딩 지정(LazyRow,LazyColum,)

```kotlin
//요소 사이 간격 지정
LazyRow(
	horizontalArrangement=Arrangement.spacedBy(8.dp)
)
LazyColumn(
    verticalArrangement=Arrangement.spacedBy(8.dp)
	
)

//내용물 패딩 지정
LazyRow( //or LazyColumn
	contentPadding=PaddingValues(horizontal=16.dp)
)
```

❗padding으로 내용물 패딩 지정 시 **스크롤이 잘림**

### LazyGrid

- LazyHorizontalGrid

```kotlin
LazyHorizontalGrid(
       rows = GridCells.Fixed(2), // 행 개수 지정
       contentPadding = PaddingValues(horizontal = 16.dp), //내용물 패딩 지정
       horizontalArrangement = Arrangement.spacedBy(8.dp), //가로방향 요소 간격 지정
       verticalArrangement = Arrangement.spacedBy(8.dp), //세로방향 요소 간격 지정
       modifier = modifier.height(120.dp) //높이 지정
   ) {
       items(favoriteCollectionsData) { item ->
           //item으로 사용할 Composable 반환
       }
   }
```

### Spacer : padding을 사용하지 않고 빈 공간 만들기

```kotlin
Spacer(Modifier.height(16.dp))
```

### Slot API : 컨테이너 역할을 하는 컴포저블 만들기

```kotlin
@Composable
fun HomeSection(
   @StringRes title: Int,
   modifier: Modifier = Modifier,
   **content: @Composable () -> Unit**
) {
   Column(modifier) {
       Text(stringResource(title))
       content()
   }
}

//사용
HomeSection(...) {/*content에 들어갈 컴포저블*/} //<-후행람다를 사용해 content정의 가능
```

### BottomNavigation : Material을 이용해 하단바 만들기

```kotlin
import androidx.compose.material.BottomNavigation
import androidx.compose.material.BottomNavigationItem

BottomNavigation(
	modifier=modifier,
	backgroundColor = MaterialTheme.colors.background// 배경색 설정(onBackground로 설정됨)
) {
			//하단 버튼1
       BottomNavigationItem(
           icon = {
               Icon(
                   imageVector = Icons.Default.Spa,
                   contentDescription = null
               )
           },
           label = {
               Text(stringResource(R.string.bottom_navigation_home))
           },
           selected = true,
           onClick = {}
       )
			//하단 버튼2
       BottomNavigationItem(
           icon = {
               Icon(
                   imageVector = Icons.Default.AccountCircle,
                   contentDescription = null
               )
           },
           label = {
               Text(stringResource(R.string.bottom_navigation_profile))
           },
           selected = false,
           onClick = {}
       )
   }
```

### Scaffold : Material Design을 구현하는 화면구조

- Scaffold의 사전적 의미는 건축 시 쓰는 가설 발판
- material 디자인을 따른 화면 구조를 정해둔 뼈대느낌 (이름을 잘 지은 것 같다!)
- Scaffold를 뼈대라고 생각하고 각 구역에 적절한 요소를 넣으면 머티리얼 디자인 완성!
- 근데 혼자 써본 바로는 머티리얼 3에서는 아직 개선 중인 듯 하다!

```kotlin
@Composable
fun ***App() {
   ***Theme {
       Scaffold(
						// 만든 네비게이션 바를 넣어주면머티리얼 디자인에서 bottombar구역으로 지정한 곳에 적용되는 느낌!
           bottomBar = { SootheBottomNavigation() } 
       ) { padding ->
					//여기는 메인 화면이 들어감
					//padding은 머티리얼 디자인의 각 화면요소로 줄어든 메인 화면 영역을 반영한거라서 아래처럼 padding에 넣어줘야 메인화면과 다른 요소가 겹치지 않는다!
           HomeScreen(Modifier.padding(padding))
       }
   }
}
```

<br>

## 🎸 기타

### 문자열을 대문자로 변환하기

```kotlin
String.upperCase(Locale.getDefault())
```

<br>

## 🤔 이번 코드랩에서 든 생각

- 일반적으로 매개변수로 전달된 modifier는 가장 바깥의 컨테이너가 되는 컴포저블에 전달해야하는것같다.
- 매개변수로 문자열 리소스 등을 전달할 때는 String이 아닌 id(Int)로 전달하는것 같다.
- 컴포저블 UI 구조를 설계할 때 만들 때 가장 작은 UI 단위, 반복되는 부분으로 뜯어서 반복작업을 최소화한다.