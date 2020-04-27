var mqtt    = require('mqtt');
var count =0;
var client  = mqtt.connect("mqtt://broker.mqtt-dashboard.com",{clientId:"node001"});
var options={
    retain:true,
    qos:0};
var topic="topic_kdi";
var message="";

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

var timer_id=setInterval(function(){count+=1;message = "count "+count;publish(topic,message,options);},5000);
//notice this is printed even before we connect
console.log("end of script");
