// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

//mqtt
//https://yonghyunlee.gitlab.io/node/node-mqtt/
//http://www.steves-internet-guide.com/using-node-mqtt-client/
const mqtt    = require('mqtt');
const fs = require('fs');
var options={
  clientId:"mqttjs00001",
  rejectUnauthorized : false,
  qos:0,
  //if using client certificates
  key: fs.readFileSync('client.key'),
  cert: fs.readFileSync('client.crt'),
  ca: fs.readFileSync("ca.crt") 
};
var client  = mqtt.connect("mqtts://***.iot.us-east-2.amazonaws.com:8883",options);
var topic="outCandleAWS";
var message="";
//mqtt

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL:'ws://newagent-vyurhu.firebaseio.com/'
});
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`밝기 빨강 녹색 파랑 흰색을 말해주세요`);
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
  
  //handle incoming messages
  client.on('message',function(topic, msg, packet){
    console.log(" message : "+msg);
  });

  client.on("connect",function(){	
      console.log("connected  "+ client.connected);
      client.subscribe(topic,{qos:0}); 
  })

  //handle errors
  client.on("error",function(error){
    console.log("Can't connect" + error);
    process.exit(1)});
  
  function publish(topic,msg,options){
    if (client.connected == true){
        console.log("publishing { ",topic," : " ,msg," }");
        client.publish(topic,msg,options);
    }
    //ens script
    //client.end();
  }

    function handleBrights(agent) {
    const bright = agent.parameters.bright;
    //mqtt 전송
    message = `{\"bright\":`+bright+`}`;
    publish(topic,message,options);
    
    return admin.database().ref('data').set({
      //name:name,
      bright:bright
    });
  }

  function handleColors(agent) {
    const color = agent.parameters.color;
    const value = agent.parameters.number;
    //mqtt 전송
    if(color=="빨강") {
      message = `{\"red\":`+value+`}`;
      publish(topic,message,options);
      return admin.database().ref('data').set({
        //name:name,
        red:value
      });
    }
    if(color=="녹색") {
      message = `{\"green\":`+value+`}`;
      publish(topic,message,options);
      return admin.database().ref('data').set({
        //name:name,
        green:value
      });
    }
    if(color=="파랑") {
      message = `{\"blue\":`+value+`}`;
      publish(topic,message,options);
      return admin.database().ref('data').set({
        //name:name,
        blue:value
      });
    }
    if(color=="흰색") {
      message = `{\"white\":`+value+`}`;
      publish(topic,message,options);
      return admin.database().ref('data').set({
        //name:name,
        white:value
      });
    }
  }
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Brights', handleBrights);
  intentMap.set('Colors', handleColors);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
