# node-red

## 5.6.12 Node-RED WebSocket 노드레드에서 웹소켙 사용하기    
[유튜브보기](https://youtu.be/Qob1-N8fe3w)   
node-red 에서 UI로 html을 사용할 때 node-red와 html 사이에 WebSocket 방식으로 통신을 하여 실시간으로 업데이트 되는 홈페이지 작성법을 설명한다.    
소스프로그램     
```
[{"id":"fd6546df.632a18","type":"inject","z":"4d7f7afa.615144","name":"Tick every 5 secs","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"5","crontab":"","once":false,"onceDelay":"","topic":"test","payload":"","payloadType":"date","x":170,"y":180,"wires":[["6525495f.1eecd8"]]},{"id":"370263af.e0203c","type":"websocket out","z":"4d7f7afa.615144","name":"","server":"985ecbc7.67a138","client":"","x":560,"y":180,"wires":[]},{"id":"6525495f.1eecd8","type":"function","z":"4d7f7afa.615144","name":"format time nicely","func":"msg.payload = Date(msg.payload).toString();\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":370,"y":180,"wires":[["370263af.e0203c"]]},{"id":"734ecc43.6050a4","type":"websocket in","z":"4d7f7afa.615144","name":"","server":"985ecbc7.67a138","client":"","x":360,"y":280,"wires":[["340e1c45.9716c4"]]},{"id":"340e1c45.9716c4","type":"debug","z":"4d7f7afa.615144","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":570,"y":280,"wires":[]},{"id":"286f978b.ef2a18","type":"comment","z":"4d7f7afa.615144","name":"https://flows.nodered.org/flow/8666510f94ad422e4765","info":"","x":420,"y":60,"wires":[]},{"id":"9b1de891.a8df68","type":"comment","z":"4d7f7afa.615144","name":"웹소켙","info":"","x":150,"y":60,"wires":[]},{"id":"80d75e74.6d99a","type":"inject","z":"4d7f7afa.615144","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"테스트","payloadType":"str","x":370,"y":220,"wires":[["370263af.e0203c"]]},{"id":"68eef96b.216138","type":"template","z":"4d7f7afa.615144","name":"Simple Web Page","field":"payload.scriptSocket","fieldType":"msg","format":"html","syntax":"mustache","template":"        var ws;\n        var wsUri = \"ws:\";\n        var loc = window.location;\n        console.log(loc);\n        if (loc.protocol === \"https:\") { wsUri = \"wss:\"; }\n        // This needs to point to the web socket in the Node-RED flow\n        // ... in this case it's ws/simple\n        wsUri += \"//\" + loc.host + loc.pathname.replace(\"simple\",\"ws/simple\");\n\n        function wsConnect() {\n            console.log(\"connect\",wsUri);\n            ws = new WebSocket(wsUri);\n            //var line = \"\";    // either uncomment this for a building list of messages\n            ws.onmessage = function(msg) {\n                var line = \"\";  // or uncomment this to overwrite the existing message\n                // parse the incoming message as a JSON object\n                var data = msg.data;\n                console.log(data);\n                // build the output from the topic and payload parts of the object\n                line += \"<p>\"+data+\"</p>\";\n                // replace the messages div with the new \"line\"\n                document.getElementById('messages').innerHTML = line;\n                //ws.send(JSON.stringify({data:data}));\n            }\n            ws.onopen = function() {\n                // update the status div with the connection status\n                document.getElementById('status').innerHTML = \"connected\";\n                //ws.send(\"Open for data\");\n                console.log(\"connected\");\n            }\n            ws.onclose = function() {\n                // update the status div with the connection status\n                document.getElementById('status').innerHTML = \"not connected\";\n                // in case of lost connection tries to reconnect every 3 secs\n                setTimeout(wsConnect,3000);\n            }\n        }\n        \n        function doit(m) {\n            if (ws) { ws.send(m); }\n        }","x":350,"y":120,"wires":[["2ee6d3d5.235dec"]]},{"id":"2ee6d3d5.235dec","type":"template","z":"4d7f7afa.615144","name":"Main html","field":"payload","fieldType":"msg","format":"html","syntax":"mustache","template":"<!DOCTYPE HTML>\n<html>\n<head>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <script type=\"text/javascript\"> {{{payload.scriptSocket}}} </script>\n</head>\n    <body onload=\"wsConnect();\" onunload=\"ws.disconnect();\">\n        <h1>웹소켙</h1>\n        <div id=\"messages\"></div>\n        <div id=\"status\">unknown</div>\n        <hr/>\n        <button type=\"button\" onclick='doit(\"누름\");'>Click to send message</button>\n    </body>\n</html>\n\n","x":520,"y":120,"wires":[["42a28745.bd5d78"]]},{"id":"42a28745.bd5d78","type":"http response","z":"4d7f7afa.615144","name":"","x":650,"y":120,"wires":[]},{"id":"1787be40.e87842","type":"http in","z":"4d7f7afa.615144","name":"","url":"/simple","method":"get","swaggerDoc":"","x":161,"y":120,"wires":[["68eef96b.216138"]]},{"id":"985ecbc7.67a138","type":"websocket-listener","z":"4d7f7afa.615144","path":"/ws/simple","wholemsg":"false"}]
```
## 5.6.13 노드레드 콘트롤용 웹소켙 사용하기    
[유튜브보기](https://youtu.be/F8ubWY85JRc)   
led 버튼을 만들어 기계제어를 할 때 사용할 수 있는 WebSocket 프로그램을 설명한다.     
소스프로그램   
```
[{"id":"370263af.e0203c","type":"websocket out","z":"4d7f7afa.615144","name":"","server":"985ecbc7.67a138","client":"","x":560,"y":220,"wires":[]},{"id":"734ecc43.6050a4","type":"websocket in","z":"4d7f7afa.615144","name":"","server":"985ecbc7.67a138","client":"","x":180,"y":320,"wires":[["85451a55.60aa68"]]},{"id":"340e1c45.9716c4","type":"debug","z":"4d7f7afa.615144","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":470,"y":320,"wires":[]},{"id":"9b1de891.a8df68","type":"comment","z":"4d7f7afa.615144","name":"웹소켙","info":"","x":150,"y":60,"wires":[]},{"id":"80d75e74.6d99a","type":"inject","z":"4d7f7afa.615144","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"{\"in0\":0}","payloadType":"str","x":390,"y":220,"wires":[["370263af.e0203c"]]},{"id":"68eef96b.216138","type":"template","z":"4d7f7afa.615144","name":"Simple Web Page","field":"payload.scriptSocket","fieldType":"msg","format":"html","syntax":"mustache","template":"        var ws;\n        var wsUri = \"ws:\";\n        var loc = window.location;\n        console.log(loc);\n        if (loc.protocol === \"https:\") { wsUri = \"wss:\"; }\n        // This needs to point to the web socket in the Node-RED flow\n        // ... in this case it's ws/simple\n        wsUri += \"//\" + loc.host + loc.pathname.replace(\"simple\",\"ws/simple\");\n\n        function wsConnect() {\n            console.log(\"connect\",wsUri);\n            ws = new WebSocket(wsUri);\n            ws.onmessage = function(msg) {\n                // parse the incoming message as a JSON object\n                var data = JSON.parse(msg.data);\n                console.log(data);\n                if(data.in0=='1') \n                    document.getElementById('in0').innerHTML = \"<button class='button button-ledon' ></button>\";\n                else\n                    document.getElementById('in0').innerHTML = \"<button class='button button-ledoff' ></button>\";\n                    \n                //ws.send(JSON.stringify({data:data}));\n            }\n            ws.onopen = function() {\n                // update the status div with the connection status\n                document.getElementById('status').innerHTML = \"connected\";\n                //ws.send(\"Open for data\");\n                console.log(\"connected\");\n            }\n            ws.onclose = function() {\n                // update the status div with the connection status\n                document.getElementById('status').innerHTML = \"not connected\";\n                // in case of lost connection tries to reconnect every 3 secs\n                setTimeout(wsConnect,3000);\n            }\n        }\n        \n        function doit(m) {\n            if (ws) { ws.send(m); }\n        }","x":472,"y":120,"wires":[["2ee6d3d5.235dec"]]},{"id":"2ee6d3d5.235dec","type":"template","z":"4d7f7afa.615144","name":"Main html","field":"payload","fieldType":"msg","format":"html","syntax":"mustache","template":"<!DOCTYPE HTML>\n<html>\n<head>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <style> {{{payload.style}}} </style>\n    <script type=\"text/javascript\"> {{{payload.scriptSocket}}} </script>\n</head>\n    <body onload=\"wsConnect();\" onunload=\"ws.disconnect();\">\n        <h1>웹소켙</h1>\n        <div id=\"status\">unknown</div>\n        입력표시\n        <div id=\"in0\"></div>\n        <hr/>\n        출력스위치<br>\n        <button class='button button-on' onclick='doit(\"{\\\"out0\\\":1}\");'></button>\n        <button class='button button-off' onclick='doit(\"{\\\"out0\\\":0}\");'></button>\n    </body>\n</html>\n\n","x":642,"y":120,"wires":[["42a28745.bd5d78"]]},{"id":"42a28745.bd5d78","type":"http response","z":"4d7f7afa.615144","name":"","x":772,"y":120,"wires":[]},{"id":"1787be40.e87842","type":"http in","z":"4d7f7afa.615144","name":"","url":"/simple","method":"get","swaggerDoc":"","x":161,"y":120,"wires":[["e707cffaac315b1b","ceeed98b.29b388"]]},{"id":"e707cffaac315b1b","type":"template","z":"4d7f7afa.615144","name":"style","field":"payload.style","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"body {\n    background: #eab0dc;\n    font-family: Arial, Helvetica, sans-serif;\n}\ntable, th, td {\n    padding: 2px;\n    border-collapse: collapse;\n    border: 1px solid #dddddd;\n    text-align: center;\n    vertical-align: middle;\n}\n\n\n/* Full-width input fields */\ninput[type=text], input[type=password] {\n  width: 150px;\n  padding: 5px 10px;\n  margin: 8px 0;\n  display: inline-block;\n  border: 1px solid #ccc;\n  box-sizing: border-box;\n}\n\n/* Set a style for all buttons */\nbutton {\n  background-color: #4CAF50; /*Green*/\n  color: white;\n  padding: 14px 20px;\n  margin: 8px 0;\n  border: none;\n  cursor: pointer;\n}\n\n.buttonMenu {\n          padding: 5px 24px;\n          margin-left:20%;\n          background-color:black;\n          border: none;\n          border-color:black;\n          color:white;\n          text-align: left;\n          text-decoration: none;\n          display: inline-block;\n          font-size: 16px;\n          margin: 4px 2px;\n          cursor: pointer;\n        }\n        .sidenav {\n          height: 100%;\n          width: 0;\n          position: fixed;\n          z-index: 1;\n          top: 0;\n          left: 0;\n          background-color: #111;\n          overflow-x: hidden;\n          transition: 0.5s;\n          padding-top: 60px;\n        }\n        .sidenav a {\n          padding: 8px 8px 8px 32px;\n          text-decoration: none;\n          font-size: 18px;\n          color: #818181;\n          display: block;\n                transition: 0.3s;\n        }\n        .sidenav a:hover {\n          color: #f1f1f1;\n        }\n        .sidenav .closebtn {\n          position: absolute;\n          top: 0;\n          right: 25px;\n          font-size: 36px;\n          margin-left: 50px;\n        }\n\n.buttonM {background-color: #ff66cc;color:white; width:100px; height:20px; padding: 0px 0px; font-size: 16px} /* 기기선택 */  \n.buttonL {background-color: #ff66cc;color:white; width:100px; height:25px; padding: 0px 0px; font-size: 16px} /* 선택 */  \n.buttonMenu {background-color: #000000;} \n.button2 {background-color: #008CBA;} /* Blue */\n.button3 {background-color: #f44336;} /* Red */ \n.button4 {background-color: #e7e7e7; color: black;} /* Gray */ \n.button5 {background-color: #555555;} /* Black */\n.button20 {width: 20%;} \n.button-on {border-radius: 100%; padding: 20px; font-size: 18px; margin: 0px 0px; background-color: #4CAF50;}\n.button-off {border-radius: 100%; padding: 20px; font-size: 18px; background-color: #707070;}\n.button-ledon {border-radius: 100%; padding: 10px; font-size: 8px; margin: 0px 0px; background-color: #ff4500;}\n.button-ledoff {border-radius: 100%; padding: 10px; font-size: 8px; background-color: #707070;}\n\nbutton:hover {\n  opacity: 0.8;\n}\n\n/* Extra styles for the cancel button */\n.cancelbtn {\n  width: auto;\n  padding: 10px 18px;\n  background-color: #f44336;\n}\n\n/* Center the image and position the close button */\n.imgcontainer {\n  text-align: center;\n  margin: 24px 0 12px 0;\n  position: relative;\n}\n\nimg.avatar {\n  width: 40%;\n  border-radius: 50%;\n}\n\n.container {\n  padding: 16px;\n}\n\nspan.psw {\n  float: right;\n  padding-top: 16px;\n}\n\n/* The Modal (background) */\n.modal {\n  display: none; /* Hidden by default */\n  position: fixed; /* Stay in place */\n  z-index: 1; /* Sit on top */\n  left: 0;\n  top: 0;\n  width: 100%; /* Full width */\n  height: 100%; /* Full height */\n  overflow: auto; /* Enable scroll if needed */\n  background-color: rgb(0,0,0); /* Fallback color */\n  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */\n  padding-top: 60px;\n}\n\n/* Modal Content/Box */\n.modal-content {\n  background-color: #fefefe;\n  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */\n  border: 1px solid #888;\n  width: 80%; /* Could be more or less, depending on screen size */\n}\n\n/* The Close Button (x) */\n.close {\n  position: absolute;\n  right: 25px;\n  top: 0;\n  color: #000;\n  font-size: 35px;\n  font-weight: bold;\n}\n\n.close:hover,\n.close:focus {\n  color: red;\n  cursor: pointer;\n}\n\n/* Add Zoom Animation */\n.animate {\n  -webkit-animation: animatezoom 0.6s;\n  animation: animatezoom 0.6s\n}\n\n@-webkit-keyframes animatezoom {\n  from {-webkit-transform: scale(0)} \n  to {-webkit-transform: scale(1)}\n}\n  \n@keyframes animatezoom {\n  from {transform: scale(0)} \n  to {transform: scale(1)}\n}\n\n/* Change styles for span and cancel button on extra small screens */\n@media screen and (max-width: 300px) {\n  span.psw {\n     display: block;\n     float: none;\n  }\n  .cancelbtn {\n     width: 100%;\n  }\n}","x":310,"y":120,"wires":[["68eef96b.216138"]]},{"id":"a4db95eb.0ccc88","type":"inject","z":"4d7f7afa.615144","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"{\"in0\":1}","payloadType":"str","x":390,"y":260,"wires":[["370263af.e0203c"]]},{"id":"85451a55.60aa68","type":"json","z":"4d7f7afa.615144","name":"","property":"payload","action":"","pretty":false,"x":330,"y":320,"wires":[["340e1c45.9716c4"]]},{"id":"c4d59526.e28758","type":"function","z":"4d7f7afa.615144","name":"","func":"msg.payload=\"{\\\"in0\\\":0}\";\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":370,"y":180,"wires":[["370263af.e0203c"]]},{"id":"ceeed98b.29b388","type":"delay","z":"4d7f7afa.615144","name":"","pauseType":"delay","timeout":"1","timeoutUnits":"seconds","rate":"1","nbRateUnits":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":200,"y":180,"wires":[["c4d59526.e28758"]]},{"id":"985ecbc7.67a138","type":"websocket-listener","z":"4d7f7afa.615144","path":"/ws/simple","wholemsg":"false"}]
```

## 5.6.14 Scheduler 시간설정에 이한 기기 동작    
[유튜브보기](https://youtu.be/j45z6Q8Q-No)   
Node red 의 Scheduler를 이용하여 일주일 단위의 동작 시간을 설정하여 이 일정에 따라 기기가 동작하게 한다.    
소스프로그램   
```
[
    {
        "id": "97b3d306ed30b9a2",
        "type": "inject",
        "z": "be762aade1de3f92",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 120,
        "y": 100,
        "wires": [
            [
                "572c5f0ed31408b7"
            ]
        ]
    },
    {
        "id": "cdb611a121fcae86",
        "type": "file",
        "z": "be762aade1de3f92",
        "name": "",
        "filename": "d:/date.txt",
        "appendNewline": true,
        "createDir": false,
        "overwriteFile": "true",
        "encoding": "none",
        "x": 620,
        "y": 80,
        "wires": [
            []
        ]
    },
    {
        "id": "572c5f0ed31408b7",
        "type": "file in",
        "z": "be762aade1de3f92",
        "name": "read file",
        "filename": "d:/date.txt",
        "format": "utf8",
        "chunk": false,
        "sendError": false,
        "encoding": "none",
        "allProps": false,
        "x": 280,
        "y": 100,
        "wires": [
            [
                "130da009ac884aac"
            ]
        ]
    },
    {
        "id": "c0d9ba01a2aa5013",
        "type": "function",
        "z": "be762aade1de3f92",
        "name": "findOneUpdate",
        "func": "var newMsg = {};\nnewMsg.collection = 'scheduler';\nnewMsg.operation  = 'findOneAndUpdate';\nnewMsg.payload    = [{ 'mac' : 'edb2dcfa48a8'}, {$set:{ 'schedule':msg.payload}} ];\nnewMsg.projection = { 'mac' : 1 , '_id' : 0 };\nreturn newMsg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 880,
        "y": 213,
        "wires": [
            [
                "f09a91189794a84d"
            ]
        ]
    },
    {
        "id": "ec4410fd57bb097e",
        "type": "function",
        "z": "be762aade1de3f92",
        "name": "findOne",
        "func": "var newMsg = {};\nnewMsg.collection = 'scheduler';\nnewMsg.operation  = 'findOne';\nnewMsg.payload    = { 'mac' : 'edb2dcfa48a8'};\nnewMsg.projection = { 'mac' : 1 , '_id' : 0 };\nreturn newMsg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 280,
        "y": 220,
        "wires": [
            [
                "29bd16dfcbed16d7"
            ]
        ]
    },
    {
        "id": "2a07241a76fc8719",
        "type": "function",
        "z": "be762aade1de3f92",
        "name": "",
        "func": "msg.payload=msg.payload.schedule;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 560,
        "y": 220,
        "wires": [
            [
                "75c055f40e2bc0b5"
            ]
        ]
    },
    {
        "id": "333bf47553990e85",
        "type": "function",
        "z": "be762aade1de3f92",
        "name": "to mqtt",
        "func": "var newMsg = {};\nif(msg.payload==true)\n    newMsg.payload =\"{\\\"mac\\\":\\\"edb2dcfa48a8\\\",\\\"type\\\":12,\\\"outNo\\\":0,\\\"value\\\":1}\";\nelse\n    newMsg.payload =\"{\\\"mac\\\":\\\"edb2dcfa48a8\\\",\\\"type\\\":12,\\\"outNo\\\":0,\\\"value\\\":0}\";\nreturn newMsg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 850,
        "y": 260,
        "wires": [
            [
                "a12195bbcc88178c"
            ]
        ]
    },
    {
        "id": "a12195bbcc88178c",
        "type": "mqtt out",
        "z": "be762aade1de3f92",
        "name": "",
        "topic": "/i2r/inTopic",
        "qos": "0",
        "retain": "false",
        "respTopic": "",
        "contentType": "",
        "userProps": "",
        "correl": "",
        "expiry": "",
        "broker": "189c2ac1ef2a8c09",
        "x": 1010,
        "y": 260,
        "wires": []
    },
    {
        "id": "ad5970d51b489423",
        "type": "inject",
        "z": "be762aade1de3f92",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": 0.1,
        "topic": "",
        "payloadType": "date",
        "x": 130,
        "y": 220,
        "wires": [
            [
                "ec4410fd57bb097e"
            ]
        ]
    },
    {
        "id": "f09a91189794a84d",
        "type": "mongodb2 in",
        "z": "be762aade1de3f92",
        "service": "_ext_",
        "configNode": "89087a7163bb51e5",
        "name": "등록 name",
        "collection": "",
        "operation": "",
        "x": 1050,
        "y": 213,
        "wires": [
            []
        ]
    },
    {
        "id": "29bd16dfcbed16d7",
        "type": "mongodb2 in",
        "z": "be762aade1de3f92",
        "service": "_ext_",
        "configNode": "89087a7163bb51e5",
        "name": "기기 검색",
        "collection": "",
        "operation": "",
        "x": 420,
        "y": 220,
        "wires": [
            [
                "2a07241a76fc8719"
            ]
        ]
    },
    {
        "id": "130da009ac884aac",
        "type": "ui_time_scheduler",
        "z": "be762aade1de3f92",
        "group": "21d1a667bdc66555",
        "name": "",
        "startDay": 0,
        "refresh": 60,
        "devices": [
            "펌프"
        ],
        "singleOff": false,
        "onlySendChange": false,
        "customPayload": false,
        "eventMode": false,
        "eventOptions": [],
        "sendTopic": false,
        "lat": "",
        "lon": "",
        "customContextStore": "",
        "outputs": 2,
        "order": 4,
        "width": "6",
        "height": "1",
        "x": 440,
        "y": 100,
        "wires": [
            [
                "cdb611a121fcae86"
            ],
            [
                "119ffa60d14fe148"
            ]
        ]
    },
    {
        "id": "75c055f40e2bc0b5",
        "type": "ui_time_scheduler",
        "z": "be762aade1de3f92",
        "group": "250bf4c2611ddf16",
        "name": "",
        "startDay": 0,
        "refresh": 60,
        "devices": [
            "펌프 시간설정"
        ],
        "singleOff": false,
        "onlySendChange": false,
        "customPayload": false,
        "eventMode": false,
        "eventOptions": [],
        "sendTopic": false,
        "lat": "",
        "lon": "",
        "customContextStore": "",
        "outputs": 2,
        "order": 1,
        "width": "6",
        "height": "1",
        "x": 710,
        "y": 220,
        "wires": [
            [
                "c0d9ba01a2aa5013"
            ],
            [
                "333bf47553990e85",
                "d0448cd981682cf4"
            ]
        ]
    },
    {
        "id": "119ffa60d14fe148",
        "type": "ui_led",
        "z": "be762aade1de3f92",
        "order": 1,
        "group": "21d1a667bdc66555",
        "width": 0,
        "height": 0,
        "label": "",
        "labelPlacement": "left",
        "labelAlignment": "left",
        "colorForValue": [
            {
                "color": "#ff0000",
                "value": "false",
                "valueType": "bool"
            },
            {
                "color": "#008000",
                "value": "true",
                "valueType": "bool"
            }
        ],
        "allowColorForValueInMessage": false,
        "shape": "circle",
        "showGlow": true,
        "name": "",
        "x": 610,
        "y": 120,
        "wires": []
    },
    {
        "id": "d0448cd981682cf4",
        "type": "ui_led",
        "z": "be762aade1de3f92",
        "order": 1,
        "group": "250bf4c2611ddf16",
        "width": 0,
        "height": 0,
        "label": "",
        "labelPlacement": "left",
        "labelAlignment": "left",
        "colorForValue": [
            {
                "color": "#ff0000",
                "value": "false",
                "valueType": "bool"
            },
            {
                "color": "#008000",
                "value": "true",
                "valueType": "bool"
            }
        ],
        "allowColorForValueInMessage": false,
        "shape": "circle",
        "showGlow": true,
        "name": "",
        "x": 870,
        "y": 320,
        "wires": []
    },
    {
        "id": "189c2ac1ef2a8c09",
        "type": "mqtt-broker",
        "name": "",
        "broker": "localhost",
        "port": "1883",
        "tls": "2d74453f4b035ff0",
        "clientid": "",
        "autoConnect": true,
        "usetls": false,
        "protocolVersion": "4",
        "keepalive": "60",
        "cleansession": true,
        "birthTopic": "",
        "birthQos": "0",
        "birthPayload": "",
        "birthMsg": {},
        "closeTopic": "",
        "closeQos": "0",
        "closePayload": "",
        "closeMsg": {},
        "willTopic": "",
        "willQos": "0",
        "willPayload": "",
        "willMsg": {},
        "sessionExpiry": ""
    },
    {
        "id": "89087a7163bb51e5",
        "type": "mongodb2",
        "uri": "mongodb://localhost:27000/local",
        "name": "local",
        "options": "",
        "parallelism": "-1"
    },
    {
        "id": "21d1a667bdc66555",
        "type": "ui_group",
        "name": "schedule",
        "tab": "e6853a5cfce213f5",
        "order": 1,
        "disp": true,
        "width": "9",
        "collapse": false,
        "className": ""
    },
    {
        "id": "250bf4c2611ddf16",
        "type": "ui_group",
        "name": "schedule on DB",
        "tab": "e6853a5cfce213f5",
        "order": 2,
        "disp": true,
        "width": "6",
        "collapse": false,
        "className": ""
    },
    {
        "id": "2d74453f4b035ff0",
        "type": "tls-config",
        "name": "",
        "cert": "",
        "key": "",
        "ca": "",
        "certname": "7ca92d7c681d710066f490e277d4cb9be5d5ecf1518b81be7c3a48e6ea12871f-certificate.pem.crt",
        "keyname": "7ca92d7c681d710066f490e277d4cb9be5d5ecf1518b81be7c3a48e6ea12871f-private.pem.key",
        "caname": "AmazonRootCA1.pem",
        "servername": "",
        "verifyservercert": true,
        "alpnprotocol": ""
    },
    {
        "id": "e6853a5cfce213f5",
        "type": "ui_tab",
        "name": "출력제어",
        "icon": "dashboard",
        "order": 0,
        "disabled": false,
        "hidden": false
    }
]
```

## 5.6.15 Delay와 Trriger 노드 사용번  
[유튜브보기](https://youtu.be/j45z6Q8Q-No)  
Delay와 Trriger의 사용법과 Function에서 변수로 처리하는 방법을 설명한다.
소스프로그램  
```
[
    {
        "id": "692d2f99b85a5129",
        "type": "comment",
        "z": "94d3083d860723e4",
        "name": "",
        "info": "node red mongodb trigger time schedule",
        "x": 200,
        "y": 80,
        "wires": []
    },
    {
        "id": "fa319cd3ddea106c",
        "type": "inject",
        "z": "94d3083d860723e4",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payloadType": "date",
        "x": 210,
        "y": 120,
        "wires": [
            [
                "0b032a33350a9510"
            ]
        ]
    },
    {
        "id": "0b032a33350a9510",
        "type": "delay",
        "z": "94d3083d860723e4",
        "name": "",
        "pauseType": "rate",
        "timeout": "5",
        "timeoutUnits": "seconds",
        "rate": "10",
        "nbRateUnits": "5",
        "rateUnits": "second",
        "randomFirst": "1",
        "randomLast": "5",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 420,
        "y": 120,
        "wires": [
            [
                "f02474350b63d028"
            ]
        ]
    },
    {
        "id": "f02474350b63d028",
        "type": "function",
        "z": "94d3083d860723e4",
        "name": "Format timestamp",
        "func": "// Create a Date object from the payload\nvar date = new Date(msg.payload);\n// Change the payload to be a formatted Date string\nmsg.payload = date.toString();\n// Return the message so it can be sent on\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 640,
        "y": 120,
        "wires": [
            [
                "27405f7e33fec6b7"
            ]
        ]
    },
    {
        "id": "27405f7e33fec6b7",
        "type": "debug",
        "z": "94d3083d860723e4",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 840,
        "y": 120,
        "wires": []
    },
    {
        "id": "6600580f0aeb1e8e",
        "type": "trigger",
        "z": "94d3083d860723e4",
        "name": "",
        "op1": "1",
        "op2": "0",
        "op1type": "str",
        "op2type": "str",
        "duration": "5",
        "extend": false,
        "overrideDelay": false,
        "units": "s",
        "reset": "test",
        "bytopic": "all",
        "topic": "topic",
        "outputs": 1,
        "x": 360,
        "y": 320,
        "wires": [
            [
                "b60cfeb5573d1c75"
            ]
        ]
    },
    {
        "id": "b60cfeb5573d1c75",
        "type": "debug",
        "z": "94d3083d860723e4",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 530,
        "y": 320,
        "wires": []
    },
    {
        "id": "045f2f75a6706a8b",
        "type": "inject",
        "z": "94d3083d860723e4",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payloadType": "date",
        "x": 210,
        "y": 320,
        "wires": [
            [
                "6600580f0aeb1e8e"
            ]
        ]
    },
    {
        "id": "40959ac9af5765ca",
        "type": "inject",
        "z": "94d3083d860723e4",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "test",
        "payloadType": "str",
        "x": 200,
        "y": 360,
        "wires": [
            [
                "6600580f0aeb1e8e"
            ]
        ]
    },
    {
        "id": "4a2ad8440707ad26",
        "type": "trigger",
        "z": "94d3083d860723e4",
        "name": "",
        "op1": "1",
        "op2": "0",
        "op1type": "str",
        "op2type": "str",
        "duration": "2",
        "extend": false,
        "overrideDelay": true,
        "units": "s",
        "reset": "",
        "bytopic": "all",
        "topic": "topic",
        "outputs": 1,
        "x": 540,
        "y": 460,
        "wires": [
            [
                "3a17722d988a96eb"
            ]
        ]
    },
    {
        "id": "4cf28a50102e4183",
        "type": "inject",
        "z": "94d3083d860723e4",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payloadType": "date",
        "x": 220,
        "y": 460,
        "wires": [
            [
                "c0bba25c1e18f078"
            ]
        ]
    },
    {
        "id": "3a17722d988a96eb",
        "type": "debug",
        "z": "94d3083d860723e4",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 690,
        "y": 460,
        "wires": []
    },
    {
        "id": "d06febb701c2c5c7",
        "type": "inject",
        "z": "94d3083d860723e4",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            },
            {
                "p": "delay",
                "v": "5000",
                "vt": "num"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payloadType": "date",
        "x": 220,
        "y": 520,
        "wires": [
            [
                "4a2ad8440707ad26"
            ]
        ]
    },
    {
        "id": "c0bba25c1e18f078",
        "type": "function",
        "z": "94d3083d860723e4",
        "name": "",
        "func": "msg.delay=5000;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 380,
        "y": 460,
        "wires": [
            [
                "4a2ad8440707ad26"
            ]
        ]
    },
    {
        "id": "44d4875b94478d57",
        "type": "delay",
        "z": "94d3083d860723e4",
        "name": "",
        "pauseType": "delayv",
        "timeout": "5",
        "timeoutUnits": "seconds",
        "rate": "1",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "1",
        "randomLast": "5",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 520,
        "y": 220,
        "wires": [
            [
                "786fddfb86b1d05f"
            ]
        ]
    },
    {
        "id": "611ae255aa10ac4d",
        "type": "inject",
        "z": "94d3083d860723e4",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payloadType": "date",
        "x": 210,
        "y": 220,
        "wires": [
            [
                "8b15f81c2474e4e6"
            ]
        ]
    },
    {
        "id": "8b15f81c2474e4e6",
        "type": "function",
        "z": "94d3083d860723e4",
        "name": "",
        "func": "msg.delay=2000;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 370,
        "y": 220,
        "wires": [
            [
                "44d4875b94478d57"
            ]
        ]
    },
    {
        "id": "786fddfb86b1d05f",
        "type": "debug",
        "z": "94d3083d860723e4",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 680,
        "y": 220,
        "wires": []
    },
    {
        "id": "56328a6fa22f6645",
        "type": "comment",
        "z": "94d3083d860723e4",
        "name": "트리거 리셋",
        "info": "",
        "x": 200,
        "y": 280,
        "wires": []
    },
    {
        "id": "697cf6244abedb2d",
        "type": "comment",
        "z": "94d3083d860723e4",
        "name": "트리거 타임 설정",
        "info": "",
        "x": 200,
        "y": 420,
        "wires": []
    },
    {
        "id": "951d73d36ca0f76c",
        "type": "comment",
        "z": "94d3083d860723e4",
        "name": "Delay 타임 설정",
        "info": "",
        "x": 200,
        "y": 180,
        "wires": []
    }
]
```
