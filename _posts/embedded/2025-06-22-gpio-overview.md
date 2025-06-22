---
title: "[Embedded] GPIO Overview"
categories: embedded
tags:
    - [GPIO, embedded, LED]
date : 2025-06-22 18:25
last_modified_at: 2025-06-22 18:25
toc : true
toc_sticky : true
excerpt : GPIO 개요와 간단한 LED 예제
---

> NOTE : 공부하는겸 적은거라 부정확한 정보가 있을 수 있다.


## GPIO (General-Purpose Input/Ouput)

GPIO가 뭐냐고 하면 그냥 내가 맘대로 여러 목적으로 쓸 수 있는 범용 핀이다.

## GPIO 핀 설정 과정

1. GPIO핀에 clock 인가
2. MODER레지스터를 통해 어떤 모드로 사용할건지 설정
3. 사용


## GPIO 연습 : 보드의 LED1 불 켜고 끄기

엄청 간단한 시스템을 만들어서 GPIO가 어떻게 동작하는지 확인해봤다.

이번에는 보통 처음 배울때 많이 하는 보드 LED 불 켜고 끄기를 해봤다.

### GPIO 핀 찾기

GPIO를 설정하기 위해서는 해당 LED가 어떤 핀을 사용하는지 알아야한다.

나는 연습용 보드로 stm32 uncleo f767zi인가 하는 보드를 쓰고있는데 이 보드의 경우에는 LED 핀 맵핑 정보를 **User Manual**에서 찾을 수 있었다.

![](/assets/image/2025-04-14-22-55-56.png)

여기서 보면 LD1은 PB0에 연결되어있다고 나와있으니 내가 제어해야하는 GPIO 핀이 PB0라는것을 확인했다.

이 다음 단계에서 해당 핀을 제어하기 위한 작업을 이어서 진행한다.


### GPIO핀에 clock인가

Clock을 인가하기 위해서는 해당 GPIO핀이 어떤 버스에 연결되어있는지 알아야한다.

보통 메모리 주소 모아둔 Reference sheet에서 GPIO레지스터 맵핑된 부분을 보면 버스가 같이 나와있다.

아래 사진을 보면 GPIO가 AHB1버스에 연결되어있음을 알 수 있다.

![](/assets/image/2025-04-14-22-18-35.png)


메뉴얼을 보면 AHB1버스에 RCC레지스터가 0x40023800~xxx 주소에 위치해 있는것을 알 수 있다.

이어서 RCC register map을 확인해보면 이런식으로 0x30 offset에 GPIOB의 clock을 인가하는 GPIOBEN에 대한 정보가 나와있다.

여기서 보면 0x30 offset 주소의 두번째 비트를 통해 이를 제어할 수 있다.

cf) 참고로 RCC 레지스터의 RCC는 Reset and Clock Control의 약자로, 해당 버스에 연결된 핀의 reset과 clock을 제어하는 레지스터집합이다.

![](/assets/image/2025-04-14-22-32-13.png)

필요한 주소를 알았으면 아래와 같이 해당 핀에 클럭을 인가시킬수 있다.

```c
#define RCC_BASE        0x40023800UL
#define RCC_AHB1ENR     (*(volatile uint32_t*)(RCC_BASE + 0x30))

// GPIOB 클럭 인가
RCC_AHB1ENR |= (1 << 1); // 1번 비트가 GPIOB

```

### 모드 설정

이번에는 GPIO register map을 확인한다.
그 전에 메모리 맵에서 GPIOB의 base주소가 0x40020400이라는걸 확인한다.

![](/assets/image/2025-04-14-23-01-10.png)

그리고 GPIO register map을 보면 offset 0x00에 MODER레지스터가 있다. MODER레지스터에서는 해당 GPIO 그룹의 핀 모드를 각각 2비트를 활용해 설정한다.

그리고 GPIOB_MODER레지스터를 보면 해당 레지스터의 0,1번째 비트로 PB0 핀의 MODE를 설정함을 알 수있다.

모드에 대한 설정값은 다음과 같다.

00 : Input mode
01 : General purpose output mode
10 : Alternate function mode
11 : Analog mode

![](/assets/image/2025-04-14-23-13-15.png)

![](/assets/image/2025-04-14-23-06-06.png)

### input(00)

input은 GPIO영역에서 IDR레지스터를 읽어서 LOW, HIGH를 구분할 수 있다.

![](/assets/image/2025-04-20-18-20-37.png)

### Output(01)

output의 경우에는 GPIO레지스터 영역에서 ODR(Output Data Register)영역에 출력으로 설정할 값을 써 넣으면 된다.

![](/assets/image/2025-04-20-17-07-12.png)

> NOTE : ODR대신 BSRR레지스터를 사용하는게 더 권장되는 방법이라고 한다.

다만 출력 결과는 핀이 연결된 회로가 push-pull상태인지 혹은 open-drain상태인지에 따라 달라진다.

ODR|push-pull|open-drain
---|---|---
0 | LOW | LOW
1 | HIGH | HIGH-Z (floating state) / HIGH(pull-up 저항있는 경우)



이 두 방법에 대해서는 사실 좀더 여러 내용이 있지만 길어질것 같아서 다음에 다시 정리하려고한다.

### Alternate function mode(AF) (10)

이건 그냥 GPIO 핀을 주변장치 기능(USART, SPI 등)으로 사용하는 모드이다.

이 모드로 설정한 후에는 관련된 다른 레지스터를 통해 해당 핀의 구체적 기능을 지정해 주어야한다.


### Analog(11)

이건 GPIO 핀에 입력으로 들어오는 값을 아날로그 형식으로 받기 위해 있는 모드이다.

이게 따로 있는 이유는 디지털 회로에서는 기본적으로 Schmitt trigger 구조 때문에 애매한 전압도 강제로 0이나 1로 판단하게된다.

따라서 이러한 디지털 회로가 연결되어있으면 제대로된 아날로그값을 얻을 수 없기때문에 디지털 회로와의 연결을 open시키고, ADC회로와 연결하기 위해서 따로 모드를 구분한다.


## reference

- STM32 manual
- [https://idsn.tistory.com/50](https://idsn.tistory.com/50)


## 주저리

임베디드 공부를 진짜 오랜만에 다시하고있는데 공부 난이도가 진짜 높은것 같다.

내용이 어렵다기 보다는 정보를 찾기가 정말 어렵다. (특히 한국어 자료는..)

그래서 이렇게 정리하면서 스스로 틀을 잡아가는게 정말 중요하다고 느끼고 있다.

앞으로도 열심히 정리하고 꾸준히 회고해야겠다.

