---
title: "[Java] Stream 개요 및 생성"
excerpt : "Stream에 대한 개요와 여러가지 Stream 생성법 정리"
categories: java
tags:
    - [java,stream]
date : 2023-05-15
last_modified_at: 2023-05-15
toc : ture
toc_sticky : true
---
# 🌊 Stream

- Java8에서 추가 됨
- 이전에는 배열이나 컬렉션의 요소를 다룰때 반복문을 통해 요소를 하나씩 꺼내서 사용했음
- stream은 데이터의 흐름→ 배열,컬렉션요소를 효율적으로 다룰 수 있음
- 멀티 스레드를 사용한 병렬처리로 성능 향상 가능

## 🐟 Stream 생성하기

### • 배열을 사용한 Stream 생성

- `public static <T>Stream<T> stream(T[] array, int startInclusive, int endExclusive)`
    - `array` : 스트림을 생성할 배열
    - `startInclusive`(옵션): 스트림을 시작할 인덱스
    - `endExclusive`(옵션): 스트림을 마칠 인덱스(포함안됨)

```java
String[] arr=new String[]{"one","two","three"};
Stream<String> stream=Arrays.stream(arr);

stream.forEach(System.out::println);

Stream<String> stream=Arrays.stream(arr,0,2);

stream.forEach(System.out::println);
```

### • 컬렉션을 사용한 Stream 생성

- `default Stream<E> stream()`

```java
List<String> list=Arrays.asList("one","two","three");
Stream<String> stream=list.stream();
stream.forEach(System.out::println);
```

### • Stream.builder()를 사용한 Stream생성

- `static <T> Stream.Builder<T> builder()`
    - Stream 을 생성하기 위한 Stream.Builder를 반환
    - `Stream.Builder<T>`
        
        Stream.Builder 인터페이스의 함수
        
         함수 | 설명 | 반환값 
         --- | --- | --- 
         `accept(T t)` | built 전 stream에 원소 추가 | void 
         `add(T t)` | built 전 stream에 원소 추가 | default Stream.Builder<T> 
         `build()` | - 스트림을 빌드<br>- builder의 상태를 built로 전환 | Stream<T> 
- `Stream.<T>builder().build()` → 빈 스트림

```java
Stream<String> stream=Stream.<String>builder()
				.add("one")
				.add("two")
				.add("three")
				.build();

stream.forEach(System.out::println);
```

### • Stream.generate()를 사용한 Stream생성

- Supplier<T> 람다식으로 값 추가 가능
- **`generate(Supplier<T> s)`
    - 무한하고 정렬되지 않은 일련의 Stream을 반환
    - `s` : 스트림의 요소를 생성할 방법을 제공하는 Supplier
- `limit(long maxSize)`
    - maxSize까지 길이까지 자른 stream을 반환

```java
Stream<String> stream=Stream.generate(()->"생성요소"))
					.limit(5);

stream.forEach(System.out::println);
```

### • Stream.iterate()를 사용한 Stream생성

- 초기 값과 람다식을 이용한 증가값을 지정하여 값 추가 가능
- `static <T>Stream<T> iterate(T seed,UnaryOperator<T> f)`
    - 초기 seed에 f를 적용한 무한하고 정렬된 일련의 Stream반환
    - seed: 첫번째 원소
    - f : 다음원소를 생성할때 이전 원소에 적용되는 함수

```java
Stream<Integer> stream=Stream.iterate(10,n->n*2)
					.limit(5);

stream.forEach(System.out::println);
```

## 🐟 데이터 타입별 스트림 유형

### • 기본 데이터 타입 Stream

- IntStream
- LongStream
- DoubleStream
    
    
- 기본 데이터 타입 Strean 함수
    
    
     함수 | 설명 | 반환값 
     --- | --- | --- 
     `range(int startInclusive, int endInclusive)` | startInclusive 부터endInclusive까지 1씩 증가하는 Stream반환 | static xxxStream 
     `rangeClose(int startInclusive, int endExclusive)` | startInclusive 부터endInclusive-1까지 1씩 증가하는 Stream반환 | static xxxStream 
     `boxed()` | 해당 요소를 레퍼 클래스로 변환한(객체화,boxing) 스트림을 반환<br>ex) int→Integer() | Stream\<T>
    
    ```java
    IntStream st1= IntStream.range(0,3);
    //0,1,2 (int)
    
    LongStream st2=LongStream.rangeclosed(0,3);
    //0,1,2,3 (long)
    
    IntStream st3=IntStream.range(0,3).boxed();
    //0, 1, 3 (Integer)
    
    ```
    
- Random클래스를 통한 기본 데이터 타입 Stream만들기
    
    ```java
    DoubleStream st4=new Random().doubles(2);
    //0.2312421... 0.1231412... (double)
    ```
    

### • 문자열 타입

- 문자열을 이용한 스트림 생성
    
    ```java
    IntStream st1="HelloWorld".chars();
    
    Stream<String> st2=pattern.compile(",").splitAsStream("Aaa,Bbb,Ccc,Ddd");
    //Aaa , Bbb , Ccc , Ddd
    ```
    

### • 파일

- `Files.lines()` : 파일 각 라인의 문자열을 사용하여 Stream객체 생성
    
    ```java
    Stream<String> st1=Files.lines(Paths.get("file_name.txt"),Charset.defaultCharset());
    //첫번째 줄 , 두번째 줄, 세번째 줄 , ...
    ```
    

---

- 참고 사이트
    
    [java.util.stream (Java Platform SE 8 )](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html)
    
    [Java Platform SE 8](https://docs.oracle.com/javase/8/docs/api/)
    
    [Java 스트림 Stream (1) 총정리](https://futurecreator.github.io/2018/08/26/java-8-streams/)
    
- 참고 도서
    
    꼭 알아야하는 Java Programming [혜지원 / 오정원]