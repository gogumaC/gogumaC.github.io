---
title: "[Java] Stream으로 데이터 가공"
excerpt : "Stream을 활용한 필터링, 맵핑, 정렬, 반복"
categories: java
tags:
    - [java,stream,Predicate,Function,Cunsumner,filtering,mapping,sorting]
date : 2023-05-18
last_modified_at: 2023-05-18
toc : ture
toc_sticky : true
---
# 🌊 Stream으로 데이터 가공

## 🐟 필터링

### Stream.filter

- 스트림의 요소 중 원하는 요소만 추출하는 메서드

```java
Stream<T> filter(predicate<? super T> predicate)
```

- 예시
    
    ```java
    stream.filter(element-> element.startWith("java"))//원소->필터역할을 할 원소의 조건
    	.forEach(System.out::println)
    ```
    
- [`Predicate`](https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html)
    - 단어 적 의미는 ~을 사실로 단정짓다.
    - 입력값의 유효성을 판단하는 메서드를 정의→ 조건검사하여 True, False 반환
    - 함수형 인터페이스(하나의 추상 메서드를 가지는 인터페이스)(Java 8~) → 람다식 사용가능
    
    ```java
    //주어진 객체t를 특정 조건에 따라 검사하고 boolean으로 결과값 반환
    boolean test(T t)
    ```
    
    ```java
    Predicate<Integer> isEven = num -> num % 2 == 0;
    ```
    

## 🐟 매핑

### Stream.map

- 스트림 요소 각각을 다른 값으로 가공

```java
<R> Stream<R> map(Function<? super T,? extends R> mapper)
```

- `T`: 기존 Stream원소 타입
- `R`: 매핑을 통해 변경할 Stream원소 타입
- `mapper`: T타입의 원소를 변경하는 규칙을 지정하는 함수
    - 각 요소에 독립적으로 적용되며 다른 요소나 외부 상태에 영향주지 않음
    - 상태를 가지지 않음

- 예시
    
    ```java
    stream.map(String::length) //Stream<String> -> Stream<int>
    	.forEach(System.out::println); 
    ```
    

- [`Function`](https://docs.oracle.com/javase/8/docs/api/java/util/function/Function.html)
    - 함수형인터페이스 → 람다식 사용가능
    - apply() 추상함수 : 주어진객체에 해당 함수 적용
    
    ```java
    R apply(T t)
    ```
    

### Stream.mapTo***

- 매핑의 결과가 ***으로 반환

```java
IntStream mapToInt(ToIntFunction<? super T> mapper)

LongStream mapToLong(ToLongFunction<? super T> mapper)

DoubleStream mapToDouble(ToDoubleFunction<? super T> mapper)
```

- 예시
    
    ```java
    stream.mapToInt(String::length)
    //stream.mapToLong(...)
    ```
    
    ```java
    class Student(){
    	public Double getAvg(){...}
    }
    
    ... 
    //stream<Student>
    stream.mapToDouble(Student::getAvg());
    ```
    

### Stream.flatMap

- 각 요소를 새로운 스트림으로 변환하고 평면화 하여 하나의 스트림을 반환

```java
<R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper)
```

- 과정
    1. 각 요소를 매핑함수에 적용
    2. 생성된 스트림 내용물로 대체
    3. 각 요소에서 생성된 스트림을 이어붙여 하나의 스트림을 반환
- 예시
    
    ```java
    stream=Arrays.asList("a,b,c","d,e,f").stream();
    
    stream.flatMap(str-> str.split(","));
    	.forEach(System.out::println)
    //a b c d e f
    ```
    

### Stream.flatMapTo***

```java
//평면화 된 IntStream반환
IntStream flatMapToInt(Function<? super T,? extends IntStream> mapper)

//평면화 된 LongStream반환
LongStream flatMapToLong(Function<? super T,? extends LongStream> mapper)

//평면화 된 DoubleStream반환
DoubleStream flatMapToDouble(Function<? super T,? extends DoubleStream> mapper)
```

## 🐟 정렬

### Stream.sorted

- 요소를 정렬해 줌

```java
Stream<T> sorted() //natural order로 정렬
Stream<T> sorted(Comparator<? super T> comparator)// 요소가 객체거나 정렬방식 커스텀이 필요할때 사용
```

- 오름차순 정렬
    
    ```java
    stream.sorted();
    ```
    
- 내림차순 정렬
    
    ```java
    stream.sorted(Comparator.reverseOrder());
    ```
    

## 🐟 반복

### Stream.peek

- 모든 요소에 대해 차례대로 작업할때 사용

```java
Stream<T> peek(Consumer<? super T> action)
```

- `action` : 각 요소에 적용할 side effect
- Stream.map과 차이점은 원본 요소를 그대로 유지한채 사이드 이펙트가 있는 새로운 스트림 반환 가능
- 디버깅, 각 요소 검사, 로깅메시지, 상태 변경 출력 등에 주로 쓰임
- peek은 중간 연산으로 사용되며 최종 연산(맨 마지막 줄)이 실행되기 전에는 실제 계산을 수행하지 않음
- 예시
    
    ```java
    //Stream 1, 2, 3, 4 ..
    stream.peek(System.out::println)
    	.forEach(num->{}) //최종 연산에서 각 요소가 소비될때 peek메서드가 실행되며 스트림 요소 처리후 최종결과 반환
    /*forEach에서 스트림을 소비할때 각 요소에 대해 peek가 실행됨
    1
    2
    3
    4
    */
    ```
    
- [`Cunsumer`](https://docs.oracle.com/javase/8/docs/api/java/util/function/Consumer.html)
    - 함수형 인터페이스
        
        ❗️다른 대부분의 함수형 인터페이스와는 다르게 일반적으로 side effect를 동작시킴 
        
    - 입력된 객체에 accept 함수를 적용한 뒤 아무것도 반환 안함
    
    ```java
    void accept(T t)
    ```
    
<br>
---

- 참고 사이트
    
    [java.util.stream (Java Platform SE 8 )](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html)
    
    [Java Platform SE 8](https://docs.oracle.com/javase/8/docs/api/)
    
- 참고 도서
    
    꼭 알아야하는 Java Programming [혜지원 / 오정원]