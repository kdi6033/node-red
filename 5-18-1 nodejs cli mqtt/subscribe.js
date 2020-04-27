//https://yonghyunlee.gitlab.io/node/node-mqtt/
//http://www.steves-internet-guide.com/using-node-mqtt-client/
var mqtt    = require('mqtt');
var client  = mqtt.connect("mqtt://broker.mqtt-dashboard.com",{clientId:"node100"});
var topic="topic_kdi";

//handle incoming messages
client.on('message',function(topic, msg, packet){
	//console.log("{"+ topic +":" + message +"}");
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

console.log("subscribing to topics");
//client.subscribe(topic,{qos:0}); 
