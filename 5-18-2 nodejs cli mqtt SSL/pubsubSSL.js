//https://yonghyunlee.gitlab.io/node/node-mqtt/
//http://www.steves-internet-guide.com/using-node-mqtt-client/
var mqtt    = require('mqtt');
const fs = require('fs');
//var cert="ca.crt";
var caFile = fs.readFileSync("ca.crt");
//if using client certificates
var KEY = fs.readFileSync('client.key');
var CERT = fs.readFileSync('client.crt');
//
var options={
clientId:"mqttjs01",
rejectUnauthorized : false,
qos:0,
//if using client certificates
key: KEY,
cert: CERT,
ca:caFile 
}

var client  = mqtt.connect("mqtts://a2e3lvmkmo084b-ats.iot.us-east-2.amazonaws.com:8883",options);
var topic="topic_kdi";
var count =0;
var message="";

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

//publish
function publish(topic,msg,options){
    console.log(count);
    if (client.connected == true){
        console.log("publishing { ",topic," : " ,msg," }");
        client.publish(topic,msg,options);
    }
    //ens script
    if (count >= 3) {
        clearTimeout(timer_id); //stop timer
        client.end();	
        console.log("client end");
    }
}

console.log("publishing & subscribing to topics");
var timer_id=setInterval(function(){count+=1;message = "count "+count;publish(topic,message,options);},5000);
//notice this is printed even before we connect
console.log("end of script");