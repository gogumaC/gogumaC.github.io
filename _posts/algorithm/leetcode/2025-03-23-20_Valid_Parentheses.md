---
title: "[Leetcode] 20. Valid Parentheses (C)"
categories: algorithm leetcode
tags: 
    - [c, leetcode, valid_parenthese, stack]
date: 2025-03-23 17:40
last_modified_at: 2025-03-23 17:40
layout: single
toc : ture
toc_sticky : true
---

이번에 푼 문제는 [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/description/) 였다.

간단하게 문제를 요약하면 () , [], {} 이렇게 다양한 괄호문자로 이루어진 char array가 input으로 들어올때 이 괄호가 유효하게 배치되어있는지 확인하여 결과를 반환하는 문제이다.

- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.

유효성에 대한 조건은 위 세가지인데, 예를 들면 "()" 이건 유효하지만 "(]", "(", ")" 이것들은 유효하지 않다는 의미이다.

아마 자료구조를 배운 사람이라면 굉장히 친숙한 문제일것이다.

나도 보자마자 '음 스택문제군' 했다.


## 첫번째 시도 : Stack

정석대로 스택을 구현해서 풀었다.

중간에 문제를 좀 오해해서 이상하게 풀기도 했지만 하여간 크게 어렵지 않은 스택 구현이었다.

```c
typedef struct stack{
    char *arr;
    int top,size;
} Stack;


void init_stack(Stack* st, int size)
{
    char *new_arr = (char*)malloc(size);
    st->top = -1;
    st->size = size;
    st->arr = new_arr;
}

char pop(Stack* st)
{
    if(st->top<0) 
    {
        return '\0';
    }
    char *arr = st->arr;
    char res = arr[st->top--];
    return res;

}

bool push(Stack* st, char value){
    st->top++;
    if(st->top==st->size) return false;
    st->arr[st->top]= value;
    return true;
}

bool find(Stack *st1, char find)
{
    char* arr = st1->arr;
    if(st1->top>=0)
    {
        return find==pop(st1);
    }

    return false;

}


bool isValid(char* s) {
    Stack st;
    init_stack(&st,strlen(s)); //sizeof vs strlen

    for(int i=strlen(s)-1;i>-1;i--)
    {
        char c=s[i];
        bool res = true;
       switch(c)
        {
            case '(':
                res=find(&st,')');
                break;
            case '[':
                res=find(&st,']');
                break;
            case '{':
                res=find(&st,'}');
                break;
            default:
                res=push(&st,c);
        }
        if(!res) return false;
    }
    return st.top==-1;
    
}
```

결과는 아래와 같다.

![](/assets/image/2025-03-22-19-29-16.png)

시간복잡도는 O(n)이었고, 공간복잡도도 O(n)이었다.

통계를 보니 좀더 메모리를 절약해서 구현할 수 있는것 같아서 약간 개선을 해보기로 했다.

## 메모리 사용량 개선 : 메모리 할당 해제😅

진짜 무슨 한 시간동안 메모리를 어떻게 줄여보려고 별걸 다했는데 그냥 메모리 할당 해제하는걸 잊었다..ㅋㅋㅋ

사실 코틀린이나 파이썬같은 high-level의 언어를 사용하다보면 이런 부분을 신경쓰지 않아서 간과하는 경향이 생긴것같다.

오늘 시간은 좀 썼지만 덕분에 다음에는 안잊어버릴것 같다.

![](/assets/image/2025-03-22-23-48-50.png)

```c
#include <stdarg.h>

typedef struct stack{
    char *arr;
    int top,size;
} Stack;


void init_stack(Stack* st, int size)
{
    char *new_arr = (char*)malloc(size);
    st->top = -1;
    st->size = size;
    st->arr = new_arr;
}

char pop(Stack* st)
{
    if(st->top<0) 
    {
        return '\0';
    }
    char *arr = st->arr;
    char res = arr[st->top--];
    return res;

}

bool push(Stack* st, char value){
    if(st->top + 1==st->size) return false;
    st->arr[st->top++]= value;
    return true;
}

bool find(Stack *st1, char find)
{
    char* arr = st1->arr;
    if(st1->top>=0)
    {
        return find==pop(st1);
    }

    return false;

}


bool isValid(char* s) {
    Stack st;
    init_stack(&st,strlen(s)); //sizeof vs strlen

    for(int i=strlen(s)-1;i>-1;i--)
    {
        char c=s[i];
        bool res = true;
       switch(c)
        {
            case '(':
                res=find(&st,')');
                break;
            case '[':
                res=find(&st,']');
                break;
            case '{':
                res=find(&st,'}');
                break;
            default:
                res=push(&st,c);
        }
        if(!res) return false;
    }

    free(st.arr); // ‼️‼️‼️
    return st.top==-1;
    
}
```


오랜만에 C를 다시 보면서 느끼는건데 정말 재밌는 언어인것 같다.

못하는것도 많고 불편한 부분이 많지만 그 부분이 의외로 재밌어지는 부분인것 같아서 요즘 즐겁게 공부하는 중이다.

여러모로 바빠서 공부하기 힘들긴 하지만 그래도 계속 잘 해봐야겠다😂

