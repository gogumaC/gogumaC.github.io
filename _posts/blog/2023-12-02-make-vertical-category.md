---
title: "세로형 카테고리 만들기"
categories: blog
excerpt: "jekyll블로그에 세로형 카테고리 만들기 (github.io, minimal-mistake)"
tags:
  - [
      github.io,
      jekyll,
      minimal-mistake,
      vertical,
      category,
      vertical category,
      css,
      js,
      html,
      liquid,
    ]
date: 2023-12-02 23:14
last_modified_at: 2023-12-02 23:14
toc: ture
toc_sticky: true
---

요즘 이것저것 만드는데 재미를 붙이는 중이다.

그런데 이런 과정을 정리하려고 하다 보니 블로그 카테고리가 너무 불편하고 마음에 들지 않았다.

기존에는 상단 navigation을 카테고리로 사용하고 있었는데 그러다 보니 많은 양의 카테고리를 보기 어렵다는 단점이 있었다.

이 녀석을 그냥 두고는 도저히 다른 작업이 손에 잡히지 않아서 블로그 디자인 수정을 먼저 진행하기로 했다.

1. 카테고리 구조 만들기
2. 디자인 추가
3. 반응형으로 개선
4. 카테고리 페이지 만들기

이 순서로 진행했는데 웹을 잘 아는 편이 아니라 코드가 비효율적이거나 잘못된 부분이 있을 수 있다😅

## 1. 카테고리 구조 만들기



먼저 _includes폴더에 세로형 카테고리를 만들 sidebar-category.html파일을 만들었다.

<img src="/assets/image/blog/231202-make-vertical-category/includes.png"/> <img src="/assets/image/blog/231202-make-vertical-category/sidebar-category.png" width=300px/>


### .yml 정보를 html로 표시

내 경우 기존에는 navigation에 카테고리를 보여주기 위해 _data폴더에 yml파일로 보여줄 카테고리 목록을 정리해 두었다.

이제 navigation에서 세로 카테고리로 카테고리를 분리해야하므로 _data에 새로 categories.yml파일을 만들어 보여주고 싶은 카테고리를 정의하였다.

<img src="/assets/image/blog/231202-make-vertical-category/yml.png"/>

내가 카테고리를 정의해두었던 .yml파일은 아래와 같은 구조였다.

```html
main:
  - key: projects
    title: "프로젝트🚀"
    url: /projects/

    sub:
      - key: climbup
        title: "ClimbUp 🧗‍♀️"
        url: /projects/climbup/

      - key: linkedin-auto-posting
        title: "링크드인 자동 포스팅 📤"
        url: /projects/linkedin-auto-posting/
```

- `main` : 메인 카테고리 배열
- `key` : 해당 카테고리의 원래 이름
- `title` : 사용자에게 보여주고 싶은 카테고리 이름
- `url` : 해당 카테고리의 링크
- `sub`: 해당 카테고리의 하위 카테고리 배열

이 yml파일을 사용하여 미리 정의된 카테고리를 아래와 같이 `site.data.categories.main`으로 참조하여 카테고리 목록 상단에 표시하였다.

```html
{%raw%}
<!-- sidebar-category.html -->
<div id="mainMenu">
{% assign categories_info=site.data.categories.main %} 
{% assign categories=site.categories%}

{%for category in categories_info%}
  {%assign category_key=category.key%}
  {%assign category_posts=categories[category_key]%}
  {%assign sub_categories=category.sub%}
  
  <div>
    <a class="category" href="{{site.baseurl}}/{{category.key}}">{{category.title}} [{{category_posts.size | default: 0}}]</a>
  
    {%for sub_category in sub_categories%}
      {%assign sub_category_posts=categories[sub_category.key]%}
      <div>
        <a class="sub-category" href="{{site.baseurl}}/{{category.key}}/{{sub_category.key}}">{{sub_category.title}} [{{sub_category_posts.size | default: 0}}]</a>
      </div>
    {%endfor%}
  </div>
  <hr class="category-hr">
{% endfor %}
{%endraw%}
```

- `categories_info` : 내가 yml에 정의해둔 카테고리 목록. _data/categories.yml의 main태그에 들어있다.
- `categories` : site.categories에서 가져온 전체 카테고리 목록
- 반복문을 통해 모든 카테고리와 하위 카테고리를 생성한다.
    
    ```html
    {%raw%}
    {%for category in categories_info%}
      {%assign category_key=category.key%}
      {%assign category_posts=categories[category_key]%}
      {%assign sub_categories=category.sub%}
      
      <div>
        <a class="category" href="{{site.baseurl}}/{{category.key}}">{{category.title}} [{{category_posts.size | default: 0}}]</a>
      
        {%for sub_category in sub_categories%}
          {%assign sub_category_posts=categories[sub_category.key]%}
          <div>
            <a class="sub-category" href="{{site.baseurl}}/{{category.key}}/{{sub_category.key}}">{{sub_category.title}} [{{sub_category_posts.size | default: 0}}]</a>
          </div>
        {%endfor%}
      </div>
      <hr class="category-hr">
    {% endfor %}
    {%endraw%}
    ```
    

### 남은 카테고리 만들기

이번에는 yml파일에 있는 카테고리 외에도 내가 잊어버린 카테고리 또한 보여주고 싶었기 때문에  위에서 만든 카테고리를 제외하고 남은 카테고리들을 site.categories에서 찾아내어 비슷한 방법으로 카테고리를 만들었다.

```html
{%raw%}
{% for category in categories%}

  {%assign category_name=category[0]%}
  {%assign category_posts=category[1]%}

  
  {%assign display=true%}
  {%for mapped in categories_info%}
    {%if mapped.key==category_name%} {%assign display=false%} {%endif%}
  {%endfor%}

	{%for post in category_posts%}
    {%if post.categories.size > 1 %}
      {%if post.categories[1]==category_name%}
        {%assign display=false%}
      {%endif%}
    {%endif%}
  {%endfor%}

  {%if display%}

    <div>
	    <a class="category" href="{{site.baseurl}}/{{category_name}}">{{category_name}} [{{category_posts.size}}]</a>
    </div>
    <hr class="category-hr">
  {%endif%}
  
{%endfor%}

</div>
{%endraw%}
```

- `category_name` : 해당 카테고리의 이름
- `category_posts`: 해당 카테고리의 포스팅 배열
- `display` : 해당 카테고리를 표시 할 지에 대한 플래그 역할
- 반복문을 통해 categories.yml에 있는 카테고리라면 `display=false`로 변경
    
    ```html
    {%raw%}
     {%for mapped in categories_info%}
        {%if mapped.key==category_name%} {%assign display=false%} {%endif%}
      {%endfor%}
    {%endraw%}
    ```
    
- 해당 카테고리의 모든 포스팅 정보를 확인하여 해당 카테고리를 서브 카테고리로 사용하는 포스팅이 있다면 `display=false`로 변경(카테고리가 서브 카테고리인지 확인)
    
    ```html
    {%raw%}
    {%for post in category_posts%}
        {%if post.categories.size > 1 %}
          {%if post.categories[1]==category_name%}
            {%assign display=false%}
          {%endif%}
        {%endif%}
      {%endfor%}
    {%endraw%} 
    ```
    

참고로 맨날 잊어버리기 때문에 다시 정리해두면 `site.categories`는 배열 형태로 카테고리들을 저장하는데 각 배열에는 또다시 배열 형태로 0번에는 해당 카테고리의 이름이, 1번에는 카테고리에 해당하는 포스팅의 정보가 배열로 들어있다.

 m | site.categories[n][m] 
 --- | --- 
 0 | 카테고리 이름 
 1 | 카테고리 포스팅 배열 

### 전체 코드

```html
{%raw%}
<!-- 카테고리 만들기 -->
<div id="mainMenu">
{% comment %} 맵핑된 카테고리 {% endcomment %}
{% assign categories_info=site.data.categories.main %}
{% assign categories=site.categories%}

{%for category in categories_info%}
  {%assign category_key=category.key%}
  {%assign category_posts=categories[category_key]%}
  {%assign sub_categories=category.sub%}
  
  <div>
    <a class="category" href="{{site.baseurl}}/{{category.key}}">{{category.title}} [{{category_posts.size | default: 0}}]</a>
  
    {%for sub_category in sub_categories%}
      {%assign sub_category_posts=categories[sub_category.key]%}
      <div>
        <a class="sub-category" href="{{site.baseurl}}/{{category.key}}/{{sub_category.key}}">{{sub_category.title}} [{{sub_category_posts.size | default: 0}}]</a>
      </div>
    {%endfor%}
  </div>
  <hr class="category-hr">
{% endfor %}

{% comment %} 제목설정 안하고 그냥 쓰는 카테고리 {% endcomment %}
{% for category in categories%}

  {%assign category_name=category[0]%}
  {%assign category_posts=category[1]%}

  
  {%assign display=true%}
  {%for mapped in categories_info%}
    {%if mapped.key==category_name%} {%assign display=false%} {%endif%}
  {%endfor%}

  {%for post in category_posts%}
    {%if post.categories.size > 1 %}
      {%if post.categories[1]==category_name%}
        {%assign display=false%}
      {%endif%}
    {%endif%}
  {%endfor%}

  {%if display%}

    <div>
    <a class="category" href="{{site.baseurl}}/{{category_name}}">{{category_name}} [{{category_posts.size}}]</a>
    </div>
    <hr class="category-hr">
  {%endif%}
  
{%endfor%}

</div>
{%endraw%}
```

### 사이드바에 추가

나는 카테고리를 사이드 바 영역에 넣고 싶어서 기존 사이드바 파일에 위 sidebar-category.html을 include시켰다.

_includes/sidebar.html 파일에 아래 코드를 원하는 위치에 넣어주면 된다.

```html
{%raw%}
<div>{%include sidebar-category.html%}</div>
{%endraw%}
```

## 2. 디자인 추가

위에서 만든 카테고리에 디자인을 입히기 위해서 _sass/minimal-mistakes폴더에 _category.scss파일을 만들었다.

<img src="/assets/image/blog/231202-make-vertical-category/scss.png"/>

이 파일을 적용하기 위해서 _sass/minimal-mistakes.scss 파일에 아래와 같이 해당 파일을 import해줘야한다.

```scss
/*custom*/
@import "minimal-mistakes/category";
```

이후 위 html파일에서 `<*** class="…">`  같이 사용한 클래스의 디자인을 아래와 같이 정의해 주었다.

```scss
.category {
  font-size: small;
  font-weight: bold;
  color: black;

  &:visited {
    color: black;
  }
}

.sub-category {
  margin-left: 20px;
  font-size: small;
  color: black;
  &:visited {
    color: black;
  }
}

.category-hr {
  border: 0;
  border-top: 1px dashed gainsboro;
  height: 1px;
  width: 95%;
  margin-left: 0;
}

@media screen and (max-width: 1000px) {
  #mainMenu {
    display: none;
  }
  #dropdownMenu {
    display: block;
  }
}
```

- category : 메인 카테고리 영역
- sub-category : 서브 카테고리 영역, margin-left으로 들여쓰기 같이 메인 카테고리보다 오른쪽에 위치

## 3. 반응형으로 개선

이렇게 사이드바에 카테고리를 추가하니 기본적으로 사이드바와 같이 동작하게 되는데 그러다 보니 화면이 작아지면 카테고리가 화면 상단의 꽤 많은 스크롤을 차지하게 되어서 불편하다는 생각이 들었다.

여기까지 만들고 나니 약간 욕심이 더 생겨서 진짜 이것까지만 하고 마치자는 생각으로 화면이 작아질 때 펼치기 기능을 만들었다.

사실 여기부터는 거의 아무것도 모르는 상태였어서 웹을 잘하는 친구에게 물어보기도 하고 gpt랑 구글링도 많이 활용했다.

### 펼치기 버튼 만들기

생각해보니 카테고리 제목이 없어서 버튼과 함께 겸사겸사 만들어보기로 했다.

기존 includes/sidebar-category.html의 맨 위에 대충 아래와 같이 만들었고 아래 a태그 부분을 버튼으로 사용하기로 했다.

```html
<p>
  <strong>
    <i class="fas fa-fw fa-folder-open" aria-hidden="true"></i> 
    카테고리
    <a id="dropdownMenu" href="javascript:void(0);">
     (펼쳐보기)
    </a>
  </strong>
</p>
```

### @media태그로 화면크기에 대응

다음으로는 _sass/minimal-mistakes/_category.scss 파일 맨 밑에 아래와 같은 코드를 추가해 주었다.

```scss
@media screen and (max-width: 1000px) {
  #mainMenu {
    display: none;
  }
  #dropdownMenu {
    display: block;
  }
}

@media screen and (min-width: 1001px) {
  #dropdownMenu {
    display: none;
  }
  #mainMenu {
    display: block;
  }
}
```

1000px을 기준으로 작을 때는 카테고리를 보이게 하고, 펼치기 버튼을 없애고, 1001px부터는 카테고리는 기본적으로 숨기고 대신 펼치기 버튼을 보이게 한다.

- 1001px이상
<img src="/assets/image/blog/231202-make-vertical-category/wide.png"/>

- 1000px이하
<img src="/assets/image/blog/231202-make-vertical-category/narrow.png"/>

참고로 이전 코드에서 카테고리를 만드는 부분 최상단이 mainMenu id를 가진 부분이고, dropdownMenu는 바로 위에서 만든 펼치기 버튼의 id이다.

```html
<!--  _includes/sidebar-category.html -->

<a id="dropdownMenu" href="javascript:void(0);">

<!--  카테고리 만들기 -->
<div id="mainMenu">
...
</div>
```

### javaScript로 기능 만들기

이제 펼치기 버튼을 눌렀을 때, 숨겼던 카테고리가 보이게 하기 위해 자바 스크립트를 사용해야 한다.

일단 assets/js폴더에 script.js 파일을 만들어주었다.

<img src="/assets/image/blog/231202-make-vertical-category/script.png"/>

다음으로는 해당 스크립트 파일을 헤더에 추가해주기 위해 includes/head/custom.html파일에 아래와 같이 추가해주었다.

```html
<script defer src="{{site.baseurl}}/assets/js/script.js"></script>
```

이제 펼치기 버튼 동작을 만들어두었던 script.js 파일에 아래와 같이 정의해주면 된다.

```jsx
document.getElementById("dropdownMenu").addEventListener("click", function () {
  var menu = document.getElementById("mainMenu");
  if (menu.style.display === "block") {
    dropdownMenu.innerText = "(펼쳐보기)";
    menu.style.removeProperty("display");
  } else {
    dropdownMenu.innerText = "(숨기기)";
    menu.style.display = "block";
  }
});
```

## 4. 카테고리 페이지 만들기

여기까지 했다면 사이드바의 카테고리 영역 만들기는 사실상 끝이 났다.

하지만 막상 해당 카테고리를 눌러보면

<img src="/assets/image/blog/231202-make-vertical-category/no-page.png"/>

이렇게 뭔가 괜찮지만 안 괜찮은 페이지로 이동 된다. 

사실상 눌러보면 동작하기는 하는데 배포하고 있는 페이지에서 이런 UI는 좀 말이 안되기 때문에 _pages폴더에 들어가서 각 카테고리의 페이지를 아래와 같이 열심히 만들어 주었다.

(나는 폴더별로 정리하고 싶어서 이렇게 했지만 그냥 _pages 폴더 안 아무곳에나 파일을 만들면 된다.)

<img src="/assets/image/blog/231202-make-vertical-category/pages.png"/>

```markdown
---
title: "블로그🐳"
layout: category-unit
category_title: "blog"
author_profile: true
permalink: /blog/
---
```

- title : 페이지 상단에 보여줄 이름
- layout : cateogry-unit은 내가 만든 레이아웃이라 해당 파일을 [링크](https://github.com/gogumaC/gogumaC.github.io/blob/main/_layouts/category-unit.html)에서 찾아 _layouts폴더에 붙여 넣거나, _layouts폴더를 잘 참고하여 적당한 레이아웃 파일을 고르는 걸 추천한다.

나는 카테고리를 만들 때 href속성에 각 카테고리 별로 다른 페이지로 이동하게 만들었기 때문에 꼭 각 카테고리 별 페이지를 _pages폴더에 만들어야 했지만 혹시 이게 귀찮거나 싫다면 기존 페이지 링크를 잘 활용해서 이동하게 만들어주는 것도 좋을 것 같다.

예를 들면 href속성값을 

```html
{%raw%}
<a href="{{site.baseurl}}/categories/#카테고리이름"></a>
{%endraw%}
```

이렇게 해두면 아마 기본적으로 생성된 카테고리 페이지를 이용해 해당 카테고리로 이동할 수 있을 것 같다.

<br>

여기까지 끝내면 이제 블로그에 세로 카테고리 영역을 가질 수 있게 된다! 🙌

## 개선점

항상 블로그 꾸미기를 할 때는 재미도 있지만 평소에 잘 안 하는 작업이라서 어색하고 오래 걸리는 것 같다.

그러다 보니 만들고 나서 ‘아, 이렇게 하는 게 더 좋을 것 같은데’ 라고 생각하는 일도 종종 생긴다.

이번에도 작업을 마치면서 아쉬운 점들이 있었다.

- **각 카테고리 파일을 자동으로 만들 수 있었으면 좋겠다.**
- 카테고리를 categories.yml에 한번에 넣지 말고 sub-categoreis를 분리하거나 다른 구조를 좀 더 생각해보면 좋을 것 같다.

이 부분들은 또 나중에 시간이 될 때 개선해 볼 생각이다!