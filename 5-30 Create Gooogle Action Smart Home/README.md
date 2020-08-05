# 스마트홈 (Google Actio Smart Home) 만들기

1. Actions on Google Console로 이동합니다.
2. 새 프로젝트를 클릭하고 프로젝트 이름을 입력 한 후 프로젝트 생성을 클릭하십시오.
3. Smart Home App 를 선택하십시오.
4. 작업 콘솔의 개요 화면에서 스마트 홈을 선택하십시오.
5. Actions Console의 Develop->Invocation 에서 언어는 Korean을 선택한 후에 Display name을 입력한다. 
6. Develop->Actions 에서 Fullfilment URL을 입력한다. 
    https://us-central1-<project-id>.cloudfunctions.net/smarthome
7. Develop->Account linking 에서 다음과 같이 입력한다.
    Client ID               : ABC123
    Client secret           : DEF456
    Authorization URL       : https://us-central1-<project-id>.cloudfunctions.net/fakeauth  
    Token URL               : https://us-central1-<project-id>.cloudfunctions.net/faketoken   


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