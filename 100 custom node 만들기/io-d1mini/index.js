var functions = require('firebase-functions');
var events = require('events');
var admin = require("firebase-admin");
var firstTime = true;
var savedData = "";
var sentData = "";

module.exports = function(RED) {
    function IoD1mini(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var name = String(config.name);

        var key = JSON.parse(this.credentials.JsonKey);
		var credURL = String(this.credentials.credentialURL);		
		var refPath = String(config.ref);

		console.log(key);
		console.log(credURL); //for debug
        console.log(firstTime);

        if(!firstTime){
            admin.app().delete();
            admin.initializeApp({
                credential: admin.credential.cert(key),
                databaseURL: credURL
            });
        } //reinitialize (Delete the first admin instance)

        if(firstTime){
            admin.initializeApp({
                   credential: admin.credential.cert(key),
                databaseURL: credURL
            });
            firstTime = false;
        } //when the admin SDK app is initialized for the first time

        var db= admin.database();
        var ref = db.ref(refPath);

        ref.on("value", function(snapshot){
			savedData = snapshot.val();
			console.log(savedData);
            console.log("snapshot");
            //from here, user's own configuration
            
			//if(savedData.lightState){
			//	sentData = "{\"power\":\"ON\",";
            //}else sentData = "{\"power\":\"OFF\",";
			sentData = "{\"on\":"+savedData.on+",";
			sentData = sentData + "\"brightness\":"+ savedData.brightness + ",";
			sentData = sentData + "\"color\":"+ "\"rgb("+ savedData.red + ","+ savedData.green + ","+ savedData.blue + ")\"}";
            console.log(sentData);
            //node.send(JSON.parse(sentData)); 
            var newMsg={};
            newMsg.payload=JSON.parse(sentData);
            node.send(newMsg);
            
        },
        function(errorObject){
            savedData = errorObject.code;
        }
        );
        
        node.on('input', function(msg) {
            console.log(savedData);
            console.log("node");
            msg.payload = savedData;
            node.send(msg);
        });

    }
    RED.nodes.registerType("io-d1mini-node",IoD1mini, {
		credentials: {
			JsonKey: {type:"text"},
			credentialURL: {type:"text"}
		}
	});
}

