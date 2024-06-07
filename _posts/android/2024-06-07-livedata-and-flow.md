---
title: "LiveData vs Flow"
categories: android
tags:
    - [android, LiveData, Flow, livedata, flow]
date : 2024-06-07 17:30
last_modified_at: 2024-06-07 17:30
toc : ture
toc_sticky : true
---

소프티어 부트캠프 할 때 안드로이드 스터디에서 flow를 공부했던게 생각났는데 노션에만 두기 아까워서 포스팅한다.

+) 원래는 라이브데이터 항목이 먼저였는데, 플로우로 전향하는 추세인것 같아서 플로우를 맨 앞으로 옮겼다.

## 🌊Coroutine Flow

- 비동기 작업 가능한 데이터 스트림
- 내보낸 값은 동일한 유형이여야한다. `Flow<T>`
- suspend함수를 사용해 값을 비동기적으로 생산 및 사용
- `coldStream` : 구독자 있을때만 데이터 생성하고 여러 구독자에게 독립적으로 데이터 전달

### `suspend function` vs `flow`

- suspend함수는 단일 값만 반환 가능
- flow는 여러값을 순차적으로 내보낼 수 있음! → 약간 stream느낌!

### 데이터 스트림

![](/assets/image/2024-06-07-17-36-44.png)

- 생산자(Producer) : 스트림에 추가되는 데이터 생산 → 일반적으로 ui데이터 생산자
- 중개자(Intermediary)(optional) : 스트림이 내보내는 값이나 스트림 자체를 수정가능
- 소비자(Consumer) : 스트림 값을 사용 → 일반적으로 사용자 UI

→ 반대의 경우로 사용자 UI가 생산자가 되는 경우도 있음

### Flow 사용

#### 생성

- `flow{..}` : FlowBuilder API사용, 코루틴 내에서 실행
- `emit()` : 새 flow 생성
- `delay(ms)` : 일시정지

```kotlin
val latestNews: Flow<List<ArticleHeadline>> = flow {
        while(true) {
            val latestNews = newsApi.fetchLatestNews()
            emit(latestNews) // 새 데이터 flow방출
            delay(5000) // 일시중지
        }
    }
```

→ flow빌더는 코루틴 내에서 실행되서 동일한 비동기 제약사항

1. 순차적인 흐름
2. 생산자가 다른 CoroutineContext값을 emit불가→ 새로 코루틴 만들면 안됨! → 이경우 `callbackFlow`사용가능

#### 스트림 수정(중간연산자)

- 스트림 값을 소비하지 않고 데이터 스트림 수정
- `map` : 값 변환
    
    ```kotlin
    flowOf(1, 2, 3)
        .map { it * 2 }
        .collect { println(it) }  // 출력: 2, 4, 6
    ```
    
- `filter` : 값 필터링
    
    ```kotlin
    flowOf(1, 2, 3, 4)
        .filter { it % 2 == 0 }
        .collect { println(it) }  // 출력: 2, 4
    ```
    
- `transform` : map보다 더 유연한 변환 수행가능, 값 방출, 필터링, 예외발생가능
    
    ```kotlin
    flowOf(1, 2, 3)
        .transform { value ->
            if (value == 2) {
                emit(-1)
            } else {
                emit(value)
            }
        }
        .collect { println(it) }  // 출력: 1, -1, 3
    ```
    

#### 데이터 소비(터미널 연산자)

- `collect` : flow에서 발생하는 각 데이터 소비 및 각 요소에 대해 액션 수행
    
    ```kotlin
    flowOf(1, 2, 3)
        .collect { println(it) }  // 출력: 1, 2, 3
    ```
    
- `toList` : 방출되는 모든 요소를 리스트에 수집
    
    ```kotlin
    val result: List<Int> = flowOf(1, 2, 3).toList()
    println(result)  // 출력: [1, 2, 3]
    ```
    
- `reduce` : 방출되는 요소를 정의된 함수를 통해 하나의 값으로 줄임, 순차적으로 결합
    
    ```kotlin
    val result: Int = flowOf(1, 2, 3).reduce { acc, value -> acc + value }
    println(result)  // 출력: 6
    ```
    

#### 예외 처리

- `catch` : 예외처리 블록 제공, 에러 로그, 대체값 방출 가능
    
    ```kotlin
    flow {
        emit(1)
        throw RuntimeException()
    }
    .catch { e -> println("Caught exception: $e") }
    .collect { println(it) }
    ```
    
- `onCompletion` : collect작업이 완료되었을때 호출되는 블록 제공, 성공 여부와  종료 원인을 알 수 있음
    
    ```kotlin
    flowOf(1, 2, 3)
        .onCompletion { cause ->
            if (cause == null) {
                println("Flow completed successfully.")
            } else {
                println("Flow completed with exception: $cause")
            }
        }
        .collect { println(it) }
    ```
    

#### 백 프레셔 지원

- 플로우가 데이터를 빠르게 생산해도 소비자가 준비될 때까지 대기
- 코루틴 suspend함수로 지원됨

#### context 유지

- Flow연산자 내에서 코루틴 컨택스트는 자동으로 전파됨
- Flow연산자 체인에서의 각 단계는 동일한 코루틴 컨텍스트에서 실행됨을 보장

```kotlin
val myFlow = flow {
   // GlobalScope.launch { // 사용불가
   // launch(Dispatchers.IO) { // 사용불가
   // withContext(CoroutineName("myFlow")) { // 사용불가
   emit(1) // OK
   coroutineScope {
       emit(2) // OK -- 같은 코루틴에서 실행됨
   }
}
```

### `StateFlow` & `SharedFlow`

#### `StateFlow`

- 약간 라이브 데이터랑 비슷
- 항상 현재 상태값 가지는 Flow
- 상태값 변경 될때마다 새로운 값이 자동으로 방출
- 중복된 값은 방출하지 않음
- 핫스트림으로 관찰자가 없어도 값을 유지!

```kotlin
val mutableStateFlow = MutableStateFlow(0)  // 초기 상태 값으로 0 설정
val stateFlow: StateFlow<Int> = mutableStateFlow  // StateFlow 타입으로 노출

// 상태 값 변경
mutableStateFlow.value = 5

// 상태 값 사용
println(stateFlow.value)  // 출력: 5
```

#### `SharedFlow`

- 여러 컴포넌트간 이벤트나 데이터 공유하는데 사용되는 Flow
- 다중컬렉터 지원 ( 브로드 캐스팅 ) → 여러 UI컴포넌트가 동일한 데이터 스트림 구독가능
- 방출정책 설정 가능 → 버퍼크기, 초과시 동작 등
- Replay기능 → 새로운 컬렉터가 구독 시작시 최근 방출된 N개의 값을 다시 받을 수 있음
- 핫 스트림 : 관찰자 없어도 활성상태 유지!

```kotlin
val sharedFlow = MutableSharedFlow<Int>()

// 다른 코루틴에서 데이터를 방출
launch {
    sharedFlow.emit(1)
    sharedFlow.emit(2)
    sharedFlow.emit(3)
}

// 여러 컬렉터가 동시에 데이터를 수신
launch {
    sharedFlow.collect { value ->
        println("Collector 1 received: $value")
    }
}
launch {
    sharedFlow.collect { value ->
        println("Collector 2 received: $value")
    }
}
```



## 🐳 LiveData

- 관찰 가능한 데이터 홀더 클래스

### 장점

1. UI,데이터상태의 일치 보장
2. 메모리 누수 없음 → 수명주기 끝나면 자동삭제
3. 수명주기 자동으로 처리
4. 싱글톤 패턴을 사용하는 LiveData객체를 확장해 시스템 서비스 래핑 가능

### 사용

1. LiveData인스턴스 생성 (일반적으로 뷰모델)
    - 그냥 선언하면 처음에는 LiveData객체 데이터 설정안됨
2. `onChanged()`메서드 정의하는 Observer객체 만듦
3. `observe()`메서드로 LiveData에 Observer객체 연결
    - `onCreate()`가 적절, 프래그먼트는 `onViewCreated`
    - `onResume()` 메서드에서 중복호출 방지
4. LiveData객체 값 업데이트시 활성상태인 모든 관찰자가 트리거

#### 객체 업데이트

- 저장된 데이터 업데이트하는 메서드 없음
- MutableLiveDta는 setValue, postValue메서드를 public으로 노출해서 저장된 값 수정
- 뷰모델은 변경 불가능한 LiveData 객체만 관찰자에게 노출 → backing property!

### 뷰모델에서 라이브 데이터를 사용하는 이유

- 뷰모델은 상태를 보유
- UI컨트롤러는 데이터 표시를 담당하고 상태는 보유하지 않음
- 생명주기가 더 길다.

### Lifecycle Aware Component

- 액티비티, 프래그먼트 등 수명주기 고려
- 활성 상태 관찰자에게만 업데이트 알림 → STARTED~RESUMED
- **비활성 상태**에서 **활성 상태**로 변경될때도 업데이트 받음 → 이경우 가장 최신 데이터

#### 관찰자(Observer)

- LifecycleOwner인터페이스를 구현한 객체와 페어링된 관찰자
- `observerForever`메서드를 통해 LifecycleOwner객체 없는 관찰자를 등록 가능

#### 아키텍처를 위한 LiveData원칙

- 액티비티, 프래그먼트는 상태를 보유하지 않고 데이터를 표시하는 역할만 하므로 LiveData인스턴스를 보유하면 안됨
- LiveData는 비동기 데이터 스트림을 처리하도록 설계되지 않았으므로 데이터 레이어에서 LiveData사용안됨.

→ 데이터 스트림 사용 : Kotlin Flow + asLiveData로 뷰모델의 LiveData로 변환

→(자바) RxJava나 Executor를 사용

### LiveData & ROOM

- DAO일부로 작성
- DB업데이트시 Room이 LiveData업데이트 해주는 코드 생성
- 생성된 코드는 필요시 백그라운드에서 비동기적으로 쿼리 실행
- UI 데이터와 DB데이터의 동기화에 유용

### LiveData & Coroutine

- 코루틴 지원 가능

### LiveData내부 함수 (상속 후 override가능)

- `onActive()` : 활성 상태의 관찰자가 있을때 호출
- `onInactive()` : 활성상태의 관찰자가 없을때 호출
- `setValue(T)` : LiveData인스턴스 값을 업데이트 하고 모든 활성 상태 관찰자에게 변경사항 알림

### 라이브데이터로 액티비티, 프래그먼트, 서비스 간 객체공유

- 싱글톤 패턴 적용

```kotlin
class StockLiveData(symbol: String) : LiveData<BigDecimal>() {
    private val stockManager: StockManager = StockManager(symbol)

    private val listener = { price: BigDecimal ->
        value = price
    }

    override fun onActive() {
        stockManager.requestPriceUpdates(listener)
    }

    override fun onInactive() {
        stockManager.removeUpdates(listener)
    }

    companion object {
        private lateinit var sInstance: StockLiveData

        @MainThread
        fun get(symbol: String): StockLiveData {
            sInstance = if (::sInstance.isInitialized) sInstance else StockLiveData(symbol)
            return sInstance
        }
    }
}
```

- 앱 전역에서 트리거 받을 수 있음

### LiveData 변환 : `Transformations`

- `Transforamtions.map()` : 저장된 값에 함수를 적용하고 결과를 바로 반환
- `Transformation.switchMap()` : map과 비슷한데 반환값이 LiveData객체


## `LiveData` vs `StateFlow`

### 공통점

- 관찰가능한 데이터 홀더 클래스
- 앱 아키텍처에서 사용시 비슷한 패턴따름

### 차이점

- `StateFlow`
    - 초기 상태를 생성자에 전달해야함
    - 수명주기에 따른 고려를 위해서 `Lifecycle.repeatOnLifecycle`사용해야함(기본적으로 지원안함)
- `LiveData`
    - 초기 상태를 지정하지 않을 수 있음
    - 자동으로 수명주기를 고려

## 📖참고자료

[LiveData 개요  \|  Android 개발자  \|  Android Developers](https://developer.android.com/topic/libraries/architecture/livedata?hl=ko)

[Android Transformations](https://developer.android.com/reference/androidx/lifecycle/Transformations#map\(androidx.lifecycle.LiveData%3CX%3E,%20androidx.arch.core.util.Function%3CX,%20Y%3E\))


[Android의 Kotlin 흐름  \|  Android Developers](https://developer.android.com/kotlin/flow?hl=ko)

[Flow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/)
