---
title: "[Android] Permission 정리"
categories: android
excerpt : "Android 권한 관련 기본 사항 정리"
tags:
    - [android, permission, runtime-permission, 런타임 권한, 권한]
date : 2024-07-29 16:05
last_modified_at: 2024-07-29 16:05
toc : ture
toc_sticky : true
header:
  overlay_image: /assets/image/2024-07-29-15-51-05.png
  overlay_filter: linear-gradient(rgba(0, 0, 0, 0.5), rgba(217, 217, 217, 0.5))
  image: /assets/image/2024-07-29-15-51-05.png
---

## Android 권한 Overview

### 왜 권한이 필요한가?

모든 Android 앱은 액세스가 제한된 샌드박스에서 실행된다.

따라서 앱이 자신의 샌드박스 외부의 리소스나 정보를 사용하는 경우 액세스 권한을 요청하게 함으로써 [시스템 보안 기능](https://source.android.com/docs/security/features?hl=ko)을 유지하며 개인정보 보호에 도움을 줄 수 있다. 

### 안드로이드 권한 요청 workflow

![](/assets/image/2024-07-29-15-51-37.png)

### 권한 종류

1. **설치 시간 권한(Install-time Permission)**
    - 시스템이 사용자가 앱을 설치할 때 자동으로 앱에 권한을 부여
    - 앱 스토어 세부 정보에 접근 권한 표기됨
    - mainfest에 선언만 하면 쓸 수 있는 권한
    - **일반권한**과 **서명권한** 등으로 구분됨
        - **일반권한(Normal Permission)**
            - 앱의 샌드박스 이상으로 확장된 데이터와 작업에 액세스
            - 사용자의 개인정보와 다른 앱 작업에는 거의 영향을 주지 않음
            - 예를 들어 인터넷 권한(INTERNET)이나, 진동 권한(VIVRATE) 등
            - `protectionLevel="normal"`
        - **서명 권한(Signiture Permission)**
            - 권한 정의하는 앱이나 OS와 동일 인증서로 앱이 서명된 경우에만 앱에 서명 권한을 부여
            - 그러니까 어떤 다른 어플리케이션에 있는 기능을 활용하는 경우 다른 어플리케이션과 동일한 keystore로 인증되어야만 사용할 수 있는 권한
            - 예를 들어 자동완성, VPN서비스 등
            - `protectionLevel"signiture"`
2. **런타임 권한(위험 권한)(Runtime Permission)**
    - 앱에서 제한된 데이터에 액세스하거나 다른 앱에 영향을 미치는 작업에 대한 권한.
    - 관련 기능에 액세스 할 때마다 권한이 부여되었는지 확인해야 함.
    - 예를 들어 마이크,카메라
    - `protectionLevel="danger"`
3. **특별 권한**
    - 특정 앱 작업에 관한 권한
    - 플랫폼, OEM만 정의 가능
    - 예를 들어 다른 앱 위에 그리기 같은 작업 권한
    - `protectionLevel="appop"`

### 권한 그룹

- 논리적으로 관련성 있는 권한의 집합
- 권한 그룹은 변경될 수 있으므로 주의

### 런타임 권한 기본 원칙

- 사용자 권한이 필요한 기능과 상호작용 시작 시 권한 요청
- 사용자 차단하지 않기
- 사용자가 권한을 거부하면 앱 성능을 단계적으로 저하 시켜 앱을 계속 사용할 수 있게 하기
- 시스템 동작을 가정하지 않기

### 권장 사항

- 꼭 필요한 권한만 최소로 요청하기
- 런타임 권한은 미리 요청하지 말고 필요할 때 최대한 늦게 요청하기
- 라이브러리 포함 시 해당 라이브러리가 사용하는 권한도 딸려오므로 주의
- 권한 요청의 모든 플로우에서 사용자가 충분한 정보를 바탕으로 결정을 내릴 수 있도록 해야 함.(투명성 확보)
- 민감한 정보나 하드웨어에 액세스 할 때 시스템에서 이런 것들을 표시하지 않는다면 앱에 지속적으로 알림을 표시해야 함. (예를 들어 카메라 쓰면 나오는 초록 점 같은 게 없으면 알림을 직접 보내야 한다는 의미)

 

## 앱 권한 선언


- manifest.xml 파일의 `<uses-permission>`을 활용해 권한을 선언

```xml
<manifest ...>
    <uses-permission android:name="android.permission.CAMERA"/>
    <application ...>
        ...
    </application>
</manifest>
```

### 하드웨어 선택 사항으로 설정

하드웨어가 필수가 아니라면 아래 코드와 같이 표기해야 한다.

그렇지 않으면 해당 하드웨어가 없는 기기에서 앱을 설치하지 못하게 한다.

```xml
<manifest ...>
		<uses-permission android:name="android.permission.CAMERA"/>
    <application>
        ...
    </application>
    <uses-feature android:name="android.hardware.camera"
                  android:required="false" />
<manifest>
```

이 경우에는 카메라의 유무에 따른 플로우가 달라져야 하므로 아래와 같이 코드내에서 분기처리를 해준다.

```kotlin
if(applicationContext.packageManager.hasSystemFeature(
			PackageManager.FEATURE_CAMERA_FRONT)){
	//카메라가 있는경우
}else{
	//카메라 없는 경우
}
```

### API 수준별 권한 선언

안드로이드 6.0 (API수준 23) 이상을 실행하는 기기에서만 권한을 선언하려면 `<uses-permssion-sdk-23>` 이걸로 권한을 선언한다.

혹은 `maxSdkVersion`을 활용하여 지정된 값보다 높은 버전을 실행하는 기기에서 해당 권한을 요청하지 않을 수 있다.

```xml
<uses-permission-sdk-23 android:name="..."/>

<uses-permission android:name="..."
				android:maxSdkVersion="29"/>
```

## 런타임 권한 요청

### 런타임 권한 요청 workflow

![](/assets/image/2024-07-29-15-51-05.png)

### 권한이 이미 부여 되었는지 확인

- `ContextCompat.checkSelfPermission()` 에 권한 전달
- 권한이 있다면 PERMISSION_GRANTED반환
- 없다면 PERMISSION_DENIED반환

### 앱에 권한이 필요한 이유 설명

- `shouldShowReuqestPermissionRationale()` 호출
- 사용자가 요청을 명시적으로 거부한 경우 true를 반환, 이 경우 왜 이 권한이 필요한지 사용자에게 설명
- 사용자가 권한 요청을 처음 보거나, 다시 묻지 않음을 선택한 경우, 권한을 허용한 경우 false를 반환

### 권한 요청

- AndroidX라이브러리 `RequestPermission` Contract사용

```kotlin
val requestPermissionLauncher=registerForActivityResult(RequestPermission()){isGranted:Boolean->
	if(isGranted){
		//권한이 부여되었을때 플로우
	}else{
		//권한이 거부되었을때 플로우
	}
	
}

//권한 요청 필요시
requestPermissionLauncher.launch()
```

- 권한 그룹인 경우 `RequestMultiplePermissions`사용
- 권한 관련된 시스템 다이얼로그는 커스텀 불가능이므로 추가적인 정보 등이 필요하면 앱 UI를 수정

🚨 참고로 `ActivityResultLauncher`의 경우 STARTED이전에 호출 되어야한다. 아니면 아래와 같이 에러가 나온다. 예를 들어 `setContent`내부의 UI코드는 onResume에서도 여러번 호출 될 수 있으므로 거기에는 쓰면 안된다.

> java.lang.IllegalStateException: LifecycleOwner kr.co.gogumac.playgroundforandroid.MainActivity@3474afb is attempting to register while current state is RESUMED. LifecycleOwners must call register before they are STARTED.
> 

### [런타임 권한 요청 예제 코드](https://github.com/gogumaC/playground/issues/2)

```kotlin
val requestPermissionLauncher=registerForActivityResult(ActivityResultContracts.RequestPermission()){isGranted:Boolean->
	if(isGranted){
		//권한이 부여되었을때 플로우
	}else{
		//권한이 거부되었을때 플로우
	}	
}

//...

when{
	ContextCompat.checkSelfPermission(context,Manifest.permission.CAMERA)==PackageManager.PERMISSION_GRANTED->{
		//권한이 이미 부여된 경우
	}
	ActivityCompat.shouldShowRequestPermissionRationale(this,Manifest.permission.CAMERA)->{
		//권한이 부여되지 않았고, 사용자가 명시적으로 거부 버튼을 누른경우
		//이 경우 해당 권한에 대해 설명해야함
		showInContextUI()
	}
	else->{
		//사용자가 권한 요청을 처음 접하거나, 다시 묻지 않음을 선택한 경우
		requestPermissionLauncher.launch(Manifest.permission.CAMERA)
	}
}
```

### request code를 사용한 권한 요청

- 위 예시에서는 시스템이 request code를 관리함, 여기서는 직접 관리
- `requestPermissions()`사용

```kotlin
when{
	ContextCompat.checkSelfPermission(context,Manifest.permission.CAMERA)==PackageManager.PERMISSION_GRANTED->{
		//권한이 이미 부여된 경우
	}
	ActivityCompat.shouldShowRequestPermissionRationale(this,Manifest.permission.CAMERA)->{
		//권한이 부여되지 않았고, 사용자가 명시적으로 거부 버튼을 누른경우
		//이 경우 해당 권한에 대해 설명해야함
		showInContextUI()
	}
	else->{
		//사용자가 권한 요청을 처음 접하거나, 다시 묻지 않음을 선택한 경우
		requestPermission(context,arrayOf(Manifest.permission.CAMERA,999) //requestCode=999
	}
}
```

```kotlin
//요청 결과 받을때

override fun on RequestPermissionResult(requestCode:Int,permissions:Array<String>,grantResults:IntArray){
	when(requestCode){
		999->{
			if((grantResult.isNotEmpty())&&grantResult[0]==PackageManager.PERMISSION_GRANTED)){
				//권한 허용된 경우
			}else{
				//유저에게 권한 거부로 인해 해당 기능을 사용하지 못한다고 설명.
				//유저의 결정을 존중하여 시스템 세팅으로 유저를 이동시켜서 유저 결정을 바꾸려는 노력을 하지 않아야함.
			}
		}
	}
}
```

- 요청 실패 시 빈 배열이 들어온다.

### 권한 거부 처리

1. 해당 권한이 없어서 제한 된 앱 UI특정 부분을 강조
2. 자세히 설명
3. 사용자 인터페이스 차단하지 않기 ex) 전체 화면 경고 메시지 X

- 사용자가 특정 권한에 관해 거부를 두번이상 선택하면 이후 해당 권한을 요청할 때 시스템 다이얼로그가 나타나지 않음.
- 이런 이유로 꼭 필요할때만 권한을 요청하는 것이 중요한 것

### 일회성 권한

- ‘이번만 허용’ 누르면 해당 액티비티가 표시되는 동안만 임시성 권한이 부여됨.
- 사용자가 앱을 백그라운드로 보내면 짧은 시간동안 데이터에 계속 액세스 가능
- 포그운드 서비스가 실행되고 있다면 해당 서비스가 중지될 때까지 계속 액세스 가능
- 사용자가 시스템 설정 등에서 권한을 취소하면 이러한 모든 작업에 중지되고 앱 프로세스가 종료됨

### 사용하지 않는 권한 재설정

**사용하지 않는 권한 삭제**

- Android 13(API 33) 이상에서는 런타임 권한이 더이상 필요없다면 해당 권한을 삭제할 수 있음
- 이 경우 `revokeSelfPermissionOnKill()` , `revokeSelfPermissionsOnKill()` 사용
- 권한 그룹 삭제시 내부의 모든 권한에 대해 삭제해야함

**사용하지 않는 권한 자동 재설정**

- Android 11(API 30) 이상에서는 몇개월간 사용되지 않는 런타임 권한을 시스템이 자동으로 재설정하게 되어있음.

### 테스트 목적으로 모든 런타임 권한 부여

```bash
adb shell install -g PATH_TO_APK_FILE
```

## 참고

[Android에서의 권한  \|  Android Developers](https://developer.android.com/guide/topics/permissions/overview?hl=ko)

[Android 보안 기능  \|  Android 오픈소스 프로젝트  \|  Android Open Source Project](https://source.android.com/docs/security/features?hl=ko)

[앱 권한 선언  \|  Android Developers](https://developer.android.com/training/permissions/declaring?hl=ko&_gl=1*1d8bs9o*_up*MQ)

[런타임 권한 요청  \|  Android Developers](https://developer.android.com/training/permissions/requesting?hl=ko&_gl=1*1vnl602*_up*MQ)