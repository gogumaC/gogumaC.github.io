---
title: "[kotlin] withIndex() 동작 원리 분석"
excerpt : "withIndex()는 왜 lazy한 특성을 가지는가"
categories: kotlin
tags:
    - [kotlin,withIndex,interface,Iterable,IndexingIterable,Iterator,IndexingIterator,IndexedValue]
date : 2023-04-17
last_modified_at: 2023-04-17
toc : ture
toc_sticky : true
---
요즘 알고리즘을 풀 때 시간초과가 많이 생겨서 코드에 불필요한 반복문이 있는지 확인하게된다.

최근에는 간단한 알고리즘 문제를 풀다가 아래와 같은 코드를 짜게되었다. 

```kotlin
var nameMap = name.withIndex().associate{it.value to yearning[it.index]}
```

 `withIndex()`와 `associate()` 를 사용해서 map을 만드는 코드인데 두 함수 모두 뭔가 순회하여 컬렉션을 반환하는 함수인 것 같아 불필요한 반복이 되지 않나 싶어 두 함수를 조사하게 되었다.

결론은 `associate()`의 경우 반복을 통해 원소를 매핑시키는게 맞지만 `withIndex()`의 동작방식이 굉장히 예상 외였고 공부하다보니 재미있어서 이렇게 `withIndex()`만 따로 떼서 포스팅을 작성하게 되었다.

`withIndex()`는 코틀린 공식문서에서 다음과 같이 설명하고 있다.

> Returns a **lazy Iterable** that wraps each element of the original collection into an **IndexedValue** containing the index of that element and the element itself.<br>
각 원소의 원래 컬렉션을 원소의 인덱스와 값을 포함하는 **IndexedValue**로 감싸는 **lazy Iterable**을 반환한다.
> 

이 설명을 읽을 때 가장 이해가 안됐던 부분은 lazy라는 부분이었다.

- 원소를 IndexedValue로 변환하는게 왜 lazy Iterable이지?
- `withIndex()`의 반환값은 그냥 IndexingIterable이라고 되어있는데 어떤 원리로 lazy할 수 있는 거지?

등등 여러 의문점이 많았지만 `withIndex()`가 어떻게 동작하는지 공부하면서 궁금증을 해결할 수 있었다.

## 😋 `withIndex()` 사용법

`withIndex()`를 한번도 써보지 않았거나 잊어버린 사람들을 위해 `withIndex()`함수가 어떤 결과를 가져오는 함수인지 잠깐 알아보도록 한다.

```kotlin
val list=listOf("a","b","c")
val indexedList=list.withIndex()

println(indexedList)
println(indexedList[0].index)
println(indexedList[0].value)
//output : [IndexedValue(index=0, value=a), **IndexedValue(index=1, value=b)**, IndexedValue(index=2, value=c)]
//output : 0
//output : a
```

이처럼  `withIndex()`는 컬렉션 등의 확장함수로 해당 **객체의 원소를 (index,value)로 접근**할 수 있게 해준다.

출력만 보면 뭔가 컬렉션을 변경해서 각 원소를 (index,value)로 바꾸어주는 함수인 것 같지만 실상은 약간 다르다!

이에 대해 지금부터 천천히 알아보도록 한다!

## 🧐사전지식

### ➰ 인터페이스

인터페이스에 대해 알아야 하는 이유는 `withIndex()`가 **Iterable** , **Iterator**라는  인터페이스의 확장 함수이기 때문이다.

따라서 간단하게 인터페이스의 개념에 대해 알고 있다면 이해에 도움이 될 것이다.

- 인터페이스는 객체에 어떤 함수나 프로퍼티가 있다는 것을 보장하기 위한 도구
- 인터페이스는 상속 가능
- 인터페이스는 **추상 멤버함수**, **멤버함수**, **추상변수**를 가질 수 있음
- 추상 멤버함수를 가진 인터페이스를 상속받았는 객체를 만들었다면 반드시 추상멤버함수를 구현해야함

### ➰ [Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/)

- 코틀린의 collection,Array,Sequence 등을 상속하는 인터페이스
- 그냥 컬렉션이나 배열을 의미한다고 생각하면 편함
- `iterator()`  추상함수 선언
    - `iterator()` : 해당 객체를 순회하는 **Iterator**를 반환
        
        ```kotlin
        abstract operator fun iterator(): Iterator<T>
        ```
        

### ➰ Iterator

- 코틀린의 반복자 인터페이스
- `next()`, `hasNext()` 추상함수 선언
    - `next()` : 다음 원소를 반환
    - `hasNext()` : 다음 객체가 있다면 true 반환

### ➰ [IndexedValue](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-indexed-value/)

- 인덱스와 값을 묶은 데이터 클래스
    
    ```kotlin
    public data class IndexedValue<out T>(public val index: Int, public val value: T)
    ```
    
- `withIndex()`를 사용하면 해당 객체의 원소를 **IndexedValue**형태로 접근할 수 있게됨.
- index : 해당 원소의 인덱스
- value : 해당 원소의 값

대충 이해했다면 아래에서 `withIndex()`에 대한 자세한 동작 방식을 정리해보기로 한다.

## 👀 `withIndex()` 분석

### ➰ [Iterable.withIndex()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/with-index.html)

우리가 흔히 쓰는 `withIndex()`함수는 **Iterable**인터페이스의 확장함수이다.

위에서 언급했듯이 **Interable**은 대충 list나 array라고 생각하면 편하다.

```kotlin
val indexedList=list.withIndex()
```

코드상으로 `withIndex()` 의 내부를 살펴보면 아래와 같다.

```kotlin
public fun <T> Iterable<T>.withIndex(): Iterable<IndexedValue<T>> {
    return IndexingIterable { iterator() }
}
```

위 코드를 살펴보면 아래와 같은 사실을 알 수 있다.

- 반환값으로 List나 array같은 객체가 아닌 **IndexingIterable**이라는 것을 반환한다.
- **IndexingIterable**은 Iterable인터페이스를 상속받는 클래스이다.

**🔹 [IndexingIterable](https://github.com/JetBrains/kotlin/blob/30788566012c571aa1d3590912468d1ebe59983d/libraries/stdlib/src/kotlin/collections/Iterables.kt#L24)**

```kotlin
/**
 * A wrapper over another [Iterable] (or any other object that can produce an [Iterator]) that returns
 * an indexing iterator.
 */
internal class IndexingIterable<out T>(private val iteratorFactory: () -> Iterator<T>) : Iterable<IndexedValue<T>> {
    override fun iterator(): Iterator<IndexedValue<T>> = IndexingIterator(iteratorFactory())
}
```

- Iterator의 iterator()함수를 오버라이드 하여 Iterator를 상속받는 **IndexingIterator**를 반환한다.

이제부터 설명할 **IndexingIterator**가 `withIndex()`의 lazy 한 특성의 핵심이다!

🔸**[IndexingIterator](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/src/kotlin/collections/Iterators.kt)**

**IndexingIterator**는 아래와 같이 정의되어있다.

```kotlin
/**
 * Iterator transforming original `iterator` into iterator of [IndexedValue], counting index from zero.
 */
internal class IndexingIterator<out T>(private val iterator: Iterator<T>) : Iterator<IndexedValue<T>> {
    private var index = 0
    final override fun hasNext(): Boolean = iterator.hasNext()
    final override fun next(): IndexedValue<T> = IndexedValue(checkIndexOverflow(index++), iterator.next())
}
```

여기서 눈여겨 봐야할 부분은 마지막 줄에 오버라이드 된 `next()`함수이다.

```kotlin
final override fun next(): IndexedValue<T> = IndexedValue(checkIndexOverflow(index++), iterator.next())
```

사전지식 부분에서 `Iterator.next()`함수는 **다음 원소를 반환**하게 되어있지만 위에 나와있는 **`IndexingIterator.next()`** 시 원래 Iterator.next()에 의해 접근한 원소를 **IndexedValue로 변환하여 반환**하도록 정의되어있다.

따라서 정리하자면 위와 같은 동작 과정을 통해 아래의 `withIndex()`의 특성이 생겨난다.

1. `withIndex()`는 기존 객체의 값을 변경하지 않음
2. `withIndex()`는 기존 객체를 반복하여 값을 복사 및 변환하지 않음 (기존 객체가 저장된 메모리 주소에서 원소 접근)
    
    ❗기존 객체가 변하면 `withIndex()`로 만든 결과도 변한다!
    
    ```kotlin
    fun main(){
        val list=mutableListOf("a","b","c")
        val indexedList=list.withIndex()
    
        println(indexedList.toList()) 
    //output : [IndexedValue(index=0, value=a), IndexedValue(index=1, value=b), IndexedValue(index=2, value=c)]
        list[1]="B"
        println(indexedList.toList())
    //output : [IndexedValue(index=0, value=a), IndexedValue(index=1, value=B), IndexedValue(index=2, value=c)]
    
    }
    ```
    
3. `withIndex()`를 통해 반환된 **IndexingIterable**는 **IndexingIterator**에 정의된 next()함수를 통해 그때그때 해당 원소를 IndexedValue로 변환하므로 lazy한 특성을 가짐

### ➰ [Iterator.withIndex()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/with-index.html)

Iterator에서도 withIndex()를 사용할수 있다.

여기서는 withIndex의 기능을 아래와 같이 설명하고 있다.

> Returns an Iterator that wraps each element produced by the original iterator into an IndexedValue containing the index of that element and the element itself.
<br>원래 iterator에 의해 만들어진 각 원소를 IndexedValue로 감싸서 반환
> 

사실상 동작원리는 위에서 봤던 Iterable.withIndex()와 동일하다.

다만 차이점은 Iterable.withIndex()는 **IndexingIterable**을 반환하지만 Iterator().withIndex는 **IndexingIterator**를 반환한다는것이다.

```kotlin
public fun <T> Iterator<T>.withIndex(): Iterator<IndexedValue<T>> = IndexingIterator(this)
```


<br><br>
---

이거 조사하는데 거의 3일 정도 걸린것같다..😵‍💫

엄청 힘들었는데 동시에 함수 동작방식을 공부하는게 재밌고 신기하기도했다.

withIndex()를 조사하면서 Iterable이랑 Iterator에 대해서도 더 자세히 알 수 있었고 얘네들을 상속한 IndexingIterable, IndexingIterator를 보면서 나도 이런 비슷한 커스텀을 할 수 있을 것 같다는 생각도 들었다.

앞으로도 재미있는 구조의 함수가 있으면 이렇게 종종 공부해보면 재미있을것같다.

PS.

공부하고 정리하려고 쓴 글이므로 틀린부분이나 수정이 필요한 부분은 언제든지 알려주시면 감사하겠습니다!

호옥시 궁금한점이 있으시면 제가 아는 부분에 한해서는 최대한 열심히 답글을 달아드리도록 노력해보겠습니다😊


## 참고

[withIndex - Kotlin Programming Language](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/with-index.html)

[Iterable - Kotlin Programming Language](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/)

[IndexedValue - Kotlin Programming Language](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-indexed-value/)

[kotlin/Iterables.kt at 30788566012c571aa1d3590912468d1ebe59983d · JetBrains/kotlin](https://github.com/JetBrains/kotlin/blob/30788566012c571aa1d3590912468d1ebe59983d/libraries/stdlib/src/kotlin/collections/Iterables.kt#L24)

[kotlin/Iterators.kt at master · JetBrains/kotlin](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/src/kotlin/collections/Iterators.kt)

[kotlin/Iterators.kt at 30788566012c571aa1d3590912468d1ebe59983d · JetBrains/kotlin](https://github.com/JetBrains/kotlin/blob/30788566012c571aa1d3590912468d1ebe59983d/libraries/stdlib/src/kotlin/collections/Iterators.kt#L25)