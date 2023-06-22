---
title: "[BOJ]1697 숨바꼭질(Catch that cow)🐮 (kotlin,java)"
categories: algorithm BOJ
excerpt : "1697 숨바꼭질(Catch that cow)🐮"
tags:
    - [Beakjoon,BOJ,'1463',algorithm,kotlin,java,DFS,DP]
date : 2023-06-22
last_modified_at: 2023-06-22
toc : ture
toc_sticky : true
---

## ❔문제❔

[1697.숨바꼭질](https://www.acmicpc.net/problem/1697)

## 🙌Solution🙌

처음 문제를 봤을때는 백트래킹 문제인줄 알고 백트래킹으로 열심히 풀었는데 시간초과가 났다.

계속 백트래킹으로 도전하다가 결국 문제 분류를 봤는데 BFS문제였다..ㅎ

### Try1) ~~BFS로 풀이 + 백트래킹~~

처음에는 수빈의 위치인 n을 기준으로 bfs를 했는데 시간 초과에 걸렸다..

시간을 줄일 수 있는 방법에 대해 생각하다가 처음에 생각했던 백트래킹을 적용하면 연산이 좀 빨라지지 않을까 해서 적용해봤는데 생각보다 빠르지 않았던 것 같다..ㅎ

결국 이것도 시간초과를 받았다ㅠㅠ

```kotlin
fun bfs(n:Int,k:Int):Int{

    val queue=mutableListOf<Pair<Int,Int>>()//depth, n

    var time=0
    queue.add(0 to k)

    while(!queue.isEmpty()){

       // val mark=Array<Boolean>(k*2){false}
        val current=queue.first()

        queue.removeFirst()

        if(current.second==n){
            time=current.first
            break
        }
        else{
            if(current.second>n){
                if(current.second%2==0) {
                    queue.add(current.first + 1 to current.second / 2)
                }
                    queue.add(current.first+1 to current.second+1)
                    queue.add(current.first+1 to current.second-1)

            }else{
                queue.add(current.first+1 to current.second+1)
            }
        }
    }
    return time
}
```

### Try2) BFS + 중복검사

결국 위에서 잔뜩 뻘짓을 하다가 못 풀어서 구글링을 해서 풀이를 하게 되었다.

BFS에 중복 검사를 같이 해서 필요 없는 중복 연산을 줄이는 방식으로 연산 시간을 줄였다.

첫 번째 시도에서 중복 검사를 시도해보기도 했었는데 백트래킹을 하면서 하려고 하니까 자꾸 헷갈려서 그냥 n 부터 검사하는 걸로 수정했다.

주의해야 하는 부분은 n>k일 때이다! 나는 처음에 이 부분을 처리 안 해두고 ArrayIndexOutOfBounds가 나오니까 로직에 문제가 있는 줄 알고 괜히 이것저것 고치면서 30분을 날렸다.ㅜ

```kotlin
fun bfs2(n:Int,k:Int):Int{

    if(n<k){
        val mark=Array(k*2+1){false}
        val dist=Array(k*2+1){0}
        val queue= mutableListOf<Int>()
        queue.add(n)
        mark[n]=true

        while(queue.isNotEmpty()){
            val current=queue.first()
            queue.removeFirst()

            if(current==k) break;

            if(current*2<dist.size&&!mark[current*2]) {
                queue.add(current * 2)
                dist[current*2]=dist[current]+1
                mark[current*2]=true
            }
            if(current>0&&!mark[current-1]) {
                queue.add(current - 1)
                dist[current-1]=dist[current]+1
                mark[current-1]=true
            }
            if(current+1<dist.size&&!mark[current+1]) {
                queue.add(current + 1)
                dist[current+1]=dist[current]+1
                mark[current+1]=true
            }
        }

        return dist[k]
    }else return n-k

}
```

## 🔠Language Change(java)🔠

자바로 다시 코드 짜는 게 귀찮긴 한데 플로우가 한번 정리되는 느낌이라서 좋다!

```kotlin
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.Queue;

public class S1_1697_catch_that_cow {

    public static void main(String[] args) throws IOException {

        BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
        StringBuilder builder=new StringBuilder();

        String[] input=br.readLine().split(" ");
        int n=Integer.parseInt(input[0]);
        int k=Integer.parseInt(input[1]);

        builder.append(bfs(n,k));
        System.out.println(builder);

    }

    static int bfs(int n,int k){
        if(n<k){
            Queue<Integer> queue=new LinkedList<>();
            int[] dist=new int[k*2+1];
            boolean[] mark=new boolean[k*2+1];

            dist[n]=0;
            mark[n]=true;
            queue.add(n);

            while(!queue.isEmpty()){

                int current=queue.peek();
                queue.remove();

                if(current==k)break;
                if(current*2<dist.length&&!mark[current*2]){
                    queue.add(current*2);
                    mark[current*2]=true;
                    dist[current*2]=dist[current]+1;
                }
                if(current+1<dist.length&&!mark[current+1]){
                    queue.add(current+1);
                    mark[current+1]=true;
                    dist[current+1]=dist[current]+1;
                }
                if(current>0&&!mark[current-1]){
                    queue.add(current-1);
                    mark[current-1]=true;
                    dist[current-1]=dist[current]+1;
                }

            }
            return dist[k];
        }else return n-k;

    }

}
```

## 🚀Advanced🚀

\[kotlin\]

- IntArray를 사용하면 초기화 하지 않고 크기만 있는 배열을 선언할 수 있다.
    
    ```kotlin
    IntArray(10)
    ```
    
    - 흠.. 초기화 안하고 사용하면 실행시간이 짧아질 줄 알았는데 왠지 좀 늘어났다.. (780ms→784ms)
    - BooleanArray도 있길래 이것도 적용하면 더 늘어난다(780ms→796ms)
    - GPT말로는 IntArray가 객체를 박싱하지 않아서 메모리 공간과 시간적 측면에서 효율적이라고 하는데 특정 상황(컴파일러,캐시효과,테스트환경)에 따라 결과가 다를 수 있다고 한다.
    - 확실히 메모리는 박싱을 안하는 IntArray가 덜 쓰는 것 같다(27632kb→23960kb)
    - 시간 측면은 나중에 또 비교해 볼 일이 있으면 한번 더 확인해 봐야겠다.
- 헉 나름 어느 정도는 코틀린을 잘 쓰고 있는 줄 알았는데 생각보다 현실에 안주해 있었던 것 같다.. 
더 여러가지 방법으로 코드를 짤 수 있게 문법공부를 틈틈히 해야겠다!
- 큐를 list로 만들지 않고 front, real로 인덱싱하면서 알고리즘을 짤 수 도 있다.