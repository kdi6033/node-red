# 구글 챗봇 Custom Payload, Web Demo, Dialogflow Messenger

Intents 이름: 구글챗봇의 Custom Payload를 이용해 리치 설명, 정보, 그림, 버튼, 선택, 리스트 등을 처리하는 프로그램을 설명한다.

다음 사이트를 참조해서 만들었습니다.
참조사이트 : https://miningbusinessdata.com/dialogflow-messenger-tutorial/


1. Description type :  
Intents 이름: richDes   
Training phrases : 리치설명

<img src="https://user-images.githubusercontent.com/37902752/132096660-0e6092a2-3528-4383-8387-741b84e46284.png" width="400" height="400" />
Custom Payload                      
```
{
  "richContent": [
    [
      {
        "title": "전등 리스트",
        "type": "description",
        "text": [
          "안방전등",
          "거실전등"
        ]
      }
    ]
  ]
}
```

2. Info type
Intents 이름:  richInfo  
Training phrases : 리치정보
<img src="https://user-images.githubusercontent.com/37902752/132097458-c18f3640-d504-4945-8845-2a0c2d630f75.png" width="400" height="400" />
Custom Payload 
```
{
  "richContent": [
    [
      {
        "type": "info",
        "title": "제목",
        "subtitle": "부제목",
        "image": {
          "src": {
            "rawUrl": "http://i2r.link/image/i2r_small.png"
          }
        },
        "actionLink":"https://i2r.link"
      }
    ]
  ]
}
```

3. Image type
Intents 이름:  richImage 
Training phrases : 리치그림
<img src="https://user-images.githubusercontent.com/37902752/132097458-c18f3640-d504-4945-8845-2a0c2d630f75.png" width="400" height="400" />
Custom Payload 
```
{
  "richContent": [
    [
      {
        "type": "image",
        "accessibilityText":"MBD Image",
        "rawUrl": "http://i2r.link/image/sunset.jpg"
      }
    ]
  ]
}
```

4. Button type
Intents 이름:  richButton 
Training phrases : 리치버튼
```
{
  "richContent": [
    [
      {
        "link":"http://i2r.link",
        "text": "Go to Idea to Real",
        "icon": {
          "type":"link",
          "color":"#FF9800"
        },
        "type": "button"
      }
    ]
  ]
}
```

5. Suggestion Chips
Intents 이름:  richSuggestion  
Training phrases : 리치선택
```
{
  "richContent": [
    [
      {
        "type":"chips",
        "options": [
          {
            "text":"yes"
          },
          {
            "text":"no"
          }
        ]
      }
    ]
  ]
}
```

6. List Response Type
Intents 이름:  richList 
Training phrases : 리치리스트
```
{
  "richContent": [
    [
      {
        "title":"List item 1 title",
        "subtitle":"List Item 1 subtitle",
        "type":"list",
        "event": {
          "parameters":{},
          "name":"WELCOME",
          "languageCode":"en"
        }
      },
      {
        "type":"divider"
      },
      {
        "title":"List item 2 title",
        "subtitle":"List Item 2 subtitle",
        "type":"list",
        "event": {
          "parameters":{},
          "name":"PARALLEL",
          "languageCode":"en"
        }
      }
    ]
  ]
}
```

김동일교수 유튜브목차 : http://i2r.link


