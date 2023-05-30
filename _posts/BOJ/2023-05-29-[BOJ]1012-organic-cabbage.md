---
title: "[BOJ]1012 유기농 배추🥬 (java,kotlin)"
categories: BOJ
excerpt : "1003. 유기농 배추🥬"
tags:
    - [Beakjoon,BOJ,'1012',algorithm,kotlin,java,DFS,BFS]
date : 2023-05-29
last_modified_at: 2023-05-29
toc : ture
toc_sticky : true
---
## ❔문제❔

[1012. 유기농 배추](https://www.acmicpc.net/problem/1012) 🥬

## 🙌Solution(java)🙌

- 요즘 이런 부류의 문제를 많이 마주치는데, 많이 보다 보니 이제 처음보다는 좀 덜 겁먹는 느낌이다. 역시 꾸준히 많이 풀어보는게 답인것같다!🙂
- 어쨌든 이문제를 처음 딱 봤을때 dfs로 풀면 되겠다고 생각했다.
- 배추밭을 배열로 만들고 빈곳을 0 배추를 1로 표현한 후 dfs를 통해 센곳은 2로 값을 바꾸어 마킹했다.
- dfs는 시작점 x,y를 기준으로 상하좌우로 재귀를 돌았다.
- 이번에는 저번 문제에서 알게된 출력 방법인 StringBuilder를 사용해 출력속도를 높여보았다.

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {

    static int[][] field;
    static int count=0;
    static int m=0;
    static int n=0;
    public static void main(String[] args) throws IOException {

        BufferedReader br=new BufferedReader(new InputStreamReader(System.in));

        int test_case=Integer.parseInt(br.readLine());
        StringBuilder builder=new StringBuilder();
        for(int T=0;T<test_case;T++){
            count=0;
            String[] input= br.readLine().split(" ");
            m=Integer.parseInt(input[0]);
            n=Integer.parseInt(input[1]);
            int cabbageCount=Integer.parseInt(input[2]);

            field=new int[m][n];

            for(int i=0;i<cabbageCount;i++){
                String[] pos=br.readLine().split(" ");
                int x=Integer.parseInt(pos[0]);
                int y=Integer.parseInt(pos[1]);
                field[x][y]=1;

            }

            for(int i=0;i<m;i++){
                for(int j=0;j<n;j++){
                    if(field[i][j]==1) {
                        count++;
                        dfs(i,j);
                    }
                }
            }

            builder.append(count+"\n");

        }
        System.out.print(builder);
    }

    static void dfs(int x, int y){
        field[x][y]=2;
        if(x>0&&field[x-1][y]==1){
            dfs(x-1,y);
        }
        if(y>0&&field[x][y-1]==1){
            dfs(x,y-1);
        }
        if(x<m-1&&field[x+1][y]==1){
            dfs(x+1,y);
        }
        if(y<n-1&&field[x][y+1]==1){
            dfs(x,y+1);
        }
    }
}
```

## 🔠Language Change (kotlin)🔠

```kotlin
import java.io.BufferedReader
import java.io.InputStreamReader

private var field= mutableListOf<MutableList<Int>>()
private var count=0
private var M=0
private var N=0
fun main(){

    val br= BufferedReader(InputStreamReader(System.`in`))
    val builder=StringBuilder()

    val testCase=br.readLine().toInt()

    for(T in 0 until testCase){
        count=0;
        val (m,n,cabbageCount)= br.readLine().split(" ").map{it.toInt()}
        M=m
        N=n
        field= MutableList(m){MutableList(n){0} }
        for(i in 0 until cabbageCount){
            val (x,y)=br.readLine().split(" ").map{it.toInt()}
            field[x][y]=1
        }

        for(i in 0 until m){
            for(j in 0 until n){
                if(field[i][j]==1){
                    count++
                    dfs(i,j)
                }
            }
        }
        builder.append("$count\n")
    }
    print(builder)

}

fun dfs(x:Int,y:Int){
    field[x][y]=2
    if(x>0&&field[x-1][y]==1)dfs(x-1,y)
    if(x<M-1&&field[x+1][y]==1)dfs(x+1,y)
    if(y>0&&field[x][y-1]==1)dfs(x,y-1)
    if(y<N-1&&field[x][y+1]==1)dfs(x,y+1)
}
```

## 🚀Advanced🚀

- 알고 보니 이런 유형의 탐색 문제는 bfs로도 풀 수 있었다!
- bfs는 구현 해 본지 좀 돼서 연습할 겸 자바로만 다시 짜봤다.
- 결론적으로 bfs가 실행 시간은 같았지만 재귀를 하지 않아서 메모리를 조금덜 사용했다.
    
    
     구분 | DFS | BFS 
     --- | --- | --- 
     시간(ms) | 192 | 192 
     메모리(KB) | 18012 | 17448 |
- bfs를 구현할 때 스택을 사용하면 된다는게 기억이 안 나서 좀 헤맸다.<br> 다음에는 잘 기억해서 빠릿빠릿하게 풀어보자!⚡

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Stack;

public class Main {

    static int[][] field;
    static int count=0;
    static int m=0;
    static int n=0;
    public static void main(String[] args) throws IOException {

        BufferedReader br=new BufferedReader(new InputStreamReader(System.in));

        int test_case=Integer.parseInt(br.readLine());
        StringBuilder builder=new StringBuilder();
        for(int T=0;T<test_case;T++){
            count=0;
            String[] input= br.readLine().split(" ");
            m=Integer.parseInt(input[0]);
            n=Integer.parseInt(input[1]);
            int cabbageCount=Integer.parseInt(input[2]);

            field=new int[m][n];

            for(int i=0;i<cabbageCount;i++){
                String[] pos=br.readLine().split(" ");
                int x=Integer.parseInt(pos[0]);
                int y=Integer.parseInt(pos[1]);
                field[x][y]=1;

            }

            for(int i=0;i<m;i++){
                for(int j=0;j<n;j++){
                    if(field[i][j]==1) {
                        count++;
                        //dfs(i,j);
                        bfs(i,j);
                    }
                }
            }

            builder.append(count+"\n");

        }
        System.out.print(builder);
    }

    static void bfs(int startX, int startY){
				//확인한 노드를 담아둘 스택
        Stack<int[]> stack= new Stack<>();
        field[startX][startY]=2;
        stack.push(new int[]{startX,startY});
        int x=startX;
        int y=startY;
        while(!stack.empty()){

            if(x>0&&field[x-1][y]==1){
                stack.push(new int[]{x-1,y});
                field[x-1][y]=2;
            }
            if(x<m-1&&field[x+1][y]==1){
                stack.push(new int[]{x+1,y});
                field[x+1][y]=2;
            }
            if(y>0&&field[x][y-1]==1){
                stack.push(new int[]{x,y-1});
                field[x][y-1]=2;
            }
            if(y<n-1&&field[x][y+1]==1){
                stack.push(new int[]{x,y+1});
                field[x][y+1]=2;
            }

            int[] next=stack.pop();
            x=next[0];
            y=next[1];
        }
    }
}

```