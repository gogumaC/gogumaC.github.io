이거는 블루투스 연결과정도 정리
일단 페어링 안되서 
```
FATAL EXCEPTION: Thread-5
                                                                                                    Process: kr.co.teamfresh.kyb.bluetoothchat, PID: 28912
                                                                                                    java.io.IOException: read failed, socket might closed or timeout, read ret: -1
                                                                                                    	at android.bluetooth.BluetoothSocket.readAll(BluetoothSocket.java:972)
                                                                                                    	at android.bluetooth.BluetoothSocket.readInt(BluetoothSocket.java:986)
                                                                                                    	at android.bluetooth.BluetoothSocket.connect(BluetoothSocket.java:545)
                                                                                                    	at kr.co.teamfresh.kyb.bluetoothchat.bluetooth.BluetoothChatService$ConnectThread.run(BluetoothChatService.kt:218)
```

요런 에러가 나왔음.
페어링 되면 될지 실험중

아니 진짜 말 그대로 다른쪽 소켓을 안열어서 생긴일