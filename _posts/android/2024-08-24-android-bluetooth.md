---
title: "[Android] Bluetooth classic 정리"
categories: android
excerpt : "Android 블루투스 클래식 관련 기본 사항 정리"
tags:
    - [android, bluetooth, bluetooth classic, 블루투스, 블루투스 클래식, permission, 권한]
date : 2024-08-24 13:22
last_modified_at: 2024-08-24 13:22
toc : ture
toc_sticky : true
header:
  overlay_image: /assets/image/2024-08-24-12-50-17.png
  overlay_filter: linear-gradient(rgba(0, 0, 0, 0.5), rgba(217, 217, 217, 0.5))
  image: /assets/image/2024-08-24-12-50-17.png
---

## 개요

- 안드로이드는 블루투스 API를 통해 블루투스 기능을 지원

### 기능

- 주변의 블루투스 기기 검색
- 블루투스 어댑터 쿼리
- RFCOMM채널 설정
- 다른 기기에 연결
- 다른 기기와 데이터 주고받기
- 여러 연결 관리

### 페어링

- 블루투스 지원기기가 서로 통신하기 위해서는 페어링 프로세스를 사용하여 통신 채널을 형성해야한다.
- 페어링 과정
    1. 기기1은 자신을 검색 가능하도록 설정(discoverable)
    2. 기기2는 discovering을 통해 주변의 검색가능한 기기를 탐색
    3. 기기2에서 기기1을 발견하면 기기1로 페어링 요청을 보낼 수 있음
    4. 기기1에서 해당요청을 수락하면 두 기기는 보안키를 교환하고 해당 키를 캐시하며 bonding을 완료함
    5. 세션이 완료되면 페어링 요청을 시작한 기기가 검색가능한 기기에 연결한 채널을 해제
    6. 그러나 이미 키를 교환하여 두 기기는 연결된 상태로 유지되므로 서로 범위내에있고, 두 기기 모두 연결을 삭제하지 않은 경우 다시 연결 가능

### 블루투스 관련권한

- API 31(안드로이드 12) 이상
    
    
    | 권한 | 종류 | 설명 |
    | --- | --- | --- |
    | BLUETOOTH_SCAN | 런타임 | 주변 기기 탐색 기능 활용시 확인 (discovering) |
    | BLUETOOTH_ADVERTISE | 런타임 | 현재 기기를 다른 블루투스에서 탐색할 수 있도록 설정하는 경우 (discoverable 설정) |
    | BLUETOOTH_CONNECT | 런타임 | 이미 페어링된 블루투스와 통신하는 경우 블루투스 활성화할때도 필요 |
    | ACCESS_FINE_LOCATION | 런타임 | 앱에서 탐색 결과를 사용하여 실제 위치를 얻는 경우 |
    
    안드로이드 6.0 (API 레벨 23) 이후부터는 블루투스 기기를 검색하는 작업이 사용자의 위치를 유추할 수 있는 잠재적인 위험이 있다고 간주되어, 위치 권한을 요구한다.
    
    ex) 실제로 도서관에 있는 블루투스 비콘은 사용자가 주변에 있는지 확인하는 목적을 겸하므로 사용자의 물리적 위치를 활용하는 예시이다.
    
    `android:usesPermissionFlags` 속성을 `BLUETOOTH_SCAN` 권한 선언에 추가하고 해당 속성을 `neverForLoaction`으로 설정함으로써 위치를 활용을 하지 않는다는 것을 강하게 주장할 수 있다. 
    다만 이 경우 몇몇 BLE비콘이 스캔되지 않을 수 있다. 

- 안드로이드 11 이하 (API 30 이하)
    
    
    | 권한 | 종류 | 설명 |
    | --- | --- | --- |
    | BLUETEOOTH | 런타임 | classic, ble 통신 수행시 확인. 연결, 연결수락, 데이터 전송 시 필요 |
    | ACCESS_FINE_LOCATION | 런타임 | 기기 탐색시 필요 |


- 기타 권한
    
    | 권한 | 종류 | 설명 |
    | --- | --- | --- |
    | BLUETOOTH_ADMIN | 일반 | 주변 기기 와 페어링을 하거나 블루투스를 켜고 끄는 작업 등 블루투스 설정을 제어할때 (그치만 블루투스 설정을 제어하는 부분은 사용자를 설정으로 보내는 것을 권장하는것같다.) |
    | ACCESS_BACKGROUND_LOCATION | 런타임 | 앱이 서비스를 지원하고 안드로이드 10,11(API 29,30)에서 실행되는 경우 블루투스 기기 검색에 필요 (백그라운드에서 위치 정보를 요청하는 경우) |

### 관련 클래스 및 인터페이스 

- `BluetoothAdapter`
    - 모든 블루투스 상호작용의 진입점 역할
    - 주변기기 스캔, 페어링된 기기 목록 확인, MAC주소를 통해 BluetoothDeivce 인스턴스화, 서버 소켓 생성 등등
    
    ```kotlin
    //onCreate에서 선언
    val bluetoothManager: BluetoothManager = getSystemService(BluetoothManager::class.java)
    val bluetoothAdapter: BluetoothAdapter? = bluetoothManager.getAdapter()
    ```
    
- `BluetoothDevice`
    - 블루투스 기기를 추상화한 클래스
    - `BluetoothSocket`을 활용하여 해당 기기와 연결을 요청 가능
    - 디바이스의 이름, mac주소, class, 연결 상태 등 확인 가능
    - 임의로 인스턴스화 안됨

- `BluetoothSocket`
    - 블루투스 소켓을 활용하기 위한 인터페이스 (TCP `Socket`이랑 비슷)
    - InputStream, OutputStream을 통해 다른 기기와 데이터를 교환하는 연결 요소

- `BluetoothServerSocket`
    - 연결요청을 받아들이기 위한 서버소켓을 나타냄. (TCP의 `ServerSocket`과 비슷)
    - 두 디바이스가 연결되기 위해서 반드시 하나의 디바이스는 이 클래스를 사용하여 서버소켓을 열어야함.
    - 연결요청이 들어오고 해당  요청이 받아들여졌다면 데이터 교환을 위한 `BluetoothSocket`을 반환함.
    

## 블루투스 연결 과정

<br>

### 1. 사전작업

<br>

**블루투스 권한 설정**

- manifest.xml

```xml
<manifest>
    <!-- 안드로이드 11 이하에서 필요한 권한 -->
    <uses-permission android:name="android.permission.BLUETOOTH"
                     android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"
                     android:maxSdkVersion="30" />

    <!-- 주변기기 스캔 기능이 존재할때만 추가
		    만약 스캔 결과를 사용자의 물리적 위치 도출에 사용하지 않는다면 
		    android:usesPermissionFloags="neverForLocation"
		    속성을 추가하여 물리적 위치를 도출하지 않는다는것을 강력하게 선언한다.
          -->
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />

    <!-- 현재 기기를 다른 기기에서 스캔 가능하게(discoverable) 설정할 때만 선언 -->
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />

    <!-- 이미 페어링된 기기와 연결 기능이 사용되는 경우 선언 -->
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

    <!-- 주변 기기 스캔 기능이 존재하고, 해당 스캔 결과를 통해 사용자의 물리적 위치를 도출해내는 경우 선언
			    '나는 스캔만 하면된다' 라면 이 권한을 추가하고 상단 BLUETOOTH_SCAN 권한에 플래그를 추가하면 된다.
     -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    ...
</manifest>
```

- 런타임 권한 요청 (MainActivity.kt)

```kotlin
private lateinit var bluetoothEnableSettingLauncher:ActivityResultLauncher<Intent>

private val bluetoothPermissions = mutableListOf<String>(/*런타임 권한 추가*/)

override fun onCreate(savedInstanceState: Bundle?) {
	...
	
	bluetoothPermissionLauncher =
	            registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { result ->
	                //거부당한 권한 리스트
	                val deniedList = result.filter { !it.value }.map { it.key }
									
	                if (deniedList.isNotEmpty()) {
			                //거부당한 권한중 설명이 필요한 권한과 그렇지 않은 권한을 분리
	                    val map = deniedList.groupBy { permission ->
	                        if (shouldShowRequestPermissionRationale(permission)) "DENIED" else "EXPLAINED"
	                    }
	                    //사용자가 명시적으로 거부버튼을 누른경우 권한에 대한 설명이 필요
	                    map["DENIED"]?.let {
	                        explainBluetoothConnectPermission()
	                    }
	                }
	            }
	     
	 //권한 요청 시작
	requestBluetoothPermission()
            
}      

//블루투스 권한 요청 로직
private fun requestBluetoothPermission() {
    val notGrantedPermissionList = mutableListOf<String>()

    for (permission in bluetoothPermissions) {

        val result = ContextCompat.checkSelfPermission(this, permission)
        if (result == PackageManager.PERMISSION_GRANTED) continue
        notGrantedPermissionList.add(permission)
        if (shouldShowRequestPermissionRationale(permission)) explainBluetoothConnectPermission()

    }
    if (notGrantedPermissionList.isNotEmpty()) {
        bluetoothPermissionLauncher.launch(notGrantedPermissionList.toTypedArray())
  }
}

//사용자에게 권한에 대해 설명
private fun explainBluetoothConnectPermission() {
    Toast.makeText(
        this,
        "실행하기 위해 해당 권한이 필요함을 설명",
        Toast.LENGTH_SHORT
    ).show()
}
		
```

<img src="/assets/image/2024-08-24-12-50-17.png" width=500>

<br>

**블루투스를 필수로 설정하기**

- 이거 해두면 마켓에서 블루투스를 지원하는 기기만 해당 앱을 볼 수 있음

    ```kotlin
    <uses-feature android:name="android.hardware.bluetooth" android:required="true"/>
    ```

<br>

**블루투스 지원 기기인지 확인**

- `<uses-feature … android:required=false/>`인 경우만 필요. (블루투스를 지원하지 않는 기기에서도 해당 어플리케이션을 제공한다는 의미이므로 설정을 확인해야한다.)
- `BluetoothAdapter`가 null인 경우 해당 기기는 블루투스를 지원하지 않는다.

    ```kotlin
    if (bluetoothAdapter == null) {
    // 블루투스를 지원하지 않는 디바이스
    }
    ```

<br>

**블루투스가 활성화 되어있는지 확인 + 활성화 요청**

- 디바이스 블루투스 설정에서 블루투스 사용이 활성화 되어있는지 확인한다.
- `BluetoothAdapter.isEnabled` 가 false이면 비활성화 상태이다
- `ActivityResultLauncher`를 활용하여 블루투스 활성화를 요청할 수 있다.

```kotlin
private lateinit var bluetoothEnableSettingLauncher:ActivityResultLauncher<Intent>
...

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val bluetoothManager: BluetoothManager = getSystemService(BluetoothManager::class.java)
    val bluetoothAdapter: BluetoothAdapter? = bluetoothManager.adapter

    bluetoothEnableSettingLauncher=registerForActivityResult(ActivityResultContracts.StartActivityForResult()){result->
        if (result.resultCode == RESULT_OK) {
            Toast.makeText(this, "Bluetooth enabled", Toast.LENGTH_SHORT).show()
        } else if (result.resultCode == RESULT_CANCELED) {
            Toast.makeText(this, "bluetooth not enable", Toast.LENGTH_SHORT).show()
        }
    }
    setContent {
        PlaygroundForAndroidTheme {
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = MaterialTheme.colorScheme.background
            ) {
...

                //블루투스 활성화 상태 확인 -> 비활성화 상태라면 설정 화면으로 이동
                if (bluetoothAdapter?.isEnabled == false) {
		                val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
		                //BLUETOOTH_CONNECT(api31이상), 또는 BLUETOOTH(api 30이하) 가 허용 안되어있을때 호출하면 터지니까 주의!
										bluetoothEnableLauncher.launch(enableBtIntent)
                }
            }
        }
    }
}
```

<img src="/assets/image/2024-08-24-12-50-41.png" width=500>

<br>

### 2. 블루투스 기기 찾기(discovering,scaning,inquiring)

<br>

**(시작하기 전) 페어링된 기기 쿼리**

discovering을 시작하기 전 이미 페어링 된 기기 목록을 아래와 같이 불러와서 페어링을 원하는 기기가 이미 페어링 되었는지 확인할 수 있다.

```kotlin
val pairedDevices: Set<BluetoothDevice>? = bluetoothAdapter?.bondedDevices
pairedDevices?.forEach { device ->
   val deviceName = device.name
   val deviceHardwareAddress = device.address // MAC address
}
```

<br>

**방법1. [Companion Device Manager API**](https://developer.android.com/develop/connectivity/bluetooth/companion-device-pairing?hl=ko) (CDM API) 활용(권장)**

- Android 8.0 (API 26)이상에서 활용가능


1. manifest.xml에 companion device 설정
    
    ```kotlin
    <uses-feature android:name="android.software.companion_device_setup"/>
    ```
    
2. Device Filter 만들기
    
    ```kotlin
    val deviceFilter: BluetoothDeviceFilter = BluetoothDeviceFilter.Builder()
            // 디바이스 이름이 아래 패턴과 맞는 디바이스만 탐색하도록 필터링
            .setNamePattern(Pattern.compile("My device"))
            //서비스 UUID가 아래 패턴과 일치하는 디바이스만 탐색하도록 필터링
            .addServiceUuid(ParcelUuid(UUID(0x123abcL, -1L)), null)
            .build()
    ```
    
3. AssociationRequest만들기 +  DeviceFilter추가
    
    ```kotlin
    val pairingRequest: AssociationRequest = AssociationRequest.Builder()
            // deviceFilter 추가
            .addDeviceFilter(deviceFilter)
            // 필터에 맞는 디바이스 하나를 찾으면 탐색 중단
            .setSingleDevice(true)
            .build()
    ```
    
4. `deviceManager.associate()`로 디바이스 탐색 및 시스템 다이얼로그 띄우기
    - Android 13 (API 33) 이상 기기
        
        ```kotlin
        val deviceManager =
          requireContext().getSystemService(Context.COMPANION_DEVICE_SERVICE) as CompanionDeviceManager
          
        private lateinit var bluetoothScanLauncher: ActivityResultLauncher<IntentSenderRequest> 
        
        override fun onCreate(){
        	bluetoothScanLauncher = registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) {result->
        	//유저가 페어링 하고 싶은 디바이스 선택
                            Log.d(TAG,"bluetoothScan finish")
                            if(result.resultCode==Activity.RESULT_OK){
                                val device = if (Build.VERSION.SDK_INT >= 33) result.data?.getParcelableExtra(
                                    BluetoothDevice.EXTRA_DEVICE,
                                    BluetoothDevice::class.java
                                ) else result.data?.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                                Log.d(TAG,"Request pairing device name : ${device?.name}")
                                //해당 디바이스에 페어링 요청 
                                device?.createBond()
                            }else{
                                Log.d(TAG,"User cancel")
                            }
        	}
        }
        
        val executor: Executor =  Executor { it.run() }
        
        deviceManager.associate(pairingRequest,
            executor,
            object : CompanionDeviceManager.Callback() {
            // 디바이스 탐색 성공시 호출됨
            override fun onAssociationPending(intentSender: IntentSender) {
        		    // 유저에게 시스템 다이얼로그를 띄워서 원하는 기기를 선택할 수 있게한다.
                val intentSenderRequest = IntentSenderRequest.Builder(intentSender).build()
                        bluetoothScanLauncher.launch(intentSenderRequest)
                }
            }
        
            override fun onAssociationCreated(associationInfo: AssociationInfo) {
                // 연결 생성시 호출됨
            }
        
            override fun onFailure(errorMessage: CharSequence?) {
                // 탐색 실패
             }
        })
        ```
        
    - 안드로이드 12L (API 32) 이하 기기
        
        ```kotlin
        val deviceManager =
              requireContext().getSystemService(Context.COMPANION_DEVICE_SERVICE) as CompanionDeviceManager
              
        private lateinit var bluetoothScanLauncher: ActivityResultLauncher<IntentSenderRequest> 
        
        override fun onCreate(){
        	bluetoothScanLauncher = registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) {result->
        	//유저가 페어링 하고 싶은 디바이스 선택
                            Log.d(TAG,"bluetoothScan finish")
                            if(result.resultCode==Activity.RESULT_OK){
                                val device = if (Build.VERSION.SDK_INT >= 33) result.data?.getParcelableExtra(
                                    BluetoothDevice.EXTRA_DEVICE,
                                    BluetoothDevice::class.java
                                ) else result.data?.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                                Log.d(TAG,"Request pairing device name : ${device?.name}")
                                //해당 디바이스에 페어링 요청 
                                device?.createBond()
                            }else{
                                Log.d(TAG,"User cancel")
                            }
        	}
        }
        
        deviceManager.associate(pairingRequest,
            object : CompanionDeviceManager.Callback() {
                // 디바이스 발견시 호출되고, 사용자에게 시스템 다이얼로그를 띄움
                override fun onDeviceFound(chooserLauncher: IntentSender) {
                    val intentSenderRequest = IntentSenderRequest.Builder(intentSender).build()
                        bluetoothScanLauncher.launch(intentSenderRequest)
                }
        
                override fun onFailure(error: CharSequence?) {
                    // 탐색 실패시 호출
                }
            }, null)
        ```
        
    ❗️ API수준에 따라 특정 API 수준에서는 탐색된 기기가 없다면 콜백 함수가 호출되지 않는다. (안드로이드 12(API31) 수준 테스트기기에서 이 문제를 발견했다.) ( [관련해서 정리한 내용(stackOverflow)](https://stackoverflow.com/questions/77294327/androids-companiondevicemanager-associate-fails-to-find-any-device-when-filte/78884145#78884145) )  

    <img src="/assets/image/2024-08-24-12-50-59.png" width=400>

    <br>

**방법2. 블루투스 어댑터 사용**

1. 검색 당하는 기기에서 discoverable설정
    - 비콘이나 다른 여러 블루투스를 사용하는 기기들과 다르게 안드로이드 기기는 항상 discoverable하지 않다.
    - 따라서 자신의 기기가 다른 사용자에게 검색되고 싶다면 기기를 discoverable하게 설정해주어야한다.
    - 아래 코드를 통해 discoverable 설정을 위한 시스템 다이얼로그를 호출할 수 있다.
    - 변경된 discoverable설정 상태(시스템 다이얼로그 결과)는 `BroadcastReceiver`로 확인가능
    
    ```kotlin
    private lateinit var bluetoothDiscoverableLauncher: ActivityResultLauncher<Intent>
    
    override fun onCreate(){
    
    	bluetoothDiscoverableLauncher =
    	                it.registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {}
    	
    	//discoverable 허용 요청
    	setBluetoothDiscoverable()
    }
    
    fun setBluetoothDiscoverable() {
        val discoverableIntent: Intent =
            Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE).apply {
    		        //탐색 허용시간을 30초로 설정 (default는 2분,최대 1시간까지)
    		        //시간을 0으로 설정 시 항상 검색 가능하므로 주의!!
                putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 30)
            }
        bluetoothScanLauncher.launch(discoverableIntent)
    }
    ```
    

1. 기기 검색 및 검색 결과 확인
    - bluetoothAdapter의 `startDiscovery()` 함수를 통해 주변 기기 탐색을 시작한다.
    - 해당 함수는 비동기적으로 실행되며 일반적으로 12초동안 스캔이 시작된다.
    - 탐색된 기기는 BroadcastReceiver를 통해 확인할 수 있다.
    
    ```kotlin
    val bluetoothManager: BluetoothManager = getSystemService(BluetoothManager::class.java)
    val bluetoothAdapter: BluetoothAdapter? = bluetoothManager.getAdapter()
    
    // 탐색된 결과를 수신하기 위한 브로드캐스트 리시버 생성
    private val receiver = object : BroadcastReceiver() {
    
       override fun onReceive(context: Context, intent: Intent) {
           val action: String = intent.action
           when(action) {
               BluetoothDevice.ACTION_FOUND -> {
                   // 탐색된 기기 정보
                   val device: BluetoothDevice =
                           intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                   val deviceName = device.name
                   val deviceHardwareAddress = device.address // MAC address
               }
           }
       }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
       ...
       // 탐색된 블루투스 기기 정보를 받기 위한 브로드캐스트 필터 생성
       val filter = IntentFilter(BluetoothDevice.ACTION_FOUND)
       // 액티비티에 브로드캐스트 리시버 등록
       registerReceiver(receiver, filter)
       
       ...
       // 원하는 시기에 탐색 시작
       bluetoothAdapter.startDiscovery()
    }
    
    override fun onDestroy() {
       super.onDestroy()
       ...
    
       // 액티비티 종료시 브로드캐스트 리시버 해제!
       unregisterReceiver(receiver)
    }
    ```
    
<br>

### 3. 블루투스 기기 연결

- 블루투스 연결은 서버, 클라이언트 메커니즘이 존재한다.
- 연결과정
    1. 기기 A에서 서버소켓을 열어 연결 요청을 수신 대기한다.
    2. 클라이언트 기기 B에서 블루투스 소켓을 통해 기기A의 서버 소켓에 연결을 요청한다.
    3. 기기A에서 해당 요청을 받아들여 RFCOMM채널이 형성되고 (추가 연결이 없다면) 서버 소켓을 닫는다.
    4. 블루투스 소켓을 활용하여 서로 계속 통신한다.

<br>

**서버 코드**

- `listenUsingRfcommWithServiceRecord(String name,UUID uuid)`를 통해 BluetoothServerSocket을 가져올 수 있다.
    - `name:String` : SDP(Service Discovery Protocol) 데이터 베이스에 쓰이는 이름, 임의로 결정
    - `uuid:UUID(Universally Unique Identifier)` : 연결을 요청하는 클라이언트의 uuid가 해당 uuid와 같아야 연결 수락 가능

```kotlin
private var serverSocket: BluetoothServerSocket? = null
private var connectSocket: BluetoothSocket? = null

private val myUUID =
        ParcelUuid(UUID.fromString("00001101-0000-1000-8000-00805F9B34FB"))
private val NAME = "BluetoothChat" 
    
...
    
//서버 소켓 여는 시점에 추가
CoroutineScope(Dispatchers.Main).launch {
		//서버 소켓 열기
    val res = async { service.openServerSocket() }.await()
    navController.popBackStack()
    if (res) {
        //성공적으로 연결됐을때 UI갱신 등 로직
    } else {
        //연결 실패시 UI갱신 등 로직
    }
}

...

suspend fun openServerSocket() = withContext(Dispatchers.IO) {

        serverSocket?.close()
        connectSocket?.close()

        try {
            serverSocket = bluetoothAdapter.listenUsingRfcommWithServiceRecord(NAME, myUUID.uuid)
            Log.d(TAG, "open ServerSocket : $serverSocket")
            //accept()는 연결될때까지 block 시켰다가 연결시 이후 통신에 필요한 BluetoothSocket을 반환한다.
		        //기본적으로 blocking call이므로 백그라운드 스레드에서 실행해야함
            connectSocket = serverSocket?.accept()
						
						//연결 성공시 로직
            connectSocket?.also {
		            //서버소켓 닫기
                serverSocket?.close()
                val device = it.remoteDevice
                Log.d(TAG, "connect success.\n connected with $device")
								
								/*TODO : 통신
								* 연결 이후 데이터를 주고받는 로직을 여기서 실행 (다음 단계에서 이어짐)
								*/

            }
        } catch (e: IOException) {
            Log.e(TAG, "open ServerSocket fail : $e")
            return@withContext false
        }
        return@withContext true
    }
    
```

<br>

**클라이언트 코드**

- `createRfcommSocketToServiceRecord(UUID)`을 통해 BluetootoSocket가져오기

```kotlin
private var serverSocket: BluetoothServerSocket? = null
private var connectSocket: BluetoothSocket? = null

private val myUUID =
        ParcelUuid(UUID.fromString("00001101-0000-1000-8000-00805F9B34FB"))
private val NAME = "BluetoothChat"

suspend fun requestConnect(address: String) = withContext(Dispatchers.IO) {

        connectSocket?.close()
        serverSocket?.close()
				
				//연결을 원하는 블루투스 기기 호출
        val device = bluetoothAdapter.getRemoteDevice(address)
        //bluetoothSocket가져오기
        connectSocket =
            device.createRfcommSocketToServiceRecord(myUUID.uuid)
            
        try {
		        //connect함수로 연결 요청 시작.
		        //blocking call이므로 백그라운드에서 실행해야함
		        //연결 실패, 또는 타임아웃(12초)시 IOException발생
            connectSocket?.connect()
            _connectedDevice.value = connectSocket?.remoteDevice
            Log.d(TAG, "connect success.\n connected with $device")

            /*TODO : 통신
						* 연결 이후 데이터를 주고받는 로직을 여기서 실행 (다음 단계에서 이어짐)
						*/

        } catch (e: IOException) {
            Log.e(TAG, "connect fail : $e")
            return@withContext false
        }
        
        //async로 호출시 연결 성공,실패에 대한 결과를 반환
        return@withContext true
    }

```

<br>

### 4. 블루투스 데이터 전송

- 연결된 블루투스 소켓의 InputStream, OutputStream 소켓을 통해 연결된 기기와 통신할 수 있다.
- 읽을때는 read(byte[]) 함수, 쓸때는 write(byte[]) 함수를 사용한다.

<br>

**상대 기기가 보낸 데이터를 받기**

```kotlin
//다른 코루틴스코프와 독립적으로 연결을 실행하기 위한 연결용 코루틴스코프 생성
private val connectingScope = CoroutineScope(Job() + Dispatchers.IO)
//하나의 connecting만 유지하려고 할때 해당 job을 저장
//여러개의 job을 관리하려고 한다면 map<String,Job>타입으로 선언 후 저장해서 관리할 수 있음
private var connectingJob:Job?=null

...
//listening을 시작하고 싶은 위치에서 호출
//connectSocket = bluetoothSocket
connectSocket?.{
	//기존에 연결중이었다면 해당 연결 취소
	connectingJob?.cancel()
	//새로운 연결 시작
	connectingJob=connectingScope.launch{ listenMessage(it) }
}

private suspend fun listenMessage(connectSocket: BluetoothSocket) =
        withContext(Dispatchers.IO) {
            var numBytes: Int
            val buffer = ByteArray(1024)
            val inputStream = connectSocket.inputStream

						//무한 루프를 통해 계속해서 메시지 listening
            while (true) {
                numBytes = try {
                    inputStream.read(buffer)
                } catch (e: IOException) {
                    Log.d(TAG, "Input Stream was disconnected", e)
                    break
                }

                if (numBytes > 0) {
                    _messageFlow.emit(String(buffer, 0, numBytes))
                    Log.d(TAG, "listenMessage : $buffer")
                }
            }
        }

override fun onDestroy(owner: LifecycleOwner) {
    activity?.unregisterReceiver(receiver)
    connectingScope.cancel()
}
```

<br>

**상대에게 데이터를 보내기**

```kotlin
fun requestSendMessage(text:String){
	viewModelScope.launch {
	    bluetoothService?.sendMessage(text.toByteArray())
	}
}

...

suspend fun sendMessage(msg: ByteArray) = withContext(Dispatchers.IO) {
    val outputStream = connectSocket?.outputStream
    try {
        outputStream?.write(msg)
    } catch (e: IOException) {
        Log.e(TAG, "Error occurred when sending data", e)
    }
}
```

<br>

### 5. 연결 종료

```kotlin
fun finishConnect(): Boolean { //종료 성공시 true, 실패시 false 반환
    try {
		    //연결작업 종료
		    connectingJob?.cancel()
        connectedDevice.value = null
        //블루투스 소켓 종료
        connectSocket?.close()
    } catch (e: IOException) {
        Log.e(TAG, "Could not close the connect socket", e)
        return false
    }
    return true
}
```

<br>

## 예시

이게 코드랩인가에 블루투스 채팅 어플리케이션 예제가 있었는데 이게 좀 옛날코드라서 실습할겸 다시 만들어봤다.

[BluetoothChat](https://github.com/gogumaC/bluetooth-chat)

이번에 공부하면서 보니까 고칠 부분이 있는것 같아서 조만간 시간나면 수정할 예정이다.

지금은 

- java->kotlink
- Thread->Coroutine,flow
- xml -> Compose

이 정도를 반영해뒀고, 다음으로는 CompanionDeviceManager API로 이전해 볼 생각이다.


## 참고

[Bluetooth overview  \|  Connectivity  \|  Android Developers](https://developer.android.com/develop/connectivity/bluetooth)

[Set up Bluetooth  \|  Connectivity  \|  Android Developers](https://developer.android.com/develop/connectivity/bluetooth/setup)

[Find Bluetooth devices  \|  Connectivity  \|  Android Developers](https://developer.android.com/develop/connectivity/bluetooth/find-bluetooth-devices)

[Connect Bluetooth devices  \|  Connectivity  \|  Android Developers](https://developer.android.com/develop/connectivity/bluetooth/connect-bluetooth-devices)

[Transfer Bluetooth data  \|  Connectivity  \|  Android Developers](https://developer.android.com/develop/connectivity/bluetooth/transfer-data)

[Companion device pairing  \|  Connectivity  \|  Android Developers](https://developer.android.com/develop/connectivity/bluetooth/companion-device-pairing)

[Bluetooth permissions  \|  Connectivity  \|  Android Developers](https://developer.android.com/develop/connectivity/bluetooth/bt-permissions)
