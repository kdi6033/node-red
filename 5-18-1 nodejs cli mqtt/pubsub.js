//https://yonghyunlee.gitlab.io/node/node-mqtt/
//http://www.steves-internet-guide.com/using-node-mqtt-client/
var mqtt    = require('mqtt');
//clientId를 꼭 변경하세요 같은 Id가 만나면 통신에러 생깁니다.
var client  = mqtt.connect("mqtt://broker.mqtt-dashboard.com",{clientId:"node0001"});
var topic="topic_kdi";
var count =0;
var options={
    retain:true,
    qos:0};
var message="";

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

//publish
function publish(topic,msg,options){
    console.log(count);
    if (client.connected == true){
        console.log("publishing { ",topic," : " ,msg," }");
        //client.publish(topic,msg,options);
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
//var timer_id=setInterval(function(){count+=1;message = "count "+count;publish(topic,message);},5000);
//notice this is printed even before we connect
console.log("end of script");