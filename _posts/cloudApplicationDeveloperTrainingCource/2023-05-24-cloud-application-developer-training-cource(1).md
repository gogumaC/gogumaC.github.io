---
title: "[match-up] 클라우드 Application Developer 양성 과정(1)"
categories: matchup
excerpt : "1주차 : Azure Web개발에 사용할 수 있는 서비스"
tags:
    - [cloudApplicationDeveloperTrainingCource, kmooc,matchup]
date : 2023-05-24
last_modified_at: 2023-05-24
toc : ture
toc_sticky : true
---
이제 슬슬 졸업 학년이 되니 학교 강의를 들을 일이 적어졌다. 

1,2학년 때 들어야 해서 들을 때는 별 감흥이 없었는데, 막상 배우고 싶은 게 많아진 지금은 듣고 싶어도 듣지 못하는 아이러니한 상황에 빠져버렸다.😅

그러다 k-mooc에서 match-up 프로그램에 여러 기술관련 강의들이 올라왔고 평소 클라우드에 관심이 많았어서 바로 수강신청 했다!!

이 과정은 MS Azure의 클라우드 서비스에 대한 교육이며 김영욱 교수님이 강의하신다.

성함이 뭔가 익숙하다 했는데 저번에 참여했던 2023 Global AI Bootcamp에서 연사로 첫번째 세션을 진행하셨던 분이셨다!😲

강의력도 좋으시고 내용도 대부분 IOT강의에서 배운 내용들이라서 1주차는 웹에 대해서는 거의 무지렁이인 나도 잘 이해할 수 있었다!

<br>

---

# 1주차 : Azure Web개발에 사용할 수 있는 서비스

### 학습목표

- MS Azure에서 웹개발에 사용할 수 있는 다양한 방법 학습
- MS가 제공하는 클라우드 플랫폼과 인프라
- Azure에서 사용할 수 있는 다양한 웹 개발 방법의 이해
- 플랫폼 Azure서비스(PaaS)기반으로 서비스를 사용할 때 얻을 수 있는 장점 학습

### 클라우드 서비스 종류

- On-premise
    
    : 직접 서버구축
    
- IaaS
    
    : o/s, 미들웨어,런타임(자바, 파이선, 등),앱, 데이터 직접 관리
    
    : 기존 온프레미스를 포팅하기 좋음
    
- PaaS
    
    : 데이터, 어플리케이션만 직접관리
    
- SaaS
    
    : 어플리케이션만 사용
    
    : 오피스365 , gmail 등
    

### Azure 가상머신

- IaaS 기반으로 가상화
- 디스크 : OS, 데이터, 임시(temp)
- NSG(Network Security Group)에 의해 보안됨

## 1차시 : Azure Web 개발에 사용할 수 있는 서비스

- 리소스 : 클라우드에서 제공하는 모든것들
- 리소스그룹 : 리소스를 그룹화 한것
- 프로비저닝 : 가상머신이 배포되는 과정

### 👀가상머신 기반 웹서버 만들기 (IaaS기반 WordPress 사이트 생성)

1. 워드프레스가 탑재된 가상머신 만들기
    새 리소스 만들기에서 아래같이 wordPress를 검색해서 만들기를 실행한다

    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/wordpress_search.png" width=400px> <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/wordpress.png"  width=400px>

    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/create_vm.png"  width=500px>
     
    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/vm_deploy_result.png"  width=500px>
2. 확인
    리소스로 이동> 공용 IP주소를 검색창에 입력

    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/vm_resource.png">

    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/vm_result.png" width=500px>

## 2차시 : Azure App Service(PaaS 기반)

- Azure Web App : Web App 실행시키기 위한 서비스
- 앱서비스 : 서버에 들어있는 실제 서비스
- 앱 서비스 플랜 : 서버의 용량결정

### 👀PaaS기반 앱 서비스 만들기

1. create>”web app”검색> 웹앱 만들기
    
    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/webapp_search.png"  width=500px><img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/create_webapp.png" width=500px>
    
2. 리소스 > url클릭해 확인
    
    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/webapp_resource.png" width=500px>   <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/webapp_result.png" width=400px>
    

### 살펴보기

- Quick Start : 통계
- ScaleUp : 더 좋은 부품 컴퓨터로 교체해서 더많은 리소스 할당
    
    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/scaleup.png" width=500px>
    
- ScaleOut : 컴퓨터 대수를 늘려 더 많은 리소스 할당받음
    
    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/scaleout.png" width=500px>
    
    - AutoScale
- Deployment slot
    - 슬롯 추가를 통해 개발용 사이트 생성가능
    - swap기능을 통해 개발용 슬롯과 배포중인 슬롯을 전환가능
    
    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/deploy_slot.png">
    
    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/add_slot.png">
    
    <img src="\assets/image/matchup/cloudApplicatonDeveloperTrainingCource/230524-week1-service-available-for-azure-web-development/added_deploy_slot.png">
    

## 3차시 : Azure Web운영에 필요한 서비스들

- 웹서버 : 기본적인 뼈대인 HTML제공
- DNS : 도메인네임 ↔ 아이피 주소 (Azure Traffic Manager)
- CDN(Content Delivery Network) 빠르게 제공해야하는 컨텐츠(동영상, 사이즈가 큰 파일) 제공→ 많이쓰면 단가 내려감
- 부하분산(로드밸런서)
    - L4스위치 / L3스위치 - IaaS기반에서 필요
    - L7 application gateway서비스 : url routing가능
- Azure Functions : 특정 이벤트에 따라 동작하는 코드작성
- 스토리지
    - Queue Storage : 큐 형태의 스토리지
    - Table Storage : 테이블 형태의 스토리지
    - Blob Storage : 모든 데이터 형태 업로드 가능
    - file Storage : SMB(네트워크 파일공유 프로토콜)있음
    
<br>



## 요약

- 애저에서는 IaaS,Paas기반 웹서비스 준비됨
- PaaS기반 서비스 구현하면 관리부담 감소가능
- 웹 개발위해 DNS , CDN , TrafficManager, 부하분산장치, 스토리지 계정 등 여러 서비스를 사용해야 함.