---
title: "Github Action과 Make를 활용한 LinkedIn 자동 포스팅"
excerpt: "그런의미로 세상에서 제일 귀찮은 링크드인 포스팅쓰기를 깃허브 액션과 Make(구 Integromat)라는 자동화 툴을 사용해서 자동화 해보기로 했다."
categories: projects linkedin-auto-posting
tags:
  - [linkedin, auto-posting, 포스팅, githubAction, make, integromat]
date: 2023-10-30 21:41:00
last_modified_at: 2023-10-30 21:41:00
toc: ture
toc_sticky: true
header:
  overlay_image: /assets/image/projects/linkedin-auto-posting/overview.png
  overlay_filter: linear-gradient(rgba(0, 0, 0, 0.5), rgba(217, 217, 217, 0.5))
  image: /assets/image/projects/linkedin-auto-posting/overview.png
---

요즘 왠지 매너리즘 비스무리한 거에 빠져서 만사가 귀찮아지고 있다.

그런의미로 세상에서 제일 귀찮은 링크드인 포스팅쓰기를 깃허브 액션과 Make(구 Integromat)라는 자동화 툴을 사용해서 자동화 해보기로 했다.

처음에는 힘들어 보이는 작업이었지만 자동화 툴을 사용하면서 생각 외로 간단한 작업이 되었다.

[Github - linkedin-auto-posting](https://github.com/gogumaC/linkedin-auto-posting)

[Linkedin - yubin kim](https://www.linkedin.com/in/yubin-kim-067300208/)

<br>

# 👀 개요

전반적인 플로우를 알기쉽게 도식으로 표현해보았다.

나는 아래와 같은 구조로 자동화 작업을 진행했다.

<img src="/assets/image/projects/linkedin-auto-posting/overview.png">

<br>

# 🧗 과정

## 1. Make(Integromat)연결 ✅

사실 처음에는 LinkedIn api를 사용해서 파이썬 스크립트 내에서 자동 포스팅까지 모든 작업을 수행하려고 했다.

그러나 만들어놓고 나니 링크드인의 인증 방식을 파이썬 스크립트 내에서 실행할때 생길 수 있는 보안이슈가 있을것 같아 인증 작업은 자동화 툴을 사용하여 간단하게 해결해보기로 했다.

### 1) 회원 가입

나는 Make를 사용했으므로 Make기준으로 설명한다.

아래 링크의 make 사이트에서 'Get started free'라는 버튼을 누르거나 다른 방법으로 회원가입을 시작한다.

[Make 링크](https://www.make.com/en?utm_campaign=gg-dg-apac-demandgen-search-brand&utm_source=google&utm_medium=cpc&utm_content=make&utm_term=make&gad_source=1&gclid=Cj0KCQjwhfipBhCqARIsAH9msbkRGbkhQfBGMSCtinAHuE5-VUM0YNil1MARvyDcZIvj0M6sck6773caAiTUEALw_wcB)

<img src="/assets/image/projects/linkedin-auto-posting/sign-up.png" width=500px>

마지막 Hosting Region은 EU/US가 있었던 걸로 기억하는데 둘중 아무거나 하면 된다.

나는 EU 그대로 진행했다.

이렇게 회원가입을 진행하면 아래와 같은 화면이 나온다.

<img src="/assets/image/projects/linkedin-auto-posting/make-organization.png">

Subscription부분을 보면 무료 플랜에서는 월간 1000회까지 무료작업을 지원해 주는 것을 알 수 있다.

### 2) 시나리오 만들기 : Webhook

다음으로 우리가 원하는 자동화 작업을 만들기 위해서 좌측 드로어를 열고 Scenarios를 눌러 시나리오로 들어가 새 시나리오를 만든다.

<img src="/assets/image/projects/linkedin-auto-posting/make-organization-scenarios.png" width=500px>

<img src="/assets/image/projects/linkedin-auto-posting/make-scenarios-plus.png">

<br>

이후 아래와 같은 화면이 나오면 동그란 + 버튼을 누르고 검색창에 "webhooks"를 입력하여 custom webHook을 추가한다.

<img src="/assets/image/projects/linkedin-auto-posting/make-new-application.png" width=300px>

<img src="/assets/image/projects/linkedin-auto-posting/make-scenario-new-application.png" width=300px>
<img src="/assets/image/projects/linkedin-auto-posting/make-webhooks.png" width=300px>

webhooks는 url request를 통해 이벤트를 트리거 해주는 모듈이며 이 외에도 다양한 방법으로 이벤트를 트리거 할 수 있다.

(참고로 Zapier는 webhook이 유료라서 그냥 Make를 사용했다.)

이제 화면에 아래와 같은 아이콘이 표시될 것이다.

<img src="/assets/image/projects/linkedin-auto-posting//make-webhook.png" width=300px>

클릭해서 'Create a webhook'을 눌러 새 webhook을 만든다.

새로운 webhook을 만든 후 나오는 화면에서 상단의 https:// 로 시작하는 url이 앞으로 해당 작업을 시작하기 위한 트리거를 전달하는 요청 url이 된다.

<img src="/assets/image/projects/linkedin-auto-posting/made-new-webhook.png" width=300px>

나의 경우에는 포스팅에 들어갈 내용을 요청 시 함께 전달 받기를 원했기 때문에 Webhook 우측의 edit를 누르고, Show advanced settings를 눌러 data structure를 추가해줬다.

이 기능으로 나중에 링크드인 포스팅을 요청할 때 내용이나 link 등을 webhook에서 받아 넘겨줄 수 있다.

<img src="/assets/image/projects/linkedin-auto-posting/add-data-structure.png" width=300px>

예를 들어 업로드된 포스팅의 링크를 포함한 요청을 받고싶다면 아래와 같이 link라는 data structure를 만들 수 있다.

<img src="/assets/image/projects/linkedin-auto-posting/data-structure-link.png" width=300px>

### 3) 시나리오 만들기 : 포스팅

이제 해당 트리거가 동작할때 실행할 이벤트를 만들기 위해 'Add another module'버튼을 눌러 linkedin 모듈을 추가해준다.

<img src="/assets/image/projects/linkedin-auto-posting/add-another-module.png" width=300px>

이번에도 webhook때와 마찬가지로 검색창에 linkedin을 검색하여 해당 모듈을 찾을 수 있다.

'LinkedIn'이라고 쓰여진 모듈을 누른 후 'Create a Text Post'라는 모듈을 추가해주었다.

(참고로 커스텀 모듈을 만들수도 있다!)

<img src="/assets/image/projects/linkedin-auto-posting/create-a-text-post.png" width=300px>

이후 생긴 동그란 모듈 아이콘을 클릭하면 다음과 같은 화면이 보인다.

<img src="/assets/image/projects/linkedin-auto-posting/linkedin-posting-module.png" width=300px>

1. connection : 포스팅할 링크드인 계정 연결
2. content : 해당 포스팅의 내용 (webhook의 datastructure로 할당가능)
3. Media Type : 내 경우에는 포스팅 URL을 article형태로 넣고 싶어서 Article로 지정, 필요없다면 Empty
4. Link(article일때만 해당) : 올릴 링크 URL과 해당 URL article의 title입력

### 4) 활성화!

이제 하단의 Run once를 눌러 편의에 따라 테스트를 하고 그 및에 있는 토글버튼을 ON으로 바꾸어서 해당 시나리오를 activate해준다.

시나리오가 활성화 되어있지않다면 요청이 되지 않으므로 꼭 눌러주어야한다!

<img src="/assets/image/projects/linkedin-auto-posting/scenario-activate.png" width=300px>

<br>

## 2. 파이썬 스크립트 짜기 ✅

이제 깃허브 액션의 워크 플로우에서 동작할 파이썬 스크립트를 짜야한다.

이 파이썬 스크립트가 해야하는 일들은 다음과 같다.

1. 블로그에 새 글이 올라왔는지 확인
2. 새 글이 올라왔다면 이전 단계에서 만들어둔 Make webhook URL로 링크드인 포스팅 트리거

### 1) feedParser로 블로그 feed 파싱

먼저 블로그에 새 글이 올라왔는지 확인하기 위해 내 블로그의 rss피드를 찾아야한다.

나의 경우에는 블로그 하단 버튼을 통해 찾았다.

<img src="/assets/image/projects/linkedin-auto-posting/feed-button.png" width=300px>

해당 피드는 다음과 같이 xml형태로 되어있는데 이곳에 내 피드의 정보가 들어있다.

나는 이중 entry태그 부분을 파싱하여 현재시간부터 한시간 이내의 새로운 포스팅을 찾아내기로 했다.

<img src="/assets/image/projects/linkedin-auto-posting/rss-feed.png" width=500px>

나는 파이썬 무지렁이였지만 feedParser라는 좋은 도구를 활용하면 아주 쉽게 feed를 파싱할 수 있다.

```python
import feedparser
from datetime import datetime, timedelta

def find_new_posting():

    print("\nFinding new posting...\n")

    feed = feedparser.parse(FEED_URL)
    current_time = datetime.now()
    one_hour_ago = current_time - timedelta(hours = 1) # 현재 시간으로부터 한시간 전 계산

    new_postings = []

    for index, entry in enumerate(feed['entries']):
        published_time = datetime.strptime(entry['published'], "%Y-%m-%dT%H:%M:%S+00:00")

        # 한시간 이내에 발행된 포스팅 수집
        if published_time > one_hour_ago and published_time <= current_time :
            title = entry['title']
            link = entry['link']
            published_time_str = published_time.strftime("%Y.%m.%d %H:%M")

            # 업로드할 새 포스팅 정보 저장
            new_postings.append({ 'title':title,'link':link,'published_time':published_time_str })
            print(f'#{ index + 1 } : { title } | { published_time_str } | { link } \n ')


    print(f"new posting : {len(new_postings)}")
    return new_postings

```

### 2) Make webhook으로 전달

이렇게 찾아낸 새로운 포스팅들을 아래와 같이 하나씩 make의 webhook으로 전달한다.

```python
import requests

def request_posting(title,link,content):

    print(f"\nRequest posting : {title}...")

    # Make에서 만들었던 data structure 형태로 만들기!
    data={ 'link':link,'content':content,'title':title}

    # webhook URL(REQUEST_URL)로 해당 요청 post
    response=requests.post(REQUEST_URL,data)

    if response.status_code==200:
        print("Successfully request")
    else:
        print(f"Request fail : {response.status_code} {response.text}")

```

### 전체 코드

```python
import requests
import os
import feedparser
from datetime import datetime, timedelta

def find_new_posting():

    print("\nFinding new posting...\n")

    feed = feedparser.parse(FEED_URL)
    current_time = datetime.now()
    one_hour_ago = current_time - timedelta(hours = 1) # 현재 시간으로부터 한시간 전 계산

    new_postings = []

    for index, entry in enumerate(feed['entries']):
        published_time = datetime.strptime(entry['published'], "%Y-%m-%dT%H:%M:%S+00:00")

         # 한시간 이내에 발행된 포스팅 수집
        if published_time > one_hour_ago and published_time <= current_time :
            title = entry['title']
            link = entry['link']
            published_time_str = published_time.strftime("%Y.%m.%d %H:%M")

             #업로드할 새 포스팅 정보 저장
            new_postings.append({ 'title':title,'link':link,'published_time':published_time_str })
            print(f'#{ index + 1 } : { title } | { published_time_str } | { link } \n ')


    print(f"new posting : {len(new_postings)}")
    return new_postings


def request_posting(title,link,content):

    print(f"\nRequest posting : {title}...")

    # Make에서 만들었던 data structure 형태로 만들기!
    data={ 'link':link,'content':content,'title':title}

    # webhook URL(REQUEST_URL)로 해당 요청 post
    response=requests.post(REQUEST_URL,data)

    if response.status_code==200:
        print("Successfully request")
    else:
        print(f"Request fail : {response.status_code} {response.text}")



if __name__=="__main__":
    FEED_URL = os.environ['RSS_FEED_URL']
    REQUEST_URL = os.environ['REQUEST_URL']
    DEFAULT_CONTENT = os.environ['POSTING_CONTENT'] if os.environ.get('POSTING_CONTENT') != None else "New Posting"

    # 새 포스팅 탐색
    new_postings = find_new_posting()

    # 찾은 포스팅 정보를 가공하여 request_posting()에 요청
    for posting in new_postings :
        title = posting['title']
        link = posting['link']
        published_time = posting['published_time']
        content = DEFAULT_CONTENT + f"\n[{title}] \npublished : {published_time}"
        request_posting(title, link, content)
```

## 3. github Action .yaml파일 만들기 ✅

으아 드디어 마지막 고지가 보이는것같다.

마지막은 위에서 만든 파이썬 스크립트를 실행시키기 위해 깃허브 액션의 workflow를 만들어 줄거다.

### 1) 레포지토리 만들기 및 Secrets, Variables설정

워크플로우를 만들기 전 해당 워크플로우를 동작시킬 새 repository를 만든다.

해당 레포지토리에 위에서 만들었던 파이썬 스크립트 파일을 넣어준다. (나는 main.py라는 이름으로 넣었다.)

레포지토리의 settings>Secrets and Variables>Action에 들어가 필요한 secrets와 variables를 정의해준다.

<img src="/assets/image/projects/linkedin-auto-posting/settings.png" width=300px>

<img src="/assets/image/projects/linkedin-auto-posting/secret.png" width=300px>
<img src="/assets/image/projects/linkedin-auto-posting/variables.png" width=300px>

make로 보내는 요청 URL(REQUEST_URL)은 남들이 알게 되면 안되므로 secret으로 만들었고, 내 블로그의 피드 URL(RSS_FEED_URL)과 포스팅 기본 문구를 지정하기위한 변수(POSTING_CONTENT)까지 두 개는 노출되도 문제가 없어서 variables에 정의해두었다.

### 2) .yaml 파일 만들기

이 파일은 워크 플로우의 동작을 정의하는 파일이다.
이 파일은 **.github/workflows/**폴더에 저장하면 된다.

```yaml
name: LinkedIn Posting # 워크플로우 이름

on: # 언제 해당 워크플로우를 실행할지
  push: # 메인 브랜치로 푸시할때 실행해줘라
    branch:
      - main

  schedule: # 매 정각마다 실행해 줘라
    - cron: "0 * * * *"

jobs: # 워크플로우에서 할일
  post_to_linkedin: #job이름
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository for python script
        uses: actions/checkout@v2

      - name: Install python
        uses: actions/setup-python@v2
        with:
          python-version: 3.x

      - name: Install dependency
        run: pip install -r requirements.txt

      - name: Post to linkedIn
        env: # 환경변수 설정
          RSS_FEED_URL: ${{ vars.RSS_FEED_URL }}
          REQUEST_URL: ${{ secrets.REQUEST_URL }}
          POSTING_CONTENT: ${{ vars.POSTING_CONTENT }}

        run: python main.py # 위에서 만들었던 파이썬 스크립트 실행
```

이때 파이썬 스크립트에서 1시간 이내의 신규 포스팅을 수집하게 되어있으므로 이 워크플로우도 한 시간 간격으로 실행되도록 설정하였다.

## 4. 결과 및 소감 🚩

여기까지 하면 드디어 이렇게 자동 포스팅이 동작한다!

<img src="/assets/image/projects/linkedin-auto-posting/result.png" width=300px>

아직 보완할 부분이 많지만 이번 작업을 통해 자동화의 참맛을 느껴버리고 말았다..!

<br>

# 🧐 개선점

일단 너무 어렵게 시작하면 안할것같아서 mvp,mvp를 마음속에 되뇌이면서 작업을 하다보니 여러모로 발전시키고 싶은 부분이 많다.

일단 지금 당장 생각나는 부분은 링크드인 포스팅에 자동으로 그림이 안달린다는 것..!

다음에는 가장 거슬리는 이 부분을 해결해야 할 듯 하다!

# 🔗 참고

[How to publish a post to LinkedIn via API - A step-by-step guide](https://www.azaytek.com/how-to-publish-to-linkedin-via-api/)

[Step-by-step tutorial on how to get LinkedIn API access token](https://www.azaytek.com/part-1-how-to-get-linkedin-api-access-token/)

[How to publish a post to LinkedIn via API - Part 2](https://www.azaytek.com/how-to-publish-a-post-to-linkedin-via-api-part-2-post-a-text-to-linkedin-api-using-access-token/)

[Post to LinkedIn using Share API](https://stackoverflow.com/questions/11464330/post-to-linkedin-using-share-api)

[[파이썬] 링크드인 linkedin API 키 발급](https://dataanalytics.tistory.com/entry/파이썬-링크드인-linkedin-API-키-발급)

[How to Automate Creating Posts on LinkedIn \| Ezz \| Technical Content Writer for Software Companies](https://ezzeddinabdullah.com/post/linkedin-api-posts/)

[LinkedIn UGC Post Method](https://stackoverflow.com/questions/71885271/linkedin-ugc-post-method)

[unauthorized_scope_error in LinkedIn oAuth2 authentication](https://stackoverflow.com/questions/53479131/unauthorized-scope-error-in-linkedin-oauth2-authentication)

[Sign In with LinkedIn using OpenID Connect - LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)

[Share on LinkedIn - LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin)
