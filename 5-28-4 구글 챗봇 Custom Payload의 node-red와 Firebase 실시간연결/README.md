# 구글 챗봇 Custom Payload의 richContent로 아마존 node-red와 연결된 Led 제어 
다이어로그프로우에서 Default / Custom Payload /  richContent 를 이용해 구글 메신져 챗봇을 만든다.
- "54.214.53.183" 주소에는 자신의 아마존 서버 주소를 입력하세요. 
- "http://117.16.177.40/image/led-on.jpg" 117.16.177.40에는 자신의 아마존 서버 주소를 입력하세요.  그리고 아마존 크라우드에 아파치를 설치한 후 웹페이지가 시작되는  www/html 디렉토리에 "image"라는 디렉토리를 만들고 인터넷으로 "led icon"으로 검색하면 여러 개의 이미지 중 맘에 드는 것으로 "led-on.jpg"  "led-off.jpg"  그림을 저장하세요.
Custom Payload
```
Custom Payload
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


{
  "richContent": [
    [
      {
        "actionLink": "http://54.214.53.183:1880/led?name=안방&on=1",
        "title": "안방전등 ON",
        "image": {
          "src": {
            "rawUrl": "http://117.16.177.40/image/led-on.jpg"
          }
        },
        "type": "info"
      },
      {
        "type": "info",
        "actionLink": "http://54.214.53.183:1880/led?name=안방&on=0",
        "image": {
          "src": {
            "rawUrl": "http://117.16.177.40/image/led-off.jpg"
          }
        },
        "title": "안방전등 OFF"
      },
      {
        "options": [
          {
            "text": "처음으로"
          }
        ],
        "type": "chips"
      }
    ]
  ]
}
```

전등 한개 node red 소스프로그램
```
[
    {
        "id": "6ca46c4c.dfa614",
        "type": "debug",
        "z": "fd0ab9ba5056f0a5",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 470,
        "y": 320,
        "wires": []
    },
    {
        "id": "b5e83614.938d18",
        "type": "template",
        "z": "fd0ab9ba5056f0a5",
        "name": "page",
        "field": "payload",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": "<html>\n    <HEAD>\n        <script>window.opener = window.location.href; self.close();</script>\n    </HEAD>\n</html>",
        "output": "str",
        "x": 430,
        "y": 400,
        "wires": [
            [
                "42e7c36de993ca74"
            ]
        ]
    },
    {
        "id": "aa70b1de.8c43e",
        "type": "function",
        "z": "fd0ab9ba5056f0a5",
        "name": "",
        "func": "msg.payload=msg.payload.on;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 440,
        "y": 460,
        "wires": [
            [
                "9672f238efb9f340"
            ]
        ]
    },
    {
        "id": "504032f7111331ae",
        "type": "http in",
        "z": "fd0ab9ba5056f0a5",
        "name": "GET LED",
        "url": "/led",
        "method": "get",
        "upload": false,
        "swaggerDoc": "",
        "x": 260,
        "y": 400,
        "wires": [
            [
                "b5e83614.938d18",
                "aa70b1de.8c43e",
                "6ca46c4c.dfa614"
            ]
        ]
    },
    {
        "id": "42e7c36de993ca74",
        "type": "http response",
        "z": "fd0ab9ba5056f0a5",
        "name": "",
        "statusCode": "",
        "headers": {},
        "x": 610,
        "y": 400,
        "wires": []
    },
    {
        "id": "9672f238efb9f340",
        "type": "ui_led",
        "z": "fd0ab9ba5056f0a5",
        "order": 0,
        "group": "e088a523a4619a18",
        "width": 0,
        "height": 0,
        "label": "",
        "labelPlacement": "left",
        "labelAlignment": "left",
        "colorForValue": [
            {
                "color": "#04ff00",
                "value": "1",
                "valueType": "str"
            },
            {
                "color": "#d0d7d0",
                "value": "0",
                "valueType": "str"
            }
        ],
        "allowColorForValueInMessage": false,
        "shape": "circle",
        "showGlow": true,
        "name": "",
        "x": 620,
        "y": 460,
        "wires": []
    },
    {
        "id": "e088a523a4619a18",
        "type": "ui_group",
        "name": "Group 1",
        "tab": "2be4bae4ad8203fd",
        "order": 1,
        "disp": true,
        "width": 6
    },
    {
        "id": "2be4bae4ad8203fd",
        "type": "ui_tab",
        "name": "Tab 1",
        "icon": "dashboard",
        "order": 1
    }
]
```
전등 두개 node red 소스프로그램
```
[
    {
        "id": "fd0ab9ba5056f0a5",
        "type": "tab",
        "label": "플로우 1",
        "disabled": false,
        "info": ""
    },
    {
        "id": "6ca46c4c.dfa614",
        "type": "debug",
        "z": "fd0ab9ba5056f0a5",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 470,
        "y": 320,
        "wires": []
    },
    {
        "id": "b5e83614.938d18",
        "type": "template",
        "z": "fd0ab9ba5056f0a5",
        "name": "page",
        "field": "payload",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": "<html>\n    <HEAD>\n        <script>window.opener = window.location.href; self.close();</script>\n    </HEAD>\n</html>",
        "output": "str",
        "x": 430,
        "y": 400,
        "wires": [
            [
                "42e7c36de993ca74"
            ]
        ]
    },
    {
        "id": "504032f7111331ae",
        "type": "http in",
        "z": "fd0ab9ba5056f0a5",
        "name": "GET LED",
        "url": "/led",
        "method": "get",
        "upload": false,
        "swaggerDoc": "",
        "x": 260,
        "y": 400,
        "wires": [
            [
                "b5e83614.938d18",
                "6ca46c4c.dfa614",
                "a8f34053e3531027"
            ]
        ]
    },
    {
        "id": "42e7c36de993ca74",
        "type": "http response",
        "z": "fd0ab9ba5056f0a5",
        "name": "",
        "statusCode": "",
        "headers": {},
        "x": 610,
        "y": 400,
        "wires": []
    },
    {
        "id": "9672f238efb9f340",
        "type": "ui_led",
        "z": "fd0ab9ba5056f0a5",
        "order": 0,
        "group": "e088a523a4619a18",
        "width": 0,
        "height": 0,
        "label": "",
        "labelPlacement": "left",
        "labelAlignment": "left",
        "colorForValue": [
            {
                "color": "#04ff00",
                "value": "1",
                "valueType": "str"
            },
            {
                "color": "#d0d7d0",
                "value": "0",
                "valueType": "str"
            }
        ],
        "allowColorForValueInMessage": false,
        "shape": "circle",
        "showGlow": true,
        "name": "",
        "x": 790,
        "y": 460,
        "wires": []
    },
    {
        "id": "d4fdc9bee946f1a3",
        "type": "ui_led",
        "z": "fd0ab9ba5056f0a5",
        "order": 0,
        "group": "e088a523a4619a18",
        "width": 0,
        "height": 0,
        "label": "",
        "labelPlacement": "left",
        "labelAlignment": "left",
        "colorForValue": [
            {
                "color": "#04ff00",
                "value": "1",
                "valueType": "str"
            },
            {
                "color": "#d0d7d0",
                "value": "0",
                "valueType": "str"
            }
        ],
        "allowColorForValueInMessage": false,
        "shape": "circle",
        "showGlow": true,
        "name": "",
        "x": 790,
        "y": 500,
        "wires": []
    },
    {
        "id": "a8f34053e3531027",
        "type": "switch",
        "z": "fd0ab9ba5056f0a5",
        "name": "",
        "property": "payload.name",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": "room1",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "room2",
                "vt": "str"
            }
        ],
        "checkall": "true",
        "repair": false,
        "outputs": 2,
        "x": 410,
        "y": 480,
        "wires": [
            [
                "054839875ecd9e99"
            ],
            [
                "a176d55dc073e548"
            ]
        ]
    },
    {
        "id": "054839875ecd9e99",
        "type": "function",
        "z": "fd0ab9ba5056f0a5",
        "name": "",
        "func": "msg.payload=msg.payload.on;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 600,
        "y": 460,
        "wires": [
            [
                "9672f238efb9f340"
            ]
        ]
    },
    {
        "id": "a176d55dc073e548",
        "type": "function",
        "z": "fd0ab9ba5056f0a5",
        "name": "",
        "func": "msg.payload=msg.payload.on;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 600,
        "y": 500,
        "wires": [
            [
                "d4fdc9bee946f1a3"
            ]
        ]
    },
    {
        "id": "e088a523a4619a18",
        "type": "ui_group",
        "name": "Group 1",
        "tab": "2be4bae4ad8203fd",
        "order": 1,
        "disp": true,
        "width": 6
    },
    {
        "id": "2be4bae4ad8203fd",
        "type": "ui_tab",
        "name": "Tab 1",
        "icon": "dashboard",
        "order": 1
    }
]
```


김동일교수 유튜브 목차 : http://i2r.link
