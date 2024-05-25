```kotlin
val itemModifier=Modifier()
if(a==10) itemModifier.background(color=Color.Black)
```

이 코드는 작동하지 않는다
왜냐면 modifier에 체이닝된 저 함수는 새로운 모디파이어를 만들어 반환하기 때문에 itemModifeir와는 다른 모디파이어를 반환하게 되고 itemModifeir에는 영향을 주지 않는다.

따라서 이 코드를 작동하게 하고 싶다면
```kotlin
val itemModifier=if(a==10)Modifier.back... else Modifier
```
이런식으로 사용해야한다.