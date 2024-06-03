---
title: "yml로 깃허브 템플릿 제작하기"
categories: tools git_github
tags:
    - template
    - github
    - issue
    - PR
date : 2024-06-03 13:50
last_modified_at: 2024-06-03 13:50
toc : ture
toc_sticky : true
---
어쩌다보니 오랜만에 깃헙 이슈 템플릿을 만들게 되었다.

오랜만에 하다보니 완전 잊어버려서 다시 처음부터 사용법을 공부했는데 재미있는 템플릿 제작법이 있어서 기록해두려고 한다.

기존에는 markdown 형식으로 깃헙 템플릿을 제작하였다.

이 방법은 자유도가 높다는 장점이 있었지만, 이런 부분이 오히려 불편함으로 다가올때도 많았던 것 같다.

이번에 배운 방법은 yml 파일로 깃헙 템플릿을 제작하는 방법이다.

공식 사이트에서 보면 아직 beta버전이라서 바뀔 수도 있다고 하고, preview를 통해 바로바로 렌더링 된 템플릿을 보지 못하는게 불편하지만,만들어진 템플릿이 통일성있고 유효성 체크 등 다양한 기능에 꽤 흥미가 생겨서 그냥 한번 써보기로 했다.

+) yml에 대해 잘 모른다면 [이 문서](https://learnxinyminutes.com/docs/yaml/)를 한 번 읽고 오는걸 추천한다.

## 1. 빈 템플릿 파일 만들기

깃헙 템플릿은 모두 .github 폴더에 들어간다.

나는 이슈 템플릿을 만들어야 하므로 `.github/ISSUE_TEMPLATE/bug-template.yml` 파일을 만들었다.

(PR템플릿의 경우 `.github/PULL_REQUEST_TEMPLATE/***.yml`)

또, 만약 여러 템플릿이 있을 경우, 템플릿 생성시 보여지는 목차는 템플릿 파일의 이름 순으로 정렬되므로 원하는 순서가 따로 있다면 템플릿 파일 이름 앞에 `01-bug-template.yml`과 같이 숫자를 붙이는 것을 권장한다.

+) yml파일이 md보다 먼저 나온다

+) 마크다운 템플릿의 경우 템플릿 하나만 사용시 `.github/issue_template.md`로 적용하면 자동적용 됐지만 yml은 안되는것 같다.
yml에 적은 코드가 그대로 텍스트로 적혀 들어간다.

## 2. [템플릿 구조](https://docs.github.com/ko/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)

템플릿 파일은 크게 다음과 같은 key들로 구성된다.

- `name`(*) : 템플릿 이름 설정
- `description`(*) : 템플릿에 대한 설명
- `title` : 이슈의 default 제목
- `body`(*) : 배열로 템플릿 내용 정의 (아래서 자세히 다룸)
- `labels` : 이슈 라벨 설정
- `assignees` : 이슈 담당자 설정
- `projects` : 이슈의 프로젝트 설정

<img src="/assets/image/2024-06-02-18-59-17.png" width=500/>

<img src="/assets/image/2024-06-03-11-28-15.png" width=500/>

yml파일에서는 아래와 같이 나타낼 수 있다.

```yml
name: Bug Report # 템플릿 이름(필수)
description: File a bug report # 템플릿 설명(필수)
title: "[Bug]: " # 이슈나 PR의 제목 템플릿
labels: ["bug"] # 라벨 설정
project: ["gogumac-org/1","gogumac-org/44"] #프로젝트 설정, PROJECT-OWNER/PROJECT-NUMBER
assignees: 
    - gogumac #위처럼 ["gogumac"] 이렇게도 쓸 수 있음
body: #템플릿 내용(필수)
    ...
```

## 3. [템플릿 내용 구성하기 : `body` 구성하기](https://docs.github.com/ko/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema)

템플릿 내용은 `body` 키의 value에 배열 형태로 추가하여 정의할 수 있다.

`body`의 하위 키는 다음과 같다.
- `type`(*) : 어떤 종류의 입력을 받을 것인지 설정, type에 따라 해당 블록의 필요한 key의 종류가 달라진다.
- `attributes`(*) : 해당 type의 블록의 세부 설정(title,placeholder, value 등)
- `id` : 해당 템플릿에서 해당 블록을 구분하는 id (type이 markdown인 경우에는 X)
- `validations` : 유효성 검사 설정 ex) required(필수항목) 설정 등

```yml
body:
    - type: textarea
      id: bug-description
      attributes: #...
      validations: #...
    
    - type: markdown
      attributes: #...

```

### `type`

템플릿 내용에 넣을 수 있는 구성 요소는 아래와 같다.

type|설명|이미지
--|--|--
`textarea`|마크다운 형식 입력|<img src="/assets/image/2024-06-03-10-57-22.png" width=400>
`input`|한 줄 텍스트 입력|<img src="/assets/image/2024-06-03-10-56-09.png" width=300>
`checkboxes`|체크박스|<img src="/assets/image/2024-06-03-10-57-59.png" width=300>
`dropdown`|드롭다운 메뉴|<img src="/assets/image/2024-06-03-10-59-39.png" width=300>
`markdown`|마크다운 형식으로 템플릿 구성<br>입력이 필요없는 요소를 넣고싶을 때 사용|<img src="/assets/image/2024-06-03-10-54-41.png" width=300>


### `attributes`

`attributes`의 경우 해당 요소의 `type`에 따라 들어가야할 key 값이 달라진다.

이 부분은 다 적기는 귀찮고 크게 어려운 부분도 아니라서 공통적으로 많이 쓰이는 것과 특이한 경우만 적어두려고 한다.

자세한 내용은 [공식문서](https://docs.github.com/ko/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#markdown)에 정리가 잘 되어있다.

**1. markdown의 경우**

셋 중 가장 형태가 다른 경우는 마크다운이다.

markdown의 attributes는 value딱 하나로 문자열 값으로 마크다운 문법을 입력해주면된다.

다만 주의할 점은 ***yml에서 #는 주석기호로 사용되기 때문에 이러한 문법을 사용하기 위해서는 ""로 해당 문자열을 감싸야한다.***

+) 추가로 |(파이프라인)을 사용하면 따옴표("") 없이도 여러줄 입력을 처리할 수 있다.

```yml
 - type: markdown
   attributes:
       value: |
           line1
           line2
           line3
```

<br>

**2. 공통으로 많이 사용되는 attributes key**

대충 위에 이미지를 보면 알겠지만 공통되는 부분이 몇몇 부분 보인다.

![](/assets/image/2024-06-03-11-14-51.png)

key|설명
---|---
`label`| 해당 요소를 간단히 설명하는 라벨(제목)
`description`| 해당 요소에 대한 설명
`placeholder`| 입력창의 hint
`value` | 기본으로 입력되어있는 값

사실 아래 두 key는 텍스트 입력 요소에 조금 치우친것 같지만 이래저래 쓰다보면 아무래도 텍스트입력을 많이 써서 알아두면 좋은 것 같다.


### `validation`

이거는 아직 필수 요소로 지정할지 정도 밖에 지원을 하지 않는데 추후에 더 다양한 기능이 추가되지 않을까 예상해 보고있다.

```yml
- type: input
  attributes: #...
  validation: 
    required: true #해당 요소가 필수 입력 요소로 설정됨
```


## 4. 템플릿 selector 관리: config.yml

템플릿을 사용할 경우 'new issue' 버튼을 누르면 아래와 같은 템플릿 selector가 나온다.

<img src="/assets/image/2024-06-03-11-46-50.png" width=500>

사실 그냥 자동으로 만들어지는 템플릿 selector도 나쁘지 않지만 config.yml을 활용하면 이를 좀더 다양하게 활용할 수 있다.

### 템플릿 강제하기 : `blank_issues_enabled`

<img src="/assets/image/2024-06-03-11-51-53.png" width=500>

깃헙에서는 별다른 설정 없이 템플릿을 적용하면 위와 같이 빈 이슈를 여는 선택지를 제공한다.

config.yml에서는 `blank_issues_enabled: false`를 통해 해당 선택지를 없애고 템플릿 선택을 강제할 수 있다.

```yml
#config.yml

blank_issues_enabled: false
#...
```

위 코드를 추가하면 아래와 같이 `Don't see your issue here? Open a blank issue.` 라는 선택지가 사라짐을 확인할 수 있다.

<img src="/assets/image/2024-06-03-11-54-03.png" width=500>


### 링크 추가 : `contact_links`

<img src="/assets/image/2024-06-03-11-56-28.png" width=500> 

이러한 링크를 추가할때는 `contact_links` key 를 활용할 수 있다.

```yml
#config.yml

#...
contact_links:
    #link1
    - name: GitHub Community Support #링크 이름
      url: https://github.com/orgs/community/discussions #연결 url
      about: Please ask and answer questions here. #링크에 대한 설명
    #link2
    - name: GitHub Security Bug Bounty
      url: https://bounty.github.com/
      about: Please report security vulnerabilities here.

```

