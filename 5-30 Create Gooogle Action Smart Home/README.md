## 스마트홈 (Google Actio Smart Home) 만들기    
### Action Google과 Google Cloud 설정
1. [Actions on Google Console](https://console.actions.google.com/ "Action Google")
로 이동합니다.
2. 새 프로젝트를 클릭하고 프로젝트 이름을 입력 한 후 프로젝트 생성을 클릭하십시오.
3. Smart Home App 를 선택하십시오.
4. 작업 콘솔의 개요 화면에서 스마트 홈을 선택하십시오.
5. Actions Console의 __Develop > Invocation__ 에서 언어는 Korean을 선택한 후에 Display name을 입력한다. 
6. __Develop > Actions__ 에서 Fullfilment URL을 입력한다. 
    https://us-central1-<project-id\>.cloudfunctions.net/smarthome
7. __Develop > Account linking__ 에서 다음과 같이 입력한다.     
Client ID               : ABC123    
Client secret           : DEF456    
    Authorization URL       : https://us-central1-<project-id\>.cloudfunctions.net/fakeauth      
    Token URL               : https://us-central1-<project-id\>.cloudfunctions.net/faketoken      
8. [Google 클라우드 플랫폼](https://console.cloud.google.com/)으로 이동한다.
9. 상단의 메뉴 "__Google Cloud Platform__"에서 해당 프로젝트를 선택한다.
10. HomeGraph API 설치 : 햄버거 아니콘을 선택해 "__API 및 서비스 > 대시보드 > API 및 서비스 사용 설정__"을 선택하고 검색창에 "Home"을 입력하여 "HomeGraph API"를 선택해서 설치한다.      
"__API 및 서비스 HomeGraph API > 사용자 인증 정보 > 사용자 인증 정보 만들기 > 서비스 계정 > 서비스 계정 세부정보__" 에 "MyTestApp"라고 입력한다. 이는 다른 한글 이름을 넣어도 된다. 그 아래의 서비스 계정 설명에는 이를 설명하는 문구를 넣고 "만들기"를 선택한다.
11. __역할선택 > 서비스계정 > 서비스 계정 토큰 생성자 > 계속 > 키생성 > json__ 을 선택하고 파일을 저장한 후에 파일 이름을 "smart-home-key.json"을 바꾼다.
 
### 제어프로그램 작성과 업로드
1. 참조사이트 https://github.com/shivasiddharth/google-actions-smarthome 에서 "Code"를 선택해 소스프로그램을 내려받고 압축을 푼다.
2. 다음 디렉토리로 이동 google-actions-smarthome-master\smarthome-control\functions 
3. console창에서 다음을 순서대로 실행한다.      
firebase login      
firebase use \<project-id\>       
npm install     
firebase deploy
4. 다음 URL로 접속한다.     
https://us-central1-\<project-id\>.cloudfunctions.net/smarthome
5. Google Home을 시작한다.


Google Smart Home 문서 : 기기들 상세 프로그램을 하려면 참조하세요 https://developers.google.cn/assistant/smarthome/overview

참조유튜브 : https://www.youtube.com/watch?v=e1C5WIfZ89s