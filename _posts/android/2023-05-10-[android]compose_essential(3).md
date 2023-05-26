---
title: "[android] Compose 기본사항(3) 정리"
categories: 안드로이드 jetpackCompose
excerpt : "Compose 기본사항(3) : Compose 이해"
tags:
    - [android, JetpackCompose, compose,]
date : 2023-05-10
last_modified_at: 2023-05-10
toc : ture
toc_sticky : true
---
[Thinking In Compose (Compose 이해) 안드로이드 공식 문서](https://developer.android.com/jetpack/compose/mental-model?hl=ko&continue=https%3A%2F%2Fdeveloper.android.com%2Fcourses%2Fpathways%2Fjetpack-compose-for-android-developers-1%3Fhl%3Dko%23article-https%3A%2F%2Fdeveloper.android.com%2Fjetpack%2Fcompose%2Fmental-model)
## 선언형 프로그래밍 패러다임

### 기존의 Android View계층구조

- UI위젯트리로 표현가능
- 데이터가 변화시 UI계층구조를 수동으로 업데이트 ex) findViewById()→button.setText(String)
- 위와같은 방법으로 뷰를 조작시 오류 발생가능성 커짐

### 지난 몇년의 패러다임

- 위와 같은 문제점을 해결하기 위해 선언형 UI모델로 전환
- 이에 따라 UI빌드 및 업데이트와 관련된 작업이 간소화

### 선언형 UI, Compose

- 처음부터 화면 저체를 개념적으로 재생성
- 이후 필요한 변경사항만 적용
- compose : 선언형 UI 프레임워크

## 간단한 Composable함수

- @Composable주석을 통해 함수가 데이터를 UI로 변환하기 위한 함수라는 것을 Compose컴파일러에 알림
- Composable함수는 매개변수로 데이터를 받아 앱 로직을 통해 UI를 생성
- 함수는 아무것도 반환하지 않음.
- 함수는 상태나 값을 변경하지 않으므로 여러번 호출 해도 결과는 항상같음(멱등원) → 따라서 side effect없음 ***(함수 선언시 이 부분을 염두해야함!)***

## 선언형 패러다임 전환

### 명령형 객체 지향 UI tool kit : XML Layout

- 위젯 트리를 인스턴스화 하여 UI 초기화
- 각 위젯은 자체의 내부 상태를 유지함
- 각 위젯은 앱 로직이 위젯과 상호작용할 수 있도록 하는 getter, setter메서드를 노출

### 선언형 UI tool kit : Compose

- stateless상태로 setter,getter함수를 노출하지 않음 → 위젯이 객체로 노출되지 않음
- 동일한 Composable함수를 다른 인수로 호출하여 UI를 업데이트
- 따라서 ViewModel과 같은 아키텍처 패턴에 상태를 쉽게 제공가능
- Composable은 식별가능한 데이터가 업데이트 될때마다 현재 앱 상태를 UI로 변환
    
    <img src="/assets/image/android/230510-android-compose_essential(3)_thinking_in_compose/compose_data_flow.png">
    
- 사용자가 UI와 상호작용할때 이벤트를 앱로직에 전달해 앱상태를 변경하고 상태가 변경되면 Composable함수가 새 데이터와 함께 다시 호출되어 다시 그려짐(재구성)
    
    <img src="/assets/image/android/230510-android-compose_essential(3)_thinking_in_compose/compose_events_flow.png">
    

## 동적 콘텐츠

- Composable함수는 kotlin으로 작성되기 때문에 동적으로 동작가능( 조건문 ,루프 등 코틀린 기능 사용가능)

## 재구성

- 함수의 입력이 되면 Composable함수를 다시 호출하고 함수가 재구성됨
- 필요한 경우 함수에서 내보낸 위젯이 새 데이터로 다시 그려짐
- Compose프레임워크는 변경된 구성요소만 재구성

### 재구성 과정

1. 함수의 입력이 변경됨
2. Compose가 새 입력을 기반으로 변경되었을 수 있는 함수나 람다만 다시 호출(매개변수가 변경되지 않은 함수와 람다는 건너뜀)

### 주의사항

- 매개변수가 변경되지 않은 함수는 재구성하지 않으므로 함수에 사이드 이펙트를 넣어서 이 사이드 이펙트를 의지하면 안됨 → side effect 사용시에는 콜백에서 트리거 하는 방식으로 사용해야함
- 위험한 side effect 예시
    - 공유 객체의 속성에 쓰기
    - viewModel에서 식별 가능한 요소 업데이트
    - 공유환경설정 업데이트 ex) sharedPreference

### 공유 환경 설정 업데이트

- 애니메이션이 렌더링 될때같이 모든 프레임에서와 같은 빈도로 재실행 될 수 있음 (애니메이션도중 버벅임을 방지하기 위해서)
- 따라서 비용이 많이드는 작업(공유 환경설정에서 읽기 등)을 실행하려면 백그라운드에서 작업을 실행 후 Composable함수에 매개변수로 전달

```kotlin
@Composable
fun SharedPrefsToggle( // 컴포저블을 생성해서 SharedPreferences값을 업데이트
    text: String,
    value: Boolean,
    onValueChanged: (Boolean) -> Unit //컴포저블은 SharedPreferences에 읽거나 쓰지 말아야 하므로 백그라운드 코루틴의 ViewModel로 읽기 및 쓰기를 이동
) {
    Row {
        Text(text)
        Checkbox(checked = value, onCheckedChange = onValueChanged)//콜백으로 현재 값을 전달해 업데이트를 트리거(업데이트는 컴포저블이 아닌 코루틴의 ViewModel에서 이루어짐)
    }
}
```

### Composable함수 특징

- ***순서와 관계없이 실행가능***
    - Compose에는 일부 UI요소가 다른 요소보다 우선순위가 높다는 것을 인식하고 그 요소를 먼저 그리는 옵션이 있음
    - 따라서 어떤 함수의 side effect를 다른 함수에서 활용할수 없음
    - 따라서 각 함수는 독립적이어야함
- ***동시에 실행가능***
    - 재구성을 최적화 할수 있음
    - Compose는 다중코어를 활용하여 화면에 없는 Coposable함수를 낮은 우선순위로 실행하여 재구성최적화 가능 → Composable함수는 백그라운드 스레드 풀에서 실행될 수 있음
    - 따라서  composable함수가 ViewModel에서 함수를 호출하면 Compose는 동시에 여러 스레드에서 이 함수를 호출 가능
    - composable함수가 호출될때 다른 스레드에서 호출이 발생할 수 있으므로 composable함수의 변수를 수정하는 코드는 스레드로부터 안전하지 않고 허용되지 않는 side effect가 있을 수 있으므로 피해야한다.
        
        ```kotlin
        @Composable
        fun ListComposable(myList: List<String>) {
            Row(horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    for (item in myList) {//매개변수인 myList를 직접 사용하므로 thread safe하지 않음. 
                        Text("Item: $item")
                    }
                }
                Text("Count: ${myList.size}")
            }
        }
        ```
        
        ```kotlin
        @Composable
        @Deprecated("Example with bug")
        fun ListWithBug(myList: List<String>) {
            var items = 0
        
            Row(horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    for (item in myList) {
                        Text("Item: $item")
                        items++ // Avoid! Side-effect of the column recomposing.
                    }// side effect로 재구성이 이루어질때마다 item이 수정됨!
                }
                Text("Count: $items")
            }
        }
        ```
        
- ***재구성은 최대한 많은 수의 컴포저블 함수와 람다를 건너뜀***
    - Compose는 UI트리에 있는 전체 컴포저블이 아닌 단일 컴포저블을 재구성 할 수 있다.
    
    ```kotlin
    @Composable
    fun NamePicker(
        header: String,
        names: List<String>,
        onNameClicked: (String) -> Unit
    ) {
        Column {
            // header가 변경될때 recompose됨, name이 변경될때는 recompose안됌
            Text(header, style = MaterialTheme.typography.h5)
            Divider()
    				//LazyColumn은 리사이클러뷰의 컴포즈 버전느낌
            LazyColumn {
    						//items()에 전달된 람다는 리사이클러뷰의 뷰홀더와 유사
                items(names) { name ->
                    // item의 name이 변경될때, item의 어댑터도 recompose됨
                    // header가 변경될때는 recompse되지 않음
                    NamePickerItem(name, onNameClicked)
                }
            }
        }
    }
    
    ```
    
- ***재구성은 낙관적이며 취소될 수 있음***
    - Compose는 Composable의 매개변수가 변경되었을 수 있다고 생각할때마다 재구성함.
    - 재구성은 낙관적임 : Compose는 매개 변수가 다시 변경되기 전에 재구성을 완료할것으로 예상
    - 재구성은 취소될 수 있음 : 재구성이 완료되기 전에 매개변수가 변경되면 Compose는 재구성을 취소 후 새 매개변수로 다시 재구성 할 수 있음
- ***매우 자주 실행 될 수 있음***
    - 경우에 따라 Composable함수는 UI 애니메이션의 모든 프레임에서 실행될 수 있음
    - 위에 언급했다시피 비용이 많이 드는 작업을 하면 UI버벅임이 발생할 수 있고 앱 성능에 치명적 영향을 줄 수 있음
    - 비용이 많이 드는 작업은 백그라운드 스레드에서 진행 후 mutableStateOf, LiveData를 통해 Compose로 전달하는게 좋음.

❗위 특징을 잘 활용하기 위해 Composable함수는 항상 멱등원이어야하며 side effect가 없어야 한다!!