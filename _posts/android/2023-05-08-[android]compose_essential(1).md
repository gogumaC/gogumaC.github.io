---
title: "[android] Compose 기본사항(1) 정리"
categories: 안드로이드 jetpackCompose
excerpt : " Compose 기본사항(1) : Jetpack Compose 시작 튜토리얼"
tags:
    - [android, JetpackCompose, compose, tutorial]
date : 2023-05-08
last_modified_at: 2023-05-08
toc : ture
toc_sticky : true
---
요즘 일을 너무 많이 벌려놓고 목표를 너무 거창하게 잡았는지 머리가 복잡해서 결국 성과가 거의 없었다.🥲

나는 약간 목표를 잘 쪼게야 영차영차 하는 타입인데 요 근래에는 이걸 잘 못한것같아서 반성하고 다시 새로운 마음으로 또 열심히 공부를 해보기로 했다! 

원래 hilt를 먼저 공부하고싶었는데 지금 만들고 있는 프로젝트를 jetpackCompose를 통해 빠르게 만들어서 이걸 먼저 공부하기로 했다.
여기에는 안드로이드 공식 문서에서 제공하는 compose커리큘럼을 따라서 copose를 공부한 기록을 남겨보도록한다!


[Android Compose 튜토리얼 - Android Developers](https://developer.android.com/jetpack/compose/tutorial?hl=ko&continue=https://developer.android.com/courses/pathways/jetpack-compose-for-android-developers-1?hl=ko#article-https://developer.android.com/jetpack/compose/tutorial)

## Jetpack Compose

- 네이티브 안드로이드 UI빌드를 위한 최신 도구키트
- 선언형 UI : Composable함수를 호출해 원하는 요소를 정의→Kotlin컴파일러 플러그인(문법검사, 코드 최적화 , 관련 코드 생성)→Compose컴파일러가 UI빌드
- XML레이아웃 수정X , Layout Editor 사용X

### 〰️ 장점

- 더 적은수의 코드
- 강력한 도구
- Kotlin API 사용

→ Android에서 UI개발을 간소화하고 가속화

## Composable Function

- 앱 모양을 설명, 데이터 종속항목을 제공 → 프로그래매틱 방식으로 앱의 UI정의
    - 프로그래매틱 방식 : 코드를 통해 UI를 생성하고 관리하는 방법
- 함수에 `@Composable`  추가로 정의 가능
- Composable Function은 Composable Fucntion에서만 호출 가능

### 〰️ Composable 함수 정의

```kotlin
//...
import androidx.compose.material.setContent
import androidx.compose.material.Text
import androidx.compose.runtime.Composable

class MainActivity : ComponentActivity(){
	override fun onCreate(savedInstanceState : Bundle?){
		super.onCreate(savedInstanceState)
		setContent {
			MessageCard("Android")
		}
	}
}

@Composable
fun MessageCard(name:String){
	Text(text="Hello $name")
}

@Preview
fun PreviewMessageCard(){
	MessageCard("Android")
}
```

- `setContent` : Composable함수가 호출되는 액티비티의 레이아웃 정의
- `Text()`: 텍스트 요소 정의
- ***매개변수가 없는 Composable 함수***는 `@Preivew` 어노테이션을 통해 미리보기 가능 (상단 새로고침 버튼으로 업데이트)

## 레이아웃

- 여러 Composable함수를 그냥 호출시 겹쳐서 나오게 됨

### 〰️ 요소 정렬 방향 설정 : Column, Row, Box

```kotlin
// ...
import androidx.compose.foundation.layout.Column

//...

@Composable
fun MessageCard(msg: Message) {
    Text(text = msg.author)
    Text(text = msg.body)
} // 두 텍스트가 겹쳐서 나옴

@Composable
fun MessageCard(msg: Message) {
    Column {
        Text(text = msg.author)
        Text(text = msg.body)
    }
}//두 텍스트가 두줄에 걸쳐 출력됨.
```

| Composable | 정렬 방향 |
| --- | --- |
| Column | 수직(↕️) |
| Row | 수평(↔️) |
| Box | 겹침(📑) |

### 〰️ 이미지 추가 : ResourceManager, Image

```kotlin
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Row
import androidx.compose.ui.res.painterResource

@Composable
fun MessageCard(msg: Message) {
    Row {
        Image(
            painter = painterResource(R.drawable.profile_picture),
            contentDescription = "Contact profile picture",
        )
    
       Column {
            Text(text = msg.author)
            Text(text = msg.body)
        }
  
    }
  
}
```

- Image
    - painter : 넣을 이미지 리소스
    - contentDescription : 이미지 설명
- ResourceManager를 사용하여 사진 라이브러리에서 이미지를 가져올 수도 있음

### 〰️ Composable 요소 수정 및 기능 추가 : compose Modifier

```kotlin
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp

@Composable
fun MessageCard(msg: Message) {
    // Add padding around our message
    Row(modifier = Modifier.padding(all = 8.dp)) {
        Image(
            painter = painterResource(R.drawable.profile_picture),
            contentDescription = "Contact profile picture",
            modifier = Modifier
                // Set image size to 40 dp
                .size(40.dp)
                // Clip image to be shaped as a circle
                .clip(CircleShape)
        )

        // Add a horizontal space between the image and the column
        Spacer(modifier = Modifier.width(8.dp))

        Column {
            Text(text = msg.author)
            // Add a vertical space between the author and message texts
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = msg.body)
        }
    }
}
```

- Modifier기능
    - 크기, 레이아웃, 모양 변경
    - 클릭 등 상호작용 추가가능
    - 복잡한 컴포저블 생성가능
- Spacer() :  빈 공간을 생성
- Modifier.
    - padding() : 각 방향 별 패딩 설정가능
    - size() : 요소 크기 설정가능
    - clip() : 요소 모양 변경 가능
    - width() : 가로길이지정
    - height() : 세로길이 지정
    - border(): 테두리 지정

## Material Design

- compose는 Material design 원칙을 지원하도록 빌드됨

### 〰️ 테마 사용

```kotlin
// ...

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ComposeTutorialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    MessageCard(Message("Android", "Jetpack Compose"))
                }
            }
        }
    }
}

@Preview
@Composable
fun PreviewMessageCard() {
    ComposeTutorialTheme {
        Surface {
            MessageCard(
                msg = Message("Colleague", "Take a look at Jetpack Compose, it's great!")
            )
        }
    }
}
```

- `프로젝트이름Theme` : Empty Compose Activity 템플릿이 자동으로 생성한 프로젝트의 기본테마(ui.theme→Theme.kt에서 찾을 수 있음)
- Surface() : 요소를 감싸는 컨테이너 역할

### 〰️ Material Design 핵심 요소1 : Color

- MaterialTheme.colors로 래핑된 테마의 색상으로 스타일 지정가능
- 이미지에 색 있는 테두리 추가
    
    ```kotlin
    Image(
          painter = painterResource(R.drawable.profile_picture),
          contentDescription = null,
          modifier = Modifier
                   .size(40.dp)
                   .clip(CircleShape)
                   .border(1.5.dp, MaterialTheme.colors.secondary, CircleShape)
    )
    ```
    
- 텍스트에 색 추가
    
    ```kotlin
    Text(
         text = msg.author,
         color = MaterialTheme.colors.secondaryVariant
    )
    ```
    

### 〰️ Material Design 핵심 요소2 : Typography(서체)

- MaterialTheme.typography로 Text의 속성 수정 가능
- Text Composable에 추가하여 사용

```kotlin
Text(
     text = msg.author,
     color = MaterialTheme.colors.secondaryVariant,
     style = MaterialTheme.typography.subtitle2
)

Text(
     text = msg.body,
     style = MaterialTheme.typography.body2
)
```

### 〰️ Material Design 핵심 요소3 : Shape

- MaterialTheme.shape로 효과? 같은거 추가가능

```kotlin
Surface(shape = MaterialTheme.shapes.medium, elevation = 1.dp) {
        Text(
            text = msg.body,
            modifier = Modifier.padding(all = 4.dp),
            style = MaterialTheme.typography.body2
         )
 }
```

### 〰️ 어두운 테마 사용

- Jetpack Compose는 Material Design을 지원하므로 어두운 테마 처리가능
- Material Design을 사용하면 다크모드에서 자동으로 어둡게 조정됨
- Preview로 라이트모드와 다크 모드를 볼 수 있음
    
    ```kotlin
    // ...
    import android.content.res.Configuration
    
    @Preview(name = "Light Mode")
    @Preview(
        uiMode = Configuration.UI_MODE_NIGHT_YES,
        showBackground = true,
        name = "Dark Mode"
    )
    @Composable
    fun PreviewMessageCard() {...}
    ```
    

## 목록 및 애니메이션

### 〰️ 목록 만들기 : LazyColumn, LazyRow

- 화면에 표시되는 요소만 렌더링 → 긴 목록에 효율적임
- 약간 리사이클러뷰랑 비슷한 용도

| Composable | 스크롤 방향 |
| --- | --- |
| LazyColumn | 수직(↕️) |
| LazyRow | 수평(↔️) |

```kotlin
// ...
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items

@Composable
fun Conversation(messages: List<Message>) {
    LazyColumn {
        items(messages) { message ->
            MessageCard(message)
        }
    }
}

@Preview
@Composable
fun PreviewConversation() {
    ComposeTutorialTheme {
        Conversation(SampleData.conversationSample)
    }
}
```

### 〰️ 애니메이션 적용

- remember : 메모리에 로컬 상태저장, mutalbeStateOf에 전달된 값의 변경사항 추적
- mutableStateOf : 변경할 값 전달
- 재구성 : rememver, mutalbeStateOf를 통해 바뀌는 상태에 따라 이 상태를 사용하는 컴포저블 및 하위 요소가 다시 그려지는 것.
- Modifier.clickable : 클릭 이벤트 정의
- animateColorAsState : 상태변화에 따른 색상변화에 애니메이션 적용
- animateContentSize :요소의 사이즈를 점진적 애니메이션과 함께 변화.

```kotlin
// ...
import androidx.compose.foundation.clickable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue

//...

@Composable
fun MessageCard(msg: Message) {
    Row(modifier = Modifier.padding(all = 8.dp)) {
        //...
        // 메시지가 확장됬는지 아닌지 추적
        // variable
        var isExpanded by remember { mutableStateOf(false) }
				
				//상태에 따라 색상값 변화 + 애니매이션 적용
				val surfaceColor by animateColorAsState(
            if (isExpanded) MaterialTheme.colors.primary else MaterialTheme.colors.surface,
        )
        // modifier를 통해 클릭이벤트를 정의 -> isExpanded를 toggle
        Column(modifier = Modifier.clickable { isExpanded = !isExpanded }) {
            Text(
                text = msg.author,
                color = MaterialTheme.colors.secondaryVariant,
                style = MaterialTheme.typography.subtitle2
            )

         //...
            Surface(
                shape = MaterialTheme.shapes.medium,
                elevation = 1.dp,
                color = surfaceColor,
                // 요소의 사이즈를 점진적 애니메이션과 함께 변화시킴
                modifier = Modifier.animateContentSize().padding(1.dp)
            ) {
                Text(
                    text = msg.body,
                    modifier = Modifier.padding(all = 4.dp),
                    // 메시지가 확장기능 구현 -> isExpanded가 true가 되면 maxLines를 Int.MAX_VALUE로 변경
								    //isExpanded의 변화는 추적되므로 isExpanded가 수정되면 컴포저블 및 하위요소는 자동으로 재구성됨.
                    maxLines = if (isExpanded) Int.MAX_VALUE else 1,
                    style = MaterialTheme.typography.body2
                )
            }
        }
    }
}
```
