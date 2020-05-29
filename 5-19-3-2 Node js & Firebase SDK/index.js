'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require("./***-firebase-adminsdk-ktg5t-b59df3b68b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:'ws://***.firebaseio.com/'
});

function dataWrite() {
  admin.database().ref('data').set({
      name:"거실",
      on:1
  });
}

dataWrite();