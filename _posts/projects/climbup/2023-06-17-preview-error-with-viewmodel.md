---
title: "[ClimbUp🧗]뷰모델 사용 시 Compose Preview 에러 해결"
excerpt :
categories: projects climbup
tags:
    - [climbup,project,viewmodel,preview,issue]
date : 2023-06-17
last_modified_at: 2023-06-17
toc : ture
toc_sticky : true
---
## 문제 발생

프로젝트 중 어떤 시점을 기준으로 갑자기 프리뷰가 안되기 시작했다..ㅠㅠ

UI개발 할 때 프리뷰가 안되니까 약간 눈가리고 떡 써는 느낌이라 하나씩 주석처리를 하다가 **원인이 뷰모델 때문이라는 것을 알게 되었다.**

문제의 원인이 되는 코드와 현상은 **[이슈](https://github.com/gogumaC/ClimbUp/issues/2)**에서 자세하게 확인 할 수있다.



## 해결

운 좋게도 전 주에 진행된 원티드 프리온보딩 강의에서 이 문제가 언급 되었던 적이 있었다.

이때 강사님이 주신 링크를 저장해뒀는데 그게 생각이 나서 빠르게 해결할 수 있었다!👍

[preview - AndroidDeveloper](https://developer.android.com/jetpack/compose/tooling/previews#preview-viewmodel)

문서의 내용을 정리해보면 

- 뷰모델을 사용하는 컴포저블은 프리뷰를 사용 할 수 없음
- 뷰모델 인스턴스를 다른 하위 컴포저블로 전달해선 안됨
    - 이렇게 되면 하위 컴포저블도 못보게됨
    - 재사용성 떨어짐

<img src="/assets/image/projects/climbup/230617-ISSUE-preview-error-with-viewmodel/preview_img1.png">

정리하면 컴포저블에서 뷰모델을 사용하려면 해당 컴포저블 함수를 뷰모델을 사용하는 부분과 그렇지 않은 부분으로 나눠서 사용해야한다는 것이다.

나는 이걸 아래와 같이 해결했다.

```kotlin
@Composable
internal fun HomeScreen( //ComposalbeA역할
    climbingRecViewModel: ClimbingRecordViewModel = viewModel()
){

    val onDateSelected:(Long?)->Unit={
        climbingRecViewModel.getDayRecords(it)
    }
    val onMonthChanged={}
    HomeScreen(
        dayUiState=climbingRecViewModel.dayUiState,
        monthUiState = climbingRecViewModel.monthUiState,
        onDateSelected = onDateSelected
    )
}

@Composable
private fun HomeScreen( //ComposableB역할
    modifier: Modifier = Modifier,
    dayUiState: StateFlow<DayUiState>?=null,
    monthUiState: StateFlow<MonthUiState>?=null,
    onDateSelected:(Long?)->Unit={},
){
```

같은 이름의 함수가 두개가 있는데 이건 함수 오버로딩을 활용한 것이다. 

공홈코드에서 이런 방식으로 쓰이는것 같아서 이렇게 해봤는데 같은 함수에 있어야할 내용을 쪼갠거라서 이렇게 쓴 게 아닌가 싶다.

---

### +) 공홈 코드

공홈에 올라온 코드인데 얘도 나중에 보기 쉽도록 주석을 달아두었다. 

```kotlin
@Composable
fun AuthorColumn(viewModel: AuthorViewModel = viewModel()) {// 뷰모델을 매개변수로 받는 컴포저블
  AuthorColumn(//UI를 담당하는 컴포저블- 뷰모델이 매개변수로 들어오면 프리뷰가 안되므로 여기서 뷰모델데이터를 뽑아서 보내줌
    name = viewModel.authorName,
    posts = viewModel.posts
  )
}

//Preview에서 활용
@Preview
@Composable
fun AuthorScreenPreview(// 프리뷰에서는 뷰모델을 사용하지 않는 컴포저블만 사용
  name: String = sampleAuthor.name,
  posts: List<Post> = samplePosts[sampleAuthor]
) {
  AuthorColumn(...) {
    name = NameLabel(name),
    posts = PostsList(posts)
  }
}
```

---

### +) 의문

- 만약 부분적인 하위 컴포저블에서만 뷰모델 데이터를 사용하고 싶어서 저런 구조의 컴포저블을 여러개 만든다면 스크린 전체의 컴포저블을 보기 힘들지 않나
- 그렇다고 최상위 컴포저블에만 저런 구조를 적용한 후 뷰모델 작업을 몽땅 몰아두고 쓰자니 불필요한 호이스팅이 일어나지 않을까(상태 호이스팅에 관한 문서에서는 불필요한 호이스팅을 지양하라고 되어있어서 든 의문인데 뷰모델에서는 어떻게 적용될지 잘 모르겠다.)


## 참고

[preview - AndroidDeveloper](https://developer.android.com/jetpack/compose/tooling/previews#preview-viewmodel)

[안드로이드 Compose Preview를 잘 활용하는 방법은? - 함수를 잘 분리하자.](https://thdev.tech/android/2023/01/24/Android-Compose-Preview/)