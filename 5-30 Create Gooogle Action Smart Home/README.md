## 스마트홈 (Google Actio Smart Home) 만들기

1. [Actions on Google Console](https://console.actions.google.com/ "Action Google")
로 이동합니다.
2. 새 프로젝트를 클릭하고 프로젝트 이름을 입력 한 후 프로젝트 생성을 클릭하십시오.
3. Smart Home App 를 선택하십시오.
4. 작업 콘솔의 개요 화면에서 스마트 홈을 선택하십시오.
5. Actions Console의 __Develop > Invocation__ 에서 언어는 Korean을 선택한 후에 Display name을 입력한다. 
6. __Develop > Actions__ 에서 Fullfilment URL을 입력한다. 
    https://us-central1-<project-id>.cloudfunctions.net/smarthome
7. __Develop > Account linking__ 에서 다음과 같이 입력한다.     
Client ID               : ABC123    
Client secret           : DEF456    
    Authorization URL       : https://us-central1-<project-id>.cloudfunctions.net/fakeauth      
    Token URL               : https://us-central1-<project-id>.cloudfunctions.net/faketoken      
8. [Google 클라우드 플랫폼](https://console.cloud.google.com/)으로 이동한다.
9. 상단의 메뉴 "__SmartHomeProject for Codelab__"에서 해당 프로젝트를 선택한다.
10. HomeGraph API 설치 : 햄버거 아니콘을 선택해 "__API 및 서비스 > 대시보드 > API 및 서비스 사용 설정__"을 선택하고 검색창에 "Home"을 입력하여 "HomeGraph API"를 선택해서 설치한다.      
"__API 및 서비스 HomeGraph API > 사용자 인증 정보 > 사용자 인증 정보 만들기 > 서비스 계정 > 서비스 계정 세부정보__" 에 "MyTestApp"라고 입력한다. 이는 다른 한글 이름을 넣어도 된다. 그 아래의 서비스 계정 설명에는 이를 설명하는 문구를 넣고 "만들기"를 선택한다.
11. __역할선택 > 서비스계정 > 서비스 계정 토큰 생성자 > 계속 > 키생성 > json__ 을 선택하고 파일을 저장한 후에 파일 이름을 "smart-home-key.json"을 바꾼다.






10. https://nodejs.org/en/download/에서 Node.js를 다운로드하여 설치하십시오.     

firebase CLI를 설치하려면 터미널에서 다음 npm 명령을 실행하십시오.
sudo npm install -g firebase-tools
CLI가 올바르게 설치되었는지 확인하려면 다음을 실행하십시오.
파이어베이스-버전
다음을 실행하여 Google 계정으로 Firebase CLI에 권한을 부여하십시오.
파이어베이스 로그인
git을 설치하고 다음을 사용하여 프로젝트를 복제하십시오.
sudo apt-get 설치 git
git clone https://github.com/shivasiddharth/google-actions-smarthome