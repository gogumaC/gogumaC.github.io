---
title: "[android] Compose로 그리기 기능 만들기"
categories: android jetpackCompose
excerpt : "Canvas, Path, Paint의 개념 및 그리기 기능 구현"
tags:
    - [android, JetpackCompose, compose, draw, canvas,DrawingModifier,DrawingScope, path, paint,]
date : 2023-12-09 
last_modified_at: 2023-12-09 
toc : ture
toc_sticky : true
header:
  overlay_filter: linear-gradient(rgba(0, 0, 0, 0.5), rgba(217, 217, 217, 0.5))
  image: /assets/image/projects/linkedin-auto-posting/overview.png
---

링크드인 자동 포스팅 작업이 거의 끝나가다보니 요즘은 또 새로운 프로젝트에 꽂혀있다.

이번에는 안드로이드 앱과 jetbrain플러그인 개발을 계획 중인데 일단 익숙한 안드로이드 프로젝트를 먼저 만들면 좋겠다 싶어서 관련 내용을 공부 중이다.

오늘은 그 중 compose로 그림판 같이 그리기 기능을 구현해보았다.

view로는 이런 기능을 구현해 보았는데 컴포즈로는 처음이라서 과정을 기록해둘 목적으로 작성하는 포스팅이다.

# Drawing 4 Basic Component

안드로이드에서 무언가를 그릴때는 4가지 기본 컴포넌트가 필요하다.

1. Bitmap
    - 픽셀을 가지고 있는 비트맵
2. Canvas
    - draw를 호출하는 주체
3. drawing primitive (Rect, Path, text, Bitmap ...)
    - 그리기 자료형
4. paint
    - 그려지는 객체의 색과 스타일을 정의

컴포즈에서도 내부적으로는 뷰 기반 UI의 Canvas와 기타 관련 객체를 사용한다.

다만 뷰 기반 드로잉과의 차이점은 선언형으로 드로잉을 정의하며 기존보다 단순하게 그리기 작업이 가능해졌다.

이 중 Bitmap은 이 포스팅에서는 다루지 않고, 나머지 3가지에 대해 공부해보았다.

# [Canvas](https://developer.android.com/jetpack/compose/graphics/graphics-sub?hl=ko)

위에서 Compose는 뷰 기반 Canvas를 사용한다고 했지만 정확히는 Compose Canvas라는 객체를 사용하고 이 객체가 뷰기반 [Canvas](https://developer.android.com/reference/android/graphics/Canvas)를 만들고 관리한다.

우리는 이 Compose Canvas를 두가지 방법으로 접근하여 수정할 수 있다.

첫번째 방법은 **Drawing Modifer와 DrawScope**를 이용하는 것이고, 두번째는 **직접 Canvas객체에 접근**하는 것이다.

## [Drawing Modifier](https://developer.android.com/jetpack/compose/graphics/draw/modifiers#drawbehind)

compose에서 모든 drawing작업은 drawing modifer를 통해 실행된다.

아래는 Compose의 세가지 주요 drawing modifier이다.

- `Modifier.drawWithContent`(default) : 컴포저블 콘텐츠의 앞 또는 뒤에 그리기 작업가능 

- `Modifier.drawBehind` : 컴포저블 콘텐츠 뒤에 그리기 작업

- `Modifier.drawWithCache` : 컴포저블에 그리기 작업 및 내부의 객체를 캐시된 상태로 유지

우리는 이러한 modifier를 사용하여 컴포저블에 그리기 작업을 할 수 있다.

### `@Composable Canvas`

그렇다면 drawing작업을 빈 영역에 하고 싶다면 어떤 방법을 사용해야할까?

직관적으로 생각해보면 빈 영역을 정의하는 Spacer컴포저블에 drawing modifier를 적용하면 될 것 같고 실제로도 그렇다.

그리고 그런 일련의 작업을 하나의 컴포저블로 만든것이 **@Composable Canvas**이다.

아래는 Canvas 컴포저블의 내부 코드이다.

```kotlin
@Composable
fun Canvas(modifier: Modifier, contentDescription: String, onDraw: DrawScope.() -> Unit) =
    Spacer(modifier.drawBehind(onDraw).semantics { this.contentDescription = contentDescription })
```
[공식 문서](https://developer.android.com/jetpack/compose/graphics/draw/overview?hl=ko)에 따르면 Canvas composable은 `Modifer.drawBehind`의 편리한 wrapper라고 언급하고 있다.

앞서 말했다싶이 실제로 위 코드에서도 Canvas 컴포저블 함수는 리턴 시 Spacer로 할당한 빈 공간에 `modifier.drawBehind(onDraw)`를 넘겨주어 onDraw에 정의된 그리기 작업을 진행하는 것을 확인할 수 있다.

***결론을 말하자면 빈 공간에 그리기 작업만 필요할 경우 Canvas 컴포저블 함수를 사용하면 유용하다.***

\+ ) 참고로 Canvas Composable은 어떤 방법으로든 반드시 size를 명시해주어야한다.

### [DrawScope](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/drawscope/DrawScope?hl=ko)

바로 위 코드에서 Canvas 컴포저블 함수의 매개 변수 중 하나인 `onDraw: DrawScope.() -> Unit`를 살펴보자.

위 형식을 보면 onDraw는 `DrawScope`의 `()->Unit` 형태의 확장함수이다.

따라서 onDraw의 람다 scope안에서 DrawScope의 메서드와 프로퍼티에 접근할 수 있고 이를 활용해 그리기 작업을 정의할 수 있다.

이는 drawBehind()함수로 전달되며 drawing modifier의 매개변수로 넘겨짐을 알 수 있다.

그렇다면 DrawScope라는 것은 무엇일까?

DrawScope는 해당 Canvas에 그리기를 할 수 있는 스코프를 만들어주는 하나의 interface이다.

아래 코드에서 처럼 Canvas에 그리기 환경을 제공하기 위해 drawLine, drawRect 등 다양한 그리기 함수들을 가지고 있으며 drawContext를 통해 center, size 등 유용한 프로퍼티에 접근할 수 있다.

 ```kotlin
@DrawScopeMarker
@JvmDefaultWithCompatibility
interface DrawScope : Density {

    val drawContext: DrawContext

    val center: Offset
        get() = drawContext.size.center

    val size: Size
        get() = drawContext.size

    val layoutDirection: LayoutDirection

     fun drawLine(
        brush: Brush,
        start: Offset,
        end: Offset,
        strokeWidth: Float = Stroke.HairlineWidth,
        cap: StrokeCap = Stroke.DefaultCap,
        pathEffect: PathEffect? = null,
        /*FloatRange(from = 0.0, to = 1.0)*/
        alpha: Float = 1.0f,
        colorFilter: ColorFilter? = null,
        blendMode: BlendMode = DefaultBlendMode
    )

    //...
}
 ```

 정리하자면 DrawScope는 그리기에 사용되는 함수와 유용한 프로퍼티를 제공하며 이를 이용한 그리기 작업을 정의하는 영역이라고 볼 수 있다.

 **DrawScope의 그리기 관련 함수**

- `drawLine`
- `drawRect`
- `drawCircle`
- `drawImage`
- `drawPath`
- [`drawText`](https://developer.android.com/jetpack/compose/graphics/draw/overview?hl=ko#measure-text) 
- 등등

**DrawScope의 변환 관련 함수**
: 해당 함수의 스코프 내부 그리기 작업에 적용됨

- `inset` : 작업의 경계를 변경
- `rotate` : 작업을 회전
- `scale` : 작업 크기를 배율로 늘린다.
- `translate` : 작업 위치 변경
- `withTransform` : 위 여러개의 변환을 함께 적용

이 중 `withTransform`을 쓰지 않고 이동과 회전작업을 동시에 구현한다면 아래와 같을 것이다.

```kotlin
translate(left = size.width / 5F){
    rotate(degrees = 45F){
        drawRect(
        color = Color.Gray,
        topLeft = Offset(x = size.width / 3F, y = size.height / 3F),
        size = size / 3F
        )
    }
}
```

그러나 이런경우 `translate`와 `roate`작업이 개별적으로 실행되며 두번의 계산이 실행된다.

하지만 `withTransform()`을 사용하면 위 `translate`와 `rotate`를 하나의 단일 작업으로 변환하여 한번의 계산만 하므로 더 효율적이다.

아래는 `withTransform()`을 사용한 코드이다.

```kotlin
Canvas(modifier = Modifier.fillMaxSize()) {
    withTransform({
        translate(left = size.width / 5F)
        rotate(degrees = 45F)
    }) {
        drawRect(
            color = Color.Gray,
            topLeft = Offset(x = size.width / 3F, y = size.height / 3F),
            size = size / 3F
        )
    }
}
```

### Offset

DrawScope의 그리기 함수는 대부분 Offset타입의 매개변수를 가진다.

Offset은 해당 그리기에 사용되는 x,y 좌표이다.

(그림)

좌표계는 위 그림처럼 좌측 상단이 (0,0)이고 우측으로 갈수록 x값이 증가하고 아래로 갈수록 y값이 증가한다.

모든 그리기 작업은 픽셀 단위를 사용하므로 Offset또한 픽셀 단위로 지정하여야된다. (모든 해상도에서 일정한 크기로 보여지기 위해서는 .dp.toPx()로 값 설정 권장)

## [직접 Canvas에 접근](https://developer.android.com/jetpack/compose/graphics/draw/overview?hl=ko#accessing-canvas)

여기까지 첫번째 방법에 대해 알아보았다.

두번쨰 방법은 언급했다시피 직접 해당 컴포저블의 Canvas에 접근하는 방법이다.

이 방법 또한 draw modifier를 사용하는것은 같지만 DrawScope의 그리기 함수를 사용하지 않고 캔버스에 직접 접근한다.

DrawScope로는 Canvas객체에 직접 접근할 수 없지만 DrawScope.drawIntoCanvas()를 사용하면 Canvas객체 자체에 액세스 할 수 있다.

```kotlin

val drawable = ShapeDrawable(OvalShape())
Spacer(
    modifier = Modifier
        .drawWithContent { //이 스코프는 DrawScope의 확장함수 이므로 drawIntoCanvas사용가능
            drawIntoCanvas { canvas ->
                drawable.setBounds(0, 0, size.width.toInt(), size.height.toInt())
                drawable.draw(canvas.nativeCanvas)
            }
        }
        .fillMaxSize()
)
```


# Drawing primitive








## 구현

### 1. 컴포저블 함수 선언

당연히 컴포저블 함수를 먼저 만들었다.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.gogumac.playgroundforandroid.ui.theme.PlaygroundForAndroidTheme

@Composable
fun DrawingScreen(modifier:Modifier=Modifier){
}

@Preview(showBackground = true)
@Composable
fun DrawingScreenPreview(){
    PlaygroundForAndroidTheme {
        DrawingScreen()
    }
}
```

하는김에 겸사겸사 프리뷰도 함께 만들었다.

### 2. 상태 정의


---

## 참고

[Compose의 그래픽](https://developer.android.com/jetpack/compose/graphics?hl=ko#drawbehind)

[Canvas](https://developer.android.com/reference/android/graphics/Canvas)

[@Composable Canvas](https://developer.android.com/jetpack/compose/graphics/draw/overview)

[Graphic modifier - drawing modifier](https://developer.android.com/jetpack/compose/graphics/draw/modifiers#drawbehind)


[DrawScope1](https://developer.android.com/jetpack/compose/graphics/graphics-sub?hl=ko#drawscope)

[DrawScope](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/drawscope/DrawScope?hl=ko)




