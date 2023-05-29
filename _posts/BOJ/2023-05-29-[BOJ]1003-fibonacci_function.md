---
title: "[BOJ]1003 피보나치 함수 (java,kotlin)"
categories: BOJ
excerpt : "1003. 피보나치 함수"
tags:
    - [Beakjoon,algorithm,kotlin,java,DP,pair]
date : 2023-05-29
last_modified_at: 2023-05-29
toc : ture
toc_sticky : true
---
## ❔문제❔

[1003. 피보나치 함수](https://www.acmicpc.net/problem/1003)

## 🙌Solution (java)🙌

- 처음에는 그냥 재귀함수만 사용해서 피보나치 수열을 계산하며 fibonacci(0), fibonacci(1)이 나올때마다 zeroCount, oneCount를 하나씩 올려가며 숫자를 셈 → 시간초과
- 시간을 줄이기 위해 규칙을 찾아보니 fibonacci(n)에서 fibonacci(1)이 호출되는 횟수는 fibonacci(n-1),fibonacci(n-2)에서 fibonacci(1)이 호출되는 횟수를 합한것과 같음 ( fibonacci(0)도 마찬가지)
    
    $$
    fibonacci(n).one=fibonacci(n-1).one+fibonacci(n-2).one
    $$
    
- 여기에 시간초과를 줄이기 위해 동적 프로그래밍 기법을 사용해 재귀함수를 사용하되 이미 계산된 값이라면 계산하지 않고 넘어가도록 처리함 (fiboMark로 이미 계산된 부분을 구분)

```java
import java.io.*;

public class S3_1003_fibonacci_function {

		
    static int[] fiboZero=new int[41];
    static int[] fiboOne=new int[41];
    static boolean[] fiboMark=new boolean[41];

    public static void main(String[] args) throws IOException {

        BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw=new BufferedWriter(new OutputStreamWriter(System.out));

        int n=Integer.parseInt(br.readLine());

        fiboZero[0]=1;
        fiboZero[1]=0;
        fiboOne[0]=0;
        fiboOne[1]=1;
        fiboMark[0]=true;
        fiboMark[1]=true;

        for(int i=0;i<n;i++){
            int input=Integer.parseInt(br.readLine());
            fibonacci(input);
            bw.write(fiboZero[input]+" "+fiboOne[input]+"\n");
        }

        bw.flush();
    }

    static void fibonacci(int n){

        if(!fiboMark[n]) {
            fiboMark[n]=true;
            fibonacci(n-2);
            fibonacci(n-1);
            fiboOne[n]=fiboOne[n-1]+fiboOne[n-2];
            fiboZero[n]=fiboZero[n-1]+fiboZero[n-2];

        }

    }

}
```

## 🔠Language Change (kotlin)🔠

- 코틀린으로 코드를 다시 짜려니 위에서 FiboZero,FiboOne으로 두개 배열을 사용한것을 List<Pair>로 하나로 만드려고 했음 → 근데 코틀린에서 제공하는 Pair, Triple은 read-Only라서 한번 초기화 해두면 덮어씌우기가 안됨!
- 그래서 새로 데이터 클래스를 만들어서 하나의 배열에 피보나치 함수에서 계산된 fibonacci(1),(0)의 호출 횟수를 저장
    
    → FiboZeroOne(zeroCount,oneCount)
    
- 전체적인 알고리즘은 위의 자바 코드와 같이 DP 사용함.

```kotlin
import java.io.BufferedReader
import java.io.BufferedWriter
import java.io.InputStreamReader
import java.io.OutputStreamWriter

private data class FiboZeroOne(var zeroCount:Int=0,var oneCount:Int=0)
private var fibos=MutableList(41){FiboZeroOne()}
private val fiboMark=MutableList(41){false}

fun main(){

    val br=BufferedReader(InputStreamReader(System.`in`))
    val bw= BufferedWriter(OutputStreamWriter(System.out));

    val n=br.readLine().toInt()

    fibos[0].zeroCount=1
    fibos[0].oneCount=0
    fibos[1].zeroCount=0
    fibos[1].oneCount=1

    fiboMark[0]=true
    fiboMark[1]=true

    for(i in 0 until n){
        val input=br.readLine().toInt()
        getFibo(input)
        bw.write("${fibos[input].zeroCount} ${fibos[input].oneCount}\n")
    }
    bw.flush()
}

fun getFibo(n:Int){
    if(!fiboMark[n]){
        fiboMark[n]=true;
        getFibo(n-1)
        getFibo(n-2)
        fibos[n].zeroCount=fibos[n-1].zeroCount+fibos[n-2].zeroCount
        fibos[n].oneCount=fibos[n-1].oneCount+fibos[n-2].oneCount
    }

}
```

## 🚀Advanced🚀

- 다른 코드를 보니 입력 범위가 작은 문제라서 미리 피보나치 수열을 모두 구해두는 방법도 좋은 것 같다.
- 자바는 항상 입출력에 신경이 많이 쓰이는데 출력 문자열을 만들때 stringBuilder를 사용하는게 더 빠르다고 한다.
    - BufferedWrite는 문자 단위 출력을 위해 설계되어 문자열 처리에 최적화 되어있지 않음
    - StringBuilder는 가변크기의 문자열을 효율적으로 처리하기 위한 클래스이므로 문자열의 결합, 수정, 추가작업이 훨씬 빠름.
- 따라서 출력을 빠르게 하려면 StringBuilder로 문자열 만들고 System.out으로 한번에 출력하면 좋다!

---

## 참고

[BufferedWriter , StringBuilder비교](https://chb2005.tistory.com/73)