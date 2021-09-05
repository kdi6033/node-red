# 구글 챗봇 Custom Payload의 richContent로 아마존 node-red와 연결된 Led 제어 (안방,주방)
다이어로그프로우를 이용해 구글 메신져 챗봇을 만든다.

<img src="https://user-images.githubusercontent.com/37902752/132120204-93fba705-c5a7-4de5-87ca-bf586fa44bf0.png" width="50%" height="50%" />

- 다이어로그 처음 시작하는 "Default Welcome Intent" "Training phrases"에 "처음으로"라는 음성인식을 추가하고 아래 프로그램을 추가한다.

Custom Payload

```
{
  "richContent": [
    [
      {
        "type": "chips",
        "options": [
          {
            "text": "리치설명"
          },
          {
            "text": "리치정보"
          },
          {
            "text": "리치그림"
          },
          {
            "text": "리치버튼"
          },
          {
            "text": "리치선택"
          },
          {
            "text": "리치리스트"
          }
        ]
      }
    ]
  ]
}
```

"richinfo" Intents에 아래 프로그램을 추가한다. 
- "18.237.189.188" 주소에는 자신의 아마존 서버 주소를 입력하세요. 
- "http://i2r.link/image/led-on.jpg"에 i2r.link에 자신의 아마존 서버 주소를 입력하세요. 아니면 그대로 놔두면 여기 주소의 그림을 가져옴으로 그대로 사용해도 된다.
- 아마존 크라우드에 아파치를 설치한 후 웹페이지가 시작되는  www/html 디렉토리에 "image"라는 디렉토리를 만들고 인터넷으로 "led icon"으로 검색하면 여러 개의 이미지 중 맘에 드는 것으로 "led-on.jpg"  "led-off.jpg"  그림을 저장하세요.

Custom Payload

```
{
  "richContent": [
    [
      {
        "rawUrl": "http://i2r.link/image/home.png",
        "accessibilityText": "MBD Image",
        "type": "image"
      },
      {
        "type": "info",
        "actionLink": "http://18.237.189.188:1880/led?name=안방&on=1",
        "image": {
          "src": {
             "rawUrl": "http://i2r.link/image/led-on.jpg"
          }
        },
        "title": "안방전등 ON"
      },
      {
        "actionLink": "http://18.237.189.188:1880/led?name=안방&on=0",
        "title": "안방전등 OFF",
        "image": {
          "src": {
            "rawUrl": "http://i2r.link/image/led-off.jpg"
          }
        },
        "type": "info"
      },
      {
        "actionLink": "http://18.237.189.188:1880/led?name=주방&on=1",
        "type": "info",
        "image": {
          "src": {
            "rawUrl": "http://i2r.link/image/led-on.jpg"
          }
        },
        "title": "주방전등 ON"
      },
      {
        "type": "info",
        "actionLink": "http://18.237.189.188:1880/led?name=주방&on=0",
        "image": {
          "src": {
            "rawUrl": "http://i2r.link/image/led-off.jpg"
          }
        },
        "title": "주방전등 OFF"
      },
      {
        "type": "chips",
        "options": [
          {
            "text": "처음으로"
          }
        ]
      }
    ]
  ]
}
```

다음은 자신의 node-red에 전등 led를 on off 하는 프로그램을 추가한다.
전등 한개 node red 소스프로그램
```
[{"id":"2320e08e.e2c2b","type":"debug","z":"f78012f2.c154b","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":330,"y":80,"wires":[]},{"id":"9e3c1695.9ae148","type":"template","z":"f78012f2.c154b","name":"page","field":"payload","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"<html>\n    <HEAD>\n        <script>window.opener = window.location.href; self.close();</script>\n    </HEAD>\n</html>","output":"str","x":290,"y":160,"wires":[["987250d0.991d4"]]},{"id":"6e56f9a7.264b28","type":"http in","z":"f78012f2.c154b","name":"GET LED","url":"/led","method":"get","upload":false,"swaggerDoc":"","x":120,"y":160,"wires":[["9e3c1695.9ae148","2320e08e.e2c2b","ea745d63.de72"]]},{"id":"987250d0.991d4","type":"http response","z":"f78012f2.c154b","name":"","statusCode":"","headers":{},"x":470,"y":160,"wires":[]},{"id":"ecc41e35.d4d4c","type":"ui_led","z":"f78012f2.c154b","order":0,"group":"e088a523a4619a18","width":0,"height":0,"label":"안방","labelPlacement":"left","labelAlignment":"left","colorForValue":[{"color":"#04ff00","value":"1","valueType":"str"},{"color":"#d0d7d0","value":"0","valueType":"str"}],"allowColorForValueInMessage":false,"shape":"circle","showGlow":true,"name":"","x":650,"y":220,"wires":[]},{"id":"b7541d88.0d7de","type":"ui_led","z":"f78012f2.c154b","order":0,"group":"e088a523a4619a18","width":0,"height":0,"label":"주방","labelPlacement":"left","labelAlignment":"left","colorForValue":[{"color":"#04ff00","value":"1","valueType":"str"},{"color":"#d0d7d0","value":"0","valueType":"str"}],"allowColorForValueInMessage":false,"shape":"circle","showGlow":true,"name":"","x":650,"y":260,"wires":[]},{"id":"ea745d63.de72","type":"switch","z":"f78012f2.c154b","name":"","property":"payload.name","propertyType":"msg","rules":[{"t":"eq","v":"안방","vt":"str"},{"t":"eq","v":"주방","vt":"str"}],"checkall":"true","repair":false,"outputs":2,"x":270,"y":240,"wires":[["63976c7e.0a6cf4"],["c912d482.1a3008"]]},{"id":"63976c7e.0a6cf4","type":"function","z":"f78012f2.c154b","name":"","func":"msg.payload=msg.payload.on;\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":460,"y":220,"wires":[["ecc41e35.d4d4c"]]},{"id":"c912d482.1a3008","type":"function","z":"f78012f2.c154b","name":"","func":"msg.payload=msg.payload.on;\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":460,"y":260,"wires":[["b7541d88.0d7de"]]},{"id":"e088a523a4619a18","type":"ui_group","name":"Group 1","tab":"2be4bae4ad8203fd","order":1,"disp":true,"width":6},{"id":"2be4bae4ad8203fd","type":"ui_tab","name":"Tab 1","icon":"dashboard","order":1}]
```


김동일교수 유튜브 목차 : http://i2r.link
