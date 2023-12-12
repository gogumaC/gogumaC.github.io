---
title: "[android] dependency버전과 compileSdk버전 호환성 error"
categories: android error
excerpt : "Dependency 'androidx.activity:activity:1.8.1' requires libraries and applications that depend on it to compile against version 34 or later of the Android APIs."
tags:
    - [android, compileSdk, dependency, error, errorlog]
date : 2023-12-12 16:15
last_modified_at: 2023-12-12 16:15
toc : ture
toc_sticky : true
header:
  og_image: /assets/image/android/2023-12-12-dependency-version-and-compilesdk-version-error/error.png
---

오랜만에 안드로이드로 소소하게 재밌는걸 만들어 보려고 프로젝트를 빌드했더니 아래와 같은 오류를 만났다.


<img src="/assets/image/android/2023-12-12-dependency-version-and-compilesdk-version-error/error.png">

## ▶️ 에러 로그

```
3 issues were found when checking AAR metadata:

  1.  Dependency 'androidx.activity:activity:1.8.1' requires libraries and applications that
      depend on it to compile against version 34 or later of the
      Android APIs.

      :app is currently compiled against android-33.

      Recommended action: Update this project to use a newer compileSdk
      of at least 34, for example 34.

      Note that updating a library or application's compileSdk (which
      allows newer APIs to be used) can be done separately from updating
      targetSdk (which opts the app in to new runtime behavior) and
      minSdk (which determines which devices the app can be installed
      on).

  2.  Dependency 'androidx.activity:activity-ktx:1.8.1' requires libraries and applications that
      depend on it to compile against version 34 or later of the
      Android APIs.

      :app is currently compiled against android-33.

      Recommended action: Update this project to use a newer compileSdk
      of at least 34, for example 34.

      Note that updating a library or application's compileSdk (which
      allows newer APIs to be used) can be done separately from updating
      targetSdk (which opts the app in to new runtime behavior) and
      minSdk (which determines which devices the app can be installed
      on).

  3.  Dependency 'androidx.activity:activity-compose:1.8.1' requires libraries and applications that
      depend on it to compile against version 34 or later of the
      Android APIs.
```

## ▶️ 원인

대충 Build Output의 첫 번째 문항을 읽어보면

> `androidx.activity:activity:1.8.1`은 sdk 34 이상으로 컴파일하기를 요구하는 라이브러리나 dependency가 필요하다.<br>
> 근데 지금은 compileSDK가 33이다.<br>
> 따라서 compileSdk를 적어도 34로 바꾸는것을 추천한다.<br>
> compileSdk는 targetSdk나 minSdk와는 별개로 바꿀 수 있다.

그러니까 몇몇 dependency의 기능은 현재 compileSdk로 컴파일할 수 없으니 compileSdk버전을 업데이트해서 이걸 맞춰주라는 것 같다.

## ▶️ 해결

원인이 이렇다 보니 대충 두가지 해결법이 있지 않을까 싶다.

1. 권장하는대로 compileSdk를 업데이트 하거나

2. 혹은 해당 라이브러리 dependency 버전을 낮추는 것

개인적으로는 이럴때 버전을 낮추기보다는 업데이트를 따라가는게 코드 경고문도 안뜨고 코드의 유효기간이 길어지는것 같아서 전자를 선호한다.

그래서 compileSdk 버전을 34로 올려서 위 에러를 해결했다.