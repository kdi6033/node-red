# 구글 챗봇 Custom Payload : Fullfilment, Firebase 연동 Led 제어 
구글쳇봇 Custom Payload를 이용해 전등의 리스트를 만들고 구글 파이어베이스와 연동하여 동작 시키는 프로그램을 만든다.
- richList Custom Payload 프로그램

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
        "type": "divider"
      },
      {
        "type": "list",
        "event": {
          "name": "SampleFour",
          "parameters": {
            "name": "안방",
            "on": "켜"
          }
        },
        "title": "안방전등 ON",
        "languageCode": "ko"
      },
      {
        "type": "divider"
      },
      {
        "event": {
          "name": "SampleFour",
          "parameters": {
            "name": "안방",
            "on": "꺼"
          }
        },
        "languageCode": "ko",
        "title": "안방전등 OFF",
        "type": "list"
      },
      {
        "type": "divider"
      },
      {
        "event": {
          "parameters": {
            "name": "주방",
            "on": "켜"
          },
          "name": "SampleFour"
        },
        "languageCode": "ko",
        "type": "list",
        "title": "주방전등 ON"
      },
      {
        "type": "divider"
      },
      {
        "event": {
          "name": "SampleFour",
          "parameters": {
            "name": "주방",
            "on": "꺼"
          }
        },
        "languageCode": "ko",
        "title": "주방전등 OFF",
        "type": "list"
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

- 위 richList에서 "event"로 "SampleFour"이 설정되어 있어서 야래와 같이 SampleFour의 event를 설정한다.
<img src = "https://user-images.githubusercontent.com/37902752/132804408-a6a01dc4-148e-4368-94d0-79a1711487aa.png" width="400" height="200">

- 개인 PC에서 Dialog Flow 프로그램을 내려 받아 Deploy 하는 방법은 5.19.3  https://youtu.be/uBZ78C--T6U 을 참조해 주세요. 이 다음부터 설명하겠습니다.
- Google DialogFlow에서 자동생성되는 package.json 의 버젼이 달라서 링크 에러가 발생 합나다. 아래 프로그램 버젼을 수정한 package.json 을 사용 하세요.

package.json

```
{
  "name": "dialogflowFirebaseFulfillment",
  "description": "This is the default fulfillment for a Dialogflow agents using Cloud Functions for Firebase",
  "version": "0.0.1",
  "private": true,
  "license": "Apache Version 2.0",
  "author": "Google Inc.",
  "engines": {
    "node": "10"
  },
  "scripts": {
    "start": "firebase serve --only functions:dialogflowFirebaseFulfillment",
    "deploy": "firebase deploy --only functions:dialogflowFirebaseFulfillment"
  },
  "dependencies": {
    "actions-on-google": "^2.2.0",
    "firebase-admin": "^9.5.0",
    "firebase-functions": "^3.1.0",
    "dialogflow": "^0.6.0",
    "dialogflow-fulfillment": "^0.5.0"
  }
}
```

다음은  admin을 추가했습니다. 참조하세요. 
index.js 

```
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL:'ws://newagent-tway-default-rtdb.firebaseio.com/'
});

// URLs for images used in card rich responses
const imageUrl = 'http://18.237.189.188//image/i2r_small.png';
const imageUrl2 = 'http://18.237.189.188//image/i2r_big.png';
const linkUrl = 'https://i2r.link/';
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  function samplefourHandler(agent) {
    //agent.add(`샘플포`);
    const name = agent.parameters.name;
    const on = agent.parameters.on;
    var state = 0;
    
    if(on=="켜")
      state=1;
    else
      state=0;
      
    
    return admin.database().ref('data').set({
      name:name,
      on:state
    });
  }
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('SampleFour', samplefourHandler);
  agent.handleRequest(intentMap);
});
```





김동일교수 유튜브 목차 : http://i2r.link
