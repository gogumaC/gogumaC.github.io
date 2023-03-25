---
title: "[android][kotlin] ROOM 개념 및 사용법"
categories: 
    - android
tags: 
    - [android, room, ROOM, jetpack]
date: 2023-03-23
last-modified_at: 2023-03-26
layout: single
---


이번 프로젝트에서는 북마크 기능이 필요해서 DB를 사용해보기로했다. 
예전에는 SQL 쿼리문으로 DB를 다뤘었는데 너무 불편했어서 이번에는 jetpack Room을 사용해서 DB를 사용해보기로 했다.

## 목차

1. [😵‍💫SQL의 문제점](#sql-api의-문제점)
2. [🤔Room 이란?](#room이란)
3. [🧑‍💻Room 사용법](#room-사용법)

## 😵‍💫SQL api의 문제점



1. 원시 SQL 쿼리에 관한 컴파일 시간 확인이 없다.
-> 데이터가 변경될때 영향받는 SQL 퀴리를 수동으로 업데이트 해야한다!
2. SQL쿼리와 데이터 객체간 변환이 힘들다.

위와 같은 이유때문에 SQLite api에 대한 안드로이드 공식 문서에서는 Room 을 사용하는것을 권장하고 있다.

## 🤔Room이란?



위와 같은 SQLite의 문제점을 해결하기 위해 Android Jetpack에 포함된 지속성 라이브러리이다!

### Room의 장점

1. SQL쿼리의 컴파일 시간 확인
2. 반복적이고 오류가 발생하기 쉬운 상용구 코드를 최소화하는 Annotation
3. 간소화된 데이터베이스 이전경로

### Room 구성요소

- 데이터 베이스 클래스(database class)
    - 데이터 베이스 보유
    - 앱의 영구 데이터와의 기본연결을 위한 액세스 포인트 역할
- 데이터 항목(Data Entities)
    - 앱 데이터 베이스의 테이블
- 데이터 액세스 객체(DAOs)
    - 앱이 DB의 데이터를 쿼리, 업데이트,삽입, 삭제 하는데 사용할 수 있는 메서드 제공!

각 구성요소는 아래와 같은 그림으로 표현된다.

<img src="/assets/image/230323-android-jetpack-room/room_architecture.png">


처음에는 위 구조도가 잘 이해되지 않아서 내가 이해한대로 새로 그려보았다.

<img src="/assets/image/230323-android-jetpack-room/room_architecture2.png">

> Entity란?

- db에서 객체 같은 개념!
    
     ex) 노트
    
- 인스턴스의 집합
    
    ex) 빨간노트,노란노트,초록노트 (인스턴스)▶️ 노트(엔터티)
    

## 🧑‍💻Room 사용법


### 1. gradle 설정

```groovy
dependencies {
    def room_version = "2.5.0"

    implementation "androidx.room:room-runtime:$room_version"
    annotationProcessor "androidx.room:room-compiler:$room_version"

    // To use Kotlin annotation processing tool (kapt)
    kapt "androidx.room:room-compiler:$room_version"
    // To use Kotlin Symbol Processing (KSP)
    ksp "androidx.room:room-compiler:$room_version"
}
```

일단은 위 코드를 모듈레벨의 gradle파일에 넣어준다.
주의할점은 아래두줄의 코드는 둘중 하나만 써야한다는거다.

둘의 차이점을 보면 윗줄 코드는 `kapt`라고 쓰여있고 아랫줄은 `ksp`이다.

나도 아직 이부분은 공부 중 이지만 대충 간략히 정리하면 `ksp`는 `kapt`의 대안이라고 한다. 공식문서에서는 `ksp`는 코틀린 코드를 직접 분석하기때문에 2배정도 더 빠르다고 한다!

`kapt`를 사용할 경우 그냥 저 한줄만 추가해주면 되지만 **`ksp`를 사용하는 경우는 `ksp`를 적용해주는 작업이 부수적으로 필요하다.**

아래는 `ksp`를 사용할경우 필요한 추가작업이므로 `kapt`를 사용할것이라면 생략해도 좋을것같다.

**[ ksp사용 추가 설정 ]**

1. 최상위 앱레벨의 최상위 gradle파일에 KSP플러그인 선언 ( [버전확인](https://github.com/google/ksp/releases) )
    
    ```groovy
    plugins {
        id 'com.google.devtools.ksp' version '1.8.10-1.0.9' apply false
    }
    ```
    
2. 모듈수준 build.gradle파일 설정
    
    ```groovy
    plugins {
        id 'com.google.devtools.ksp'
    }
    ```
    

여기까지 작업이 끝났다면 아래는 옵션 사항이며 관련 기능이 필요하지않다면 추가하지 않아도 무관하다. 

이제 Room사용을 위한 gradle설정이 끝났다!👍

```groovy
// optional - RxJava2 support for Room
    implementation "androidx.room:room-rxjava2:$room_version"

    // optional - RxJava3 support for Room
    implementation "androidx.room:room-rxjava3:$room_version"

    // optional - Guava support for Room, including Optional and ListenableFuture
    implementation "androidx.room:room-guava:$room_version"

    // optional - Test helpers
    testImplementation "androidx.room:room-testing:$room_version"

    // optional - Paging 3 Integration
    implementation "androidx.room:room-paging:$room_version"
```

### 2. Data Entity 정의

이번 단계에서는 DataEntity를 사용하여 생성할 테이블에 대해 정의한다.

데이터 클래스에 주석(annotation)을 넣어 만드는데 이 데이터 클래스를 사용하여 생성한 객체 하나하나가 entity의 인스턴스가 된다.

```kotlin
open class Note(
    var name:String?=null,
    var createTime: Date?=Date(),
    )

@Entity(tableName="bookmark_note")
data class Bookmark(
    @PrimaryKey(autoGenerate = true) val id:Int
    ):Note()
```

간혹 아래와 같은 오류가 날수 있다.


❗<span style="background-color:	#FF000055"> Cannot figure out how to save this field into database. You can consider adding a type converter for it.
</span>

Room은 기본 타입을 위한 변환 기능만 제공하고 __entity간 객체 참조는 허용하지 않는다.__

따라서 복잡한 데이터 구조인 경우에는 어떤식으로 변환해서 디비에 저장할지 직접 typeConverter를 사용해서 정의해 주어야한다.

관련 내용은 아래 링크에서 찾을 수 있다.

[Room을 사용하여 복잡한 데이터 참조  \|  Android 개발자  \|  Android Developers](https://developer.android.com/training/data-storage/room/referencing-data?hl=ko)

위와 같은 제약때문에 나의 경우는 Entity로 사용하는 데이터 클래스에 포함할 다른 객체를 상속받는 식으로 사용하였다.

❗ <span style="background-color:	#FF000055"> Cannot find setter for field.</span>

entity의 필드는 Room에서 접근해야하므로 필드를 공개하거나 getter,setter메서드를 제공해야한다!

아래는 annotation에 대한 간단한 설명이다.

 annotation | 설명 | 예시
 --- | --- | --- 
 @Entity | • entity를 정의하는 클래스임을 명시 <br/>• tableName: 테이블 이름 지정<br/>• igonredColumns: 필드를 만들지 않을 항목 지정(상속받은 클래스의 항목도 가능!) | `@Entity(tableName="테이블 이름",ignoredColumns=["무시할 column"]) `
 @PrimaryKey | • 각 행을 고유하게 식별하기 위한 고유키를 가진 필드명시<br/>• autoGenerate속성으로 자동 할당가능  | `@PrimaryKey(autoGenerate=ture) `
 @ColumnInfo | • 해당 필드의 정보 명시<br/>😯 굳이 이름을 바꾸는 이유는 kotlin은 대부분 camelCase 사용해서 대문자로 단어를 구분하지만 sql에서는 대소문자 구분이 없기 때문에 snake_case으로 바꿔주기 위함! | `@ColumInfo(name="열이름") `
 @Ignore | • 해당 항목의 필드를 유지하지 않음 | `@Ignore val picture: Bitmap? `

더 자세한 내용이 궁금하면 아래 공식문서를 참고하는것을 추천한다! 

[Room 항목을 사용하여 데이터 정의  \|  Android 개발자  \|  Android Developers](https://developer.android.com/training/data-storage/room/defining-data?hl=ko)

### 3. DAO(Data Access Objects)정의

다음으로는 DAO를 만들차례다!

Room에서 DAO의 역할을 다시 되새겨 보자면 DAO는 Room을 사용하여 앱 데이터를 저장할때 저장된 데이터와 상호작용하는 역할을 한다.

여기에 삽입,삭제,업데이트에 관한 메서드를 만들어서 간편하게 DB와 상호작용이 가능하게 해준다!

DAO를 만들때는 아래 사항을 주의해야한다.

- 반드시 `@Dao` annotation필요
- 인터페이스, 추상클래스로 정의 할수 있지만 일반적으로 **인터페이스**를 사용해야한다!
- 앱 데이터베이스의 데이터와 상호작용하는 메서드를 하나 이상 정의한다.

#### DAO메서드의 유형

 종류 | SQL코드 작성여부 | 예시 
 --- | --- | --- 
 편의 메서드 | X <br/> SQL코드 작성 없이 데이터 베이스에서 행을 삽입,업데이트,삭제 가능 | `@Insert` <br/> `fun insertBothUsers(user1: User, user2: User) `
 쿼리 메서드 | O<br/>자체 SQL 쿼리를 작성하여 데이터 베이스와 상호작용 가능 | `@Query("SELECT * FROM user")` <br/> `fun loadAllUsers(): Array<User> `

더 자세한 내용은 공식문서를 확인하면 아주 잘 정리되어있다! 

[Room DAO를 사용하여 데이터 액세스  \|  Android 개발자  \|  Android Developers](https://developer.android.com/training/data-storage/room/accessing-data?hl=ko)

나는 아래와 같이 Dao를 만들었다.

```kotlin
@Dao
interface BookmarkNoteDao {
    //쿼리 메서드
    @Query("SELECT * FROM bookmark_note")
    fun getAll():List<Bookmark>

    //편의 메서드
    @Insert
    fun addBookmark(vararg bookmark: Bookmark)

    //편의 메서드
    @Delete
    fun deleteBookmark(bookmark: Bookmark)

}
```

### 4. DataBase

거의 마지막 단계에 왔다!

이 단계에서는 DB를 보유할 AppDatabase 클래스를 정의한다.

AppDatabase는 내가 이해하기로는 기기의 DB와 앱의 직접적인 엑세스 포인트 역할인것같다!

얘도 물론 주의점이 있다.

- 클래스에는 DB와 연결된 entity를 모두 나열하는 entities배열이 포함된 @Database주석이 달려야한다.
    
    ex) `@Database(entities = [User::class], version = 1)`
    
- RoomDatabase()클래스를 확장하는 **추상클래스** 여야한다.
- DB와 연결된 각 DAO클래스에서 DB클래스는 인수가 0개이고 DAO클래스의 인스턴스를 반환하는 추상메서드를 정의해야한다.
- 앱이 단일프로세스일 경우 AppDatabase객체를 인스턴스화 할때 싱글톤 디자인 패턴을 따라야한다.
- 앱이 여러 프로세스에서 실행되는 경우 Database빌더 호출에 enableMultiInstanceInvalidation()을 포함해서 한 프로세스에 appDatabase인스턴스가 있을때 다른 프로세스의 appDatabase 인스턴스를 무효화 해야한다.

```kotlin
@Database(entities=[Bookmark::class], version=1)
@TypeConverters(Converters::class)
abstract class AppDatabase: RoomDatabase() {
    abstract fun bookmarkDao():BookmarkNoteDao
}
```

나는 위에서 typeConverter를 정의했으므로 아래와 같이 명시해주었다.

`@TypeConverters(Converters::class)`

### 5. 데이터베이스 인스턴스 만들기

아래와 같은 코드를 통해 데이터베이스를 인스턴스화 할 수 있다.

위 주의 사항에서도 말했듯이 단일 프로세스로 구동하는 앱일 경우 데이터베이스를 인스턴스화 할때 싱글톤 패턴을 따르는것이 권장된다.

이부분은 기억이 가물가물해서 나중에 다시 정리해야겠다🥲 

```kotlin
val db = Room.databaseBuilder(
            applicationContext,
            AppDatabase::class.java, "database-name"
        ).build()
```

사용시에는 아래와 같이 사용한다.

```kotlin
val userDao = db.userDao()
val users: List<User> = userDao.getAll()
```

### 6. 끝?

이게 끝인가 싶지만 놀랍게도 아직 끝이 아니다!

이상태로 앱을 실행시켜보면 아래와 같은 오류가 뜬다.


❗<span style="background-color:	#FF000055"> E/AndroidRuntime: FATAL EXCEPTION: main
Process: com.gogumac.thenote, PID: 20471
java.lang.IllegalStateException: Cannot access database on the main thread since it may potentially lock the UI for a long period of time.</span>

이게 뭐냐면 디비 접근을 메인 스레드에서 진행하면 ui에 lock이 걸릴수 있으니 비동기적으로 다른 백그라운드 스레드에서 접근해라 대충 이런 의미이다.

비동기작업을 위해서는 Coroutine, RxJava, Thread 등의 방법이 있는데 나의 경우 Coroutine을 공부해야할것같아서 공부할겸 코루틴을 사용해보기로했다.😅

코루틴은 따로 정리하려면 시간이 걸릴것같아서 여기에는 간단하게 Thread를 사용해 비동기적으로 디비에 접근하는 코드를 간단히 적어두도록 한다! 

```kotlin
val run = Runnable {
           //여기에서 디비관련 작업 
           val files=DatabaseManager.bookmarkDao.getAll().map{it.name}
            Log.d("BOOKMARK","bookmark : ${files.toList()}")
        }

        val thread = Thread(run)
        thread.start()
```

+) 나중에 보니 비동기 DAO쿼리 작성에 대한 문서가 있었다! 참고 하면 도움이 될것같다.

[비동기 DAO 쿼리 작성  \|  Android 개발자  \|  Android Developers](https://developer.android.com/training/data-storage/room/async-queries?hl=ko)

+) 


❗<span style="background-color:	#FF000055"> java.lang.IllegalStateException: Room cannot verify the data integrity. Looks like you've changed schema but forgot to update the version number. You can simply fix this by increasing the version number.</span>

뭔가 테이블 내용에 변화가 생기면 무결성관련해서 문제가 생기나보다. 

스키마가 변경되었는데 versionNumber를 바꾸지 않았다면 나타나는 오류인것같다.

해결법으로는 어플을 지웠다가 다시 설치하거나 혹은 DatabaseClass에서 `version=1`부분을 수정해주면 된다고 한다.

---

## 🧗‍♀️더 알아보고 싶은 내용

이부분은 나중에 알아내면 포스팅에 수정해둘 예정이다!👍

혹시 답을 아시는분이 있다면 언제든지 조언을 주셨으면 좋겠다!

- DAO는 왜 인터페이스로 주로 만드는가
    - 아마 애초에 database클래스를 거쳐서 사용하는 이런 구조를 만드려고 인터페이스로 만들지 않았을까 하는 생각이든다.

여기부터는 나중에 공부할내용!

- 싱글톤 다시 공부하기
- Realm
- Room에서 livedata를 반환할수있다고 livedata공식문서에 나오는데 어떻게 반환하는지

---

## 👀참고

[SQLite를 사용하여 데이터 저장  \|  Android Developers](https://developer.android.com/training/data-storage/sqlite?hl=ko)

[Room을 사용하여 로컬 데이터베이스에 데이터 저장  \|  Android 개발자  \|  Android Developers](https://developer.android.com/training/data-storage/room?hl=ko)

[kapt에서 KSP로 이전  \|  Android 개발자  \|  Android Developers](https://developer.android.com/studio/build/migrate-to-ksp?hl=ko)

[[Android] Room 이해 및 활용](https://math-coding.tistory.com/247)

[[Android][Kotlin] Room 으로 DB 저장하기](https://blog.yena.io/studynote/2018/09/08/Android-Kotlin-Room.html)

[Room에서 데이터 무결성을 확인할 수 없습니다.](https://randomtip.tistory.com/57)