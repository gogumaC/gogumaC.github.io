---
title: "[ClimbUp🧗] jvm target compatibility should be set to the same Java version. 에러 해결"
excerpt : "gradle, androidStudio JDK version 호환성 문제 해결"
categories: projects climbup
tags:
    - [climbup,project, build,ksp,kapt,JVM,JVMToolChain,JDK,issue]
date : 2023-06-06
last_modified_at: 2023-06-06
toc : ture
toc_sticky : true
---
프로젝트에서 DB를 구축하는데 Room을 사용하기로 해서 gradle에 관련 설정을 하고 있는데 자꾸 빌드가 안되는 거다!😡

근데 전에 Room을 연습할 때는 이런 오류가 없었어서 더 당황스러웠다.😱

## ❗️에러 코드

```kotlin
//build.gralde:module

kapt "androidx.room:room-compiler:$room_version"
```


>Execution failed for task ':app:kaptGenerateStubsDebugKotlin'.
 'compileDebugJavaWithJavac' task (current target is 1.8) and 'kaptGenerateStubsDebugKotlin' task (current target is 17) jvm target compatibility should be set to the same Java version.
  Consider using JVM toolchain: https://kotl.in/gradle/jvm/toolchain


처음에는 KSP를 사용했는데 오류가 나서 KSP가 문제인가 싶어 kapt로 바꿔보았는데 그래도 같은 오류가 나서 KSP나 kapt의 문제는 아니겠거니 싶었다.

저 오류 문구를 읽어 보는데 JVM current target이 하나는 1.8이라 그러고 하나는 17이라 그러니까 무슨 소리를 하는지 이해가 잘 안됐었다.

아래는 위 에러를 이해하기 위해 조사한 것들이다.

## 📚사전 지식

### kapt(Kotlin Annotation Porcessing Tool)

- https://kotlinlang.org/docs/kapt.html
- 코틀린 코드에서 자바 주석 프로세서를 사용 가능하게 함

### KSP(Kotlin Symbol Processing)

- kapt 대안
- kapt보다 빠름
- kotlin 언어 구성을 더 잘 이해함

### JVM(Java Virtual Machine)

- 자바를 실행시키기 위한 환경
- java코드(.java) →(자바 컴파일러)→Java bytecode(.class)→(JVM)→기계어
- JVM덕분에 자바는 OS에 종속 받지 않음
- +) JVM은 JDK에 포함되어있으므로 JDK버전에따라 JVM버전도 달라진다.

### JVM toolchain

- JDK에 포함된 자바 프로젝트를 빌드하고 실행하기 위한 도구 세트
- Java컴파일러, JRE(Java Runtime Environment), Java class 라이브러리 등으로 구성
- 코틀린 컴파일러는 JVM Toolchain을 사용해 코틀린 코드를 Java ByteCode로 컴파일한다.

### 에러에 JVM current target이 왜 2개 찍혀있나?(1.8 ,17)

- 안드로이드앱을 만들때 Gradle과 Adnrodi Gradle 플러그인은 Android스튜디오랑 독립적으로 실행된다.
- 따라서 Gradle과 Adroid Gradle플러그인은 각각 업데이트가 필요하다
- 그래서 우리가 접하는 JDK버전 설정은 아래의 두 개이다.
    1. **Project Structure>SDK Location>JDK Location**
        - 이 화면에서는 안드로이드 스튜디오가 앱을 제작 과정에서 내부적으로 사용되는 JDK버전을 결정한다.
        
        <img src="\assets\image\projects\climbup\230606-ERROR-gradle-androidStudio-JDK-compatibility-problem\project_structure_JDK_version_setting.png">
        
    2. **build.gradle(:app)의 compileOptions**
        - 여기서는 프로젝트의 소스코드를 컴파일 하는데 사용하는 JDK버전을 지정한다.
        - sourceCompativility : 사용되는 JDK버전 지정
        - targetCompativility : 생성되는 ByteCode의 대상 JDK버전을 지정
        - kotlinOptions - jvmTarget : kotlin컴파일러가 사용하는 JVMTarget설정
        
        <img src="\assets\image\projects\climbup\230606-ERROR-gradle-androidStudio-JDK-compatibility-problem\build_gradle_JDK_version_setting.png">
        

***+) java 1.8은 왜 혼자 1.이 붙나***

원래 자바 1.x로 표기되다가 1.8부터 1.을 생략하여 표기하기 시작함

따라서 java 1.8은 java8과 동일하다

## 🤔원인

위에서 두 가지 JVM버전이 다른 목적으로 명시되어 있는 것을 보았다.

둘을 다르게 설정할 수 있지만 그렇게 설정했을 때 제작과 컴파일 과정에서 다른 버전의 자바를 사용하게 되므로 호환성에 대해 오류가 생길 수 있다.

이런 점에서 미루어볼 때 코드를 작성할 때는 JDK17로 만들고 컴파일은 8로 하니까 이 녀석이 굉장히 화가 나서 빨간 글자 폭탄을 뿜어버린 것이 아닌가 싶다😵

## ✅해결

### 해결1) JDK 버전 맞춰주기

JDK버전을 17로 맞춰주었더니 오류가 사라졌다.

```kotlin
compileOptions {
        sourceCompatibility JavaVersion.VERSION_17//VERSION_1_8
        targetCompatibility JavaVersion.VERSION_17//VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()//'1.8'
```

JDK 8로 맞추면 안되나 싶어서 8로 맞춰보니 아래 같은 오류가 나왔다.

> Could not resolve all files for configuration ':classpath'.
   > Could not resolve com.android.tools.build:gradle:8.0.1.
     Required by:
         project : > com.android.application:com.android.application.gradle.plugin:8.0.1
         project : > com.android.library:com.android.library.gradle.plugin:8.0.1
      > No matching variant of com.android.tools.build:gradle:8.0.1 was found. The consumer was configured to find a library for use during runtime, compatible with Java 8, packaged as a jar, and its dependencies declared externally, as well as attribute 'org.gradle.plugin.api-version' with value '8.0' but: … 이하생략
> 

이유는 gradle버전에 따라 요구하는 JDK 버전이 상이하기 때문이다.

gradle버전에 따른 JDK 버전은 문서에 나와있으니 이런 오류가 나온다면 지원하는 버전에 JDK버전을 맞춰주면 될 것 같다.

참고로  gradle 7.4.0-alpha9부터 자바 11을 타겟팅하므로 1.8은 사용할 수 없다. (확인해봤는데 11은 쓸 수 있었다)



### 해결2 ) 툴체인 명시(AGP 8.1.0-alpha09 이상부터 가능)

이거는 오류 메시지에 있는 [링크](https://kotl.in/gradle/jvm/toolchain)에서 확인할 수 있다.

대충 정리해보자면 코틀린을 자바 ByteCode로 변환할 때는 코틀린 컴파일러를 사용하는데, 코틀린 컴파일러는 JVM ToolChain을 사용해 소스 코드→자바 ByteCode로 컴파일한다.

그러니까 위랑 같은 이유로 컴파일 할 때 JDK버전이 안 맞아서 못하니까 Toolchain버전을 따로 명시해서 컴파일에 사용 JDK버전을 맞추자는 것 같다.

```kotlin
// if Android
kotlin {
    jvmToolchain(17)
/* 이렇게도 가능!
		jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
*/
}

android {
    ...
    kotlinOptions {
        // Don't need to add jvmTarget
    }
    ...
}
```

AGP 8.1.0 어쩌구 부터 지원된다고 하길래 궁금해서 업데이트 하려고 했는데 저 버전을 못 찾았다..

어쨌든 이 버전 이하를 사용한다면 위의 1번 방법을 사용하면 될 것 같다.

<br>
## 참고

[kapt에서 KSP로 이전  \|  Android 개발자  \|  Android Developers](https://developer.android.com/studio/build/migrate-to-ksp?hl=ko)

[[android] Task :app:compileDebugJavaWithJavac FAILED 오류 해결방법](https://minchanyoun.tistory.com/128)

[Configure a Gradle project \| Kotlin](https://kotlinlang.org/docs/gradle-configure-project.html#gradle-java-toolchains-support)

[[Gradle] Kotlin Java toolchains(툴체인) 관련 오류 해결 방법, with AGP 8.1](https://daryeou.tistory.com/347)

[GradleException: 'compileDebugJavaWithJavac' task (current target is 1.8) and 'kaptGenerateStubsDebugKotlin' task (current target is 17 )](https://velog.io/@mraz3068/안드로이드-스튜디오-빌드-관련-오류JDK-version-17-1.8-11-무한-반복)

[CompileOptions  \|  Android Developers](https://developer.android.com/reference/tools/gradle-api/4.1/com/android/build/api/dsl/CompileOptions)

[Android Gradle 플러그인 출시 노트  \|  Android 개발자  \|  Android Developers](https://developer.android.com/studio/releases/gradle-plugin?hl=ko)

[[Android, Kotlin]  Gradle / build.gradle(project)와 build.gradle(module) 차이](https://hungseong.tistory.com/19)

[빌드 구성  \|  Android 개발자  \|  Android Developers](https://developer.android.com/studio/build?hl=ko#kts)

[KAPT보다 2배 더 빠르게, 코틀린을 위한 KSP \| 찰스의 안드로이드](https://www.charlezz.com/?p=45255)

[[JAVA] JVM이란? 개념 및 구조 (JDK, JRE, JIT, 가비지 콜렉터...)](https://doozi0316.tistory.com/entry/1주차-JVM은-무엇이며-자바-코드는-어떻게-실행하는-것인가)