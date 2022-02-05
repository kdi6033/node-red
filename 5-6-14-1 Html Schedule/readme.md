
# node-red를 이용한 간단한 HTML 스케쥴러

## 기능 :
node-red의 팔레트에 있는 ui_scheduler를 html 환경에서 사용할 수 있도록 간략한 기능만 구현.
1. 날짜, 시작 시간, 끝 시간을 사용자가 입력하여 스케쥴 추가
2. delay 노드를 응용한 스케쥴의 실행
3. 끝난 스케쥴을 mongoDB에서 제거

## 요구 사항 :
1. 첨부된 down-aws-12, credentials.h, handleHttp, tools 가 프로그래밍되어 있는 D1 mini
2. D1 mini와 RS485로 통신할 수 있도록 연결된 릴레이 보드
3. node-red 프로그램

## 주의사항 :
RS485로 통신하는 릴레이 보드에 맞게 설정된 node-red flow이므로, mqtt를 통해 데이터를 전송하는 부분은 사용자가 이용하려는 기기에 맞게 수정해야 함.
아두이노 소스코드 중 credentials와 관련된 부분 또한 사용자가 사용하고 있는 AWS 인스턴스에 맞게 수정해야 함.

## 화면 :

![image](https://user-images.githubusercontent.com/28778082/152629140-60542627-8b2e-4fe1-8060-dbdd84f1861e.png)
