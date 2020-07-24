// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL:'ws://chatk-nwrkpm.firebaseio.com/'
});

// URLs for images used in card rich responses
const imageUrl = 'http://117.16.177.40/image/i2r_small.png';
const imageUrl2 = 'http://117.16.177.40/image/i2r_big.png';
const linkUrl = 'https://c.doowon.ac.kr/';
 
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

  function samplefourHandler(agent) {
    //agent.add(`샘플포`);
    const name = agent.parameters.name;
    const on = agent.parameters.on;
    
    return admin.database().ref('data').set({
      name:name,
      on:on
    });
  }
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('SampleFour', samplefourHandler);
  agent.handleRequest(intentMap);
});
