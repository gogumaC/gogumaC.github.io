---
title: "@JvmName으로 JVM Signiture 타입소거 관련 오버로딩 이슈 해결"
categories: android troubleshooting
tags:
    - [android, JetpackCompose, compose, annotation, "@jvmName", overloading]
date : 2024-02-19 22:00
last_modified_at: 2024-02-19 22:00
toc : ture
toc_sticky : true
---

컴포즈로 UI를 만들다가 특정 매개변수를 인스턴스화 하지 못해서 프리뷰로 사용하기 어려워졌다.
이를 해결하기 위해서 더미 데이터를 만들 수 없는 해당 매개 변수 부분을 문자열 매개변수로 바꾸는 래핑 컴포저블을 아래와 같이 만들었다.

```kotlin
@Composable
fun PairedDeviceDialog(onDismissRequest:()->Unit,deviceList:List<BluetoothDevice>,modifier: Modifier=Modifier){
    PairedDeviceDialog(onDismissRequest = onDismissRequest, deviceNameList = deviceList.map{it.name})
}

@Composable
fun PairedDeviceDialog(onDismissRequest:()->Unit,deviceNameList:List<String>,modifier: Modifier=Modifier){
    Dialog(onDismissRequest = onDismissRequest){
        Card(
            modifier= modifier
                .fillMaxWidth()
                .height(200.dp)
                .padding(16.dp),
            shape= RoundedCornerShape(16.dp)
        ){
            LazyColumn(){
                items(deviceNameList){item->
                    BluetoothDeviceInfoUnit(deviceName = item)
                }
            }
        }
    }
}
```

그리고 아래와 같은 오류 메시지를 받았다.

> e: file:///Users/yubin/Desktop/projects/bluetooth-chat/app/src/main/java/kr/co/teamfresh/kyb/bluetoothchat/ChatScreen.kt:69:1 Platform declaration clash: The following declarations have the same JVM signature (PairedDeviceDialog(Lkotlin/jvm/functions/Function0;Ljava/util/List;Landroidx/compose/ui/Modifier;Landroidx/compose/runtime/Composer;II)V):
    fun PairedDeviceDialog(onDismissRequest: () -> Unit, deviceList: List<BluetoothDevice>, modifier: Modifier?, `$composer`: Composer?, `$changed`: Int, `$default`: Int): Unit defined in kr.co.teamfresh.kyb.bluetoothchat
    fun PairedDeviceDialog(onDismissRequest: () -> Unit, deviceNameList: List<String>, modifier: Modifier?, `$composer`: Composer?, `$changed`: Int, `$default`: Int): Unit defined in kr.co.teamfresh.kyb.bluetoothchat


요는 '컴파일을 하다보니 이거 두개 함수 시그니처가 같아서 빌드 못해' 느낌이다. 

다시한번 확인하니 뭔가 눈에 걸리는 부분이 있었다.

```kotlin
fun PairedDeviceDialog(onDismissRequest:()->Unit,deviceList:List<BluetoothDevice>,modifier: Modifier=Modifier)

fun PairedDeviceDialog(onDismissRequest:()->Unit,deviceNameList:List<String>,modifier: Modifier=Modifier){
    Dialog(onDismissRequest = onDismissRequest)
```

List\<BluetoothDevice>와 List\<String> 이 과연 다른 타입으로 인식 될까?

### 시그니처

오랜만에 보다보니 복습할겸, 함수 오버로딩을 위해서 만들어진 함수는 시그니처가 달라야한다.
메서드 시그니처는 함수이름, 매개변수 타입으로 결정된다. (반환값은 관계없음에 주의하자.)

그러니까 위에서 던진 질문은 List\<BluetoothDevice>와 List\<String>가 같은 타입으로 인식되어서 같은 시그니처를 가진 함수가 되어버리지 않았을까 하는 의미였다.

오류 메시지를 다시보면

### Type erasure(타입 소거) : 왜 두 타입을 같다고 판단했을까

여기서 사용되는 JVM시그니처는 타입 소거 모델을 사용해 제네릭을 구현한다.

*타입소거*란 제네릭 타입에 사용된 타입정보를 컴파일 타임에만 사용하고 런타임에는 제거하는것이다.

이게 있는 이유는 제네릭이라는 기술이 자바 1.5부터 도입되었는데, 이러다보니 자바 1.5 미만 코드의 호환성을 위해  '타입소거'로 런타임에서 제네릭을 제거하게 되었다.

따라서 두 변수 List\<BluetoothDevice>와 List\<Stirng>의 제네릭 타입이 다르지만 함수 시그니처가 같았던 이유는, 컴파일 시점에서는 두 변수가 서로 다른 타입으로 인식되지만 런타임에서는 제네릭 타입이 소거되어 단순히 List로 인식되므로 두 타입은 JVM시그니처에서 구분되지 않기 때문이었다.

## 해결법 : @JvmName

나는 @JvmName 어노테이션을 사용하여 함수의 JVM 시그니처를 변경하여 이를 해결하였다.

```kotlin
@JvmName("PairedDeviceDialog")
@Composable
fun PairedDeviceDialog(onDismissRequest:()->Unit,deviceList:List<BluetoothDevice>,modifier: Modifier=Modifier){
    PairedDeviceDialog(onDismissRequest = onDismissRequest, deviceNameList = deviceList.map{it.name})
}

@JvmName("PairedDeviceDialogWithString")
@Composable
fun PairedDeviceDialog(onDismissRequest:()->Unit,deviceNameList:List<String>,modifier: Modifier=Modifier){
    Dialog(onDismissRequest = onDismissRequest){
        Card(
            modifier= modifier
                .fillMaxWidth()
                .height(500.dp)
                .padding(16.dp),
            shape= RoundedCornerShape(16.dp)
        ){
            IconButton(onClick = {},modifier=Modifier.align(Alignment.End)){
                Icon(imageVector = Icons.Filled.Add, contentDescription = null)
            }
            LazyColumn(verticalArrangement=Arrangement.spacedBy(8.dp)){
                items(deviceNameList){item->
                    BluetoothDeviceInfoUnit(deviceName = item,modifier= Modifier
                        .fillMaxWidth()
                        .height(50.dp))
                }
            }
        }
    }
}
```


---

### ref

https://stackoverflow.com/questions/60959027/issue-with-function-overloading-in-kotlin

https://devlog-wjdrbs96.tistory.com/263

https://inpa.tistory.com/entry/JAVA-%E2%98%95-%EC%A0%9C%EB%84%A4%EB%A6%AD-%ED%83%80%EC%9E%85-%EC%86%8C%EA%B1%B0-%EC%BB%B4%ED%8C%8C%EC%9D%BC-%EA%B3%BC%EC%A0%95-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0
