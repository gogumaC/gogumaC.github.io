---
title: "커스텀 다이얼로그 제작기(XML View)"
categories: android
tags: 
    - [android,softeer,custom dialog, dialog, view]
date: 2024-04-21 16:10
last_modified_at: 2024-04-21 16:10
toc : ture
toc_sticky : true
---


이 포스팅은 사실 소프티어 부트캠프 할 때 레포 위키에 적었던 건데 레포가 private으로 변경되며 개인 블로그에 다시 포스팅하기로 했다.

PR링크도 있었는데 이제 못보는 관계로 이부분은 관련 이미지만 복붙해왔다.

하여간 오랜만에 읽으니까 이 시기에 되게 열의가 가득했던 것 같다.

---

<br>

> 2024.08.10

이번주에는 첫주라 그런지 개발하는 시간보다는 규칙이나 계획을 논의하는 시간이 많았던 것 같다.

개발시간이 많지 않아서 크게 진도가 많이 나가지는 못했지만, 이번주에 내가 맡았던 **커스텀 다이얼로그 구현**에 대해 정리해보기로했다.

디자인되어있는 다이얼로그는 총 3개로 일반적인 다이얼로그와 미묘하게 요구사항이 추가된 두개의 다이얼로그를 구현해야했다.

### 💬 커스텀 다이얼로그 구현

처음에는 평소에 버튼을 커스텀 하는것처럼 생성자와 리스너를 사용하여 아래와 같이 다이얼로그를 구현했다.

```kotlin
TwoButtonsDialog("제목", "안녕").apply {
            setOnPrimaryButtonClickListener {
                //우측 버튼 클릭 시
            }
            setOnSecondaryButtonClickListener {
                //좌측 버튼 클릭 시
                this.dismiss()
            }
        }.show(requireActivity().supportFragmentManager, "dialogTag")
```
<img src="/assets/image/2024-04-21-16-03-15.png" width=300px>

이렇게 짰더니 생성자에서 많은 옵션을 설정하기 힘들고 설정함수도 꽤나 많이 나와서 어쩔수 없이 세개의 유사한 다이얼로그에 대한 클래스 분리를 생각하게 되었던것같다.🥲

세 다이얼로그는 유사한 부분이 많아서 이부분을 어떻게 효율적으로 통합할 수 있을까에 대해서 고민이 많았었는데 마땅한 방법이 생각나지 않아서 상당히 오랜시간을 구조를 고민하는데 썼었다.

그러다 금요일 진행상황 보고에서 해당 코드가 올라간 pr을 아이비님께 보여드리고 다이얼로그 구현에 관해서 질문을 드렸는데 ‘builder pattern’과 ‘navigation component’라는 키워드를 얻을 수 있었다.

이후 builder pattern부터 고려해보자는 생각이 들어서 이부분부터 공부해보았다.

**builder pattern**은 쉽게 말해서 객체의 **생성과정**과 **표현**을 나누는 방법이었는데, 레퍼런스 코드를 보는순간 생각보다 익숙한 구조라는 생각이 들었다!😲

예를 들어 아래와 같은 코드 구조를 한번쯤 보았을것이다.

```kotlin
객체.Builder // 빌더를 사용해서 속성 설정!
.setTitle("")
.build() //여기서 실제 객체가 생성됨
.show() 
```

나는 아래의 장점이 기존보다 사용성 측면에서 우수할것이라는 생각이 들어서 builder pattern을 적용하기로 결정했다.

1. 관례적으로 dialog에 많이 쓰이는 패턴이라 익숙하게 사용가능
2. 옵션 설정과정이 깔끔해짐
3. 빌더와 구현부의 역할이 나뉘면서 빌더를 변경하지 않고 다이얼로그 클래스만 변경하는 등 유지보수가 편해짐

### 🚀 Builder patten 적용


빌더 패턴을 만들기 위해 아래와 같이 클래스 구조를 설계하였다.

처음에 레퍼런스를 보면서 왜 Builder클래스를 `inner class`로 설정하지 않았을까? 하는 생각이 들었다.(이부분은 아래에 추가로 정리해두었다!)

어쨌든 아래에서 `Builder`클래스는 다이얼로그에서 사용되는 속성을 체이닝 형태로 설정할 수 있게 설계되었다.

예를 들어 `setTitle`은 title에 대한 여러 속성을 설정하고 이후 본인인 Builder를 반환해서 계속해서 속성함수를 연결할 수 있게된다.

모든 속성을 설정한 마지막에는 build()함수를 호출하여 CaArtDialog객체를 만들어 반환하게된다.

```kotlin
class CaArtDialog(private val builder: Builder) : DialogFragment() {

//...

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.builder = builder
        binding.dialog = this
        //...
    }

 class Builder(
        private val context: Context
    ) {
        var title: String? = null
 
				//...

				fun setTitle(title: String, size: Int = 16): Builder = apply {
            this.title = title
            titleTextSize = size
        }

        //...

        fun build() = CaArtDialog(this)
    }
}
```

위에 구현된 다이얼로그를 실제로 사용하는 예이다.

```kotlin
CaArtDialog.Builder(requireContext())
            .setTitle("hello",30)
            .setDescription("android")
            .setButtonType(CaArtDialog.SINGLE) //DOUBLE, SINGLE
            .setPositiveButton(listener = 
                //...
            })
            .setNegativeButton(text = "아니", listener = {
                //...
            })
            .setContentText(
                text = "abcd1234@email.com",
                hint = "hi",
                isEditable = true
            ) 
            //.setDialogContentView(view2)
            .build()
            .show(requireActivity().supportFragmentManager, "dialogTag")
```

<img src="/assets/image/2024-04-21-16-07-36.png" width=300px> <img src="/assets/image/2024-04-21-16-08-07.png" width=300px> <img src="/assets/image/2024-04-21-16-08-39.png" width=300px> <img src="/assets/image/2024-04-21-16-09-31.png" width=300px>



결론적으로 원래는 다이얼로그 종류에 따라 총 3개로 나뉘었어야 할 다이얼로그 클래스를 하나로 통일할 수 있었다!🙌

사용성 측면에서 얼마나 개선되었는지는 차차 지켜봐야겠지만 지금봤을때는 기존보다 평소에 다이얼로그를 사용하는 방법에 가까워진것같다.

+) Builder를 inner class로 만들지 않는이유 : `inner class` vs `class`

- inner class는 부모의 프로퍼티에 모두 접근 가능하다.
- 반면 클래스는 접근 불가능하다.
- 따라서 빌더패턴의 특성상 빌더가 다이얼로그의 프로퍼티에 접근해야 할 필요가 없으므로 클래스로 선언하는게 적합하다.

### 결론!

이번에 배운 내용은 총 2가지인것같다.

**새로운 부족한점**

보통 이런 협업 상황에서 커스텀 뷰를 만들때는 다른 사람이 사용할것을 대비해서 사용성을 먼저 생각하게 되서 이번에도 나름대로 최대한 사용하기 편한 구조를 설계하려고 노력했다.

하지만 그 노력에 내가 목표로 했던 사용성에 관한 레퍼런스를 찾는 과정이 빠져있다는것을 깨닫게 되었다😓

구현에 대한 레퍼런스는 평소에 많이 찾아보는 편인데, 뷰의 활용에 대한 부분은 평소에 활용하는게 아니라면 잘 모르고 있는것 같다.

이번 기회에 이런 부족한 부분알게 되었으니 더 다양한 뷰를 사용하고 공부하도록 노력해야겠다!

또 다음에는 이런 부분을 개선해서 구글이 만들었는지 내가 만들었는지 구분하기 어려울 정도로 사용이 익숙한 커스텀 뷰를 만들 수 있었으면 좋겠다!

**질문의 중요성**

사실 나는 개발을 하다보면 익숙한 방법으로 개발하려고 하는 경우가 많아서 이런 부분을 경계하려고 하는데 쉽지 않은것같다.

이번에도 사실 질문을 드려 조언을 받지 못했으면 builder pattern의 존재조차 모르고 넘어갔을거다.

이번 경험에서 익숙함을 경계하는 좋은 방법 중 하나가 질문이라는것을 알게 되었다.

항상 더 좋은 방법이 있는지 스스로 질문하고 다른사람에게도 조언을 구해서 더 좋은 개발자가 되었으면 좋겠다!😊