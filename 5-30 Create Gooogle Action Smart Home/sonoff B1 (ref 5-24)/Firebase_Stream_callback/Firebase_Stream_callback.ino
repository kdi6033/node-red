//FirebaseESP8266.h must be included before ESP8266WiFi.h
#include "FirebaseESP8266.h"
#include <ESP8266WiFi.h>
#include <my92xx.h> //https://github.com/xoseperez/my92xx
//#include <FirebaseArduino.h>  

#define FIREBASE_HOST "***.firebaseio.com" //Without http:// or https:// schemes
#define FIREBASE_AUTH "***"
#define WIFI_SSID "i2r"
#define WIFI_PASSWORD "00000000"

//Define FirebaseESP8266 data object
FirebaseData firebaseData1;
FirebaseData firebaseData2;

#define MY92XX_MODEL    MY92XX_MODEL_MY9231     // The MY9291 is a 4-channel driver, usually for RGBW lights
#define MY92XX_CHIPS    2                       // No daisy-chain
#define MY92XX_DI_PIN   12                      // DI GPIO
#define MY92XX_DCKI_PIN 14                      // DCKI GPIO
#define UNIVERSE 1                              // First DMX Universe to listen for
#define UNIVERSE_COUNT 1                        // Total number of Universes to listen for, starting at UNIVERSE

my92xx _my92xx = my92xx(MY92XX_MODEL, MY92XX_CHIPS, MY92XX_DI_PIN, MY92XX_DCKI_PIN, MY92XX_COMMAND_DEFAULT);
// r g b w  0~255까지 입력
int r = 100;
int g = 0;
int b = 0;
int w = 100;
int bright=0;
int color=0;

unsigned long sendDataPrevMillis = 0;

String path = "/1";

uint16_t count = 0;

void printResult(FirebaseData &data);
void printResult(StreamData &data);
void outResult(StreamData &data);

void updateLights()
{
      _my92xx.setChannel(4, r);
      _my92xx.setChannel(3, g);
      _my92xx.setChannel(5, b); 
      _my92xx.setChannel(0, w); 
      _my92xx.setChannel(1, w); 
      _my92xx.setState(true);
      _my92xx.update();
}

String reValue="";
String fireStatus = "";   
void streamCallback(StreamData data)
{
  Serial.println("Stream Data1 available...");
  Serial.println("STREAM PATH: " + data.streamPath());
  Serial.println("EVENT PATH: " + data.dataPath());
  Serial.println("DATA TYPE: " + data.dataType());
  Serial.println("EVENT TYPE: " + data.eventType());
  Serial.print("VALUE: ");
  printResult(data);
  Serial.println();
  Serial.println(reValue);
  outResult(data);

}

void outResult(StreamData &data)
{
  FirebaseJsonData jsonObj;
  FirebaseJson json1;

  json1.setJsonData(reValue);
  
  Serial.println("EVENT PATH: "+data.dataPath());
  if(data.dataPath().compareTo("/")==0) {
    json1.get(jsonObj, "Brightness/brightness");
    bright=int(jsonObj.intValue*2.55);
    json1.get(jsonObj, "ColorSetting/color/spectrumRGB");
    color=jsonObj.intValue;
    json1.get(jsonObj, "OnOff/on");
    if(jsonObj.intValue==0)
      w=0;
    else
      w=bright;
  }
  if(data.dataPath().compareTo("/OnOff")==0) {
    json1.get(jsonObj, "on");
    if(jsonObj.intValue==0)
      w=0;
    else
      w=bright;
  }
  if(data.dataPath().compareTo("/Brightness")==0) {
    json1.get(jsonObj, "brightness");
    bright=int(jsonObj.intValue*2.55);
    w=bright;
  }
  if(data.dataPath().compareTo("/ColorSetting")==0) {
    json1.get(jsonObj, "color/spectrumRGB");
    color=jsonObj.intValue;
  }
  
  if(color==NULL)
    color=0;
  Serial.println("rgb:"+(String)color+"/"+String(color, HEX));
  r=(color >> 16) & 0xff;
  g=(color >> 8) & 0xff;
  b=color & 0xff;
  Serial.println("w:r:g:b = "+(String)w+":"+String(r, HEX)+":"+String(g, HEX)+":"+String(b, HEX));
}

void streamTimeoutCallback(bool timeout)
{
  if (timeout)
  {
    Serial.println();
    Serial.println("Stream timeout, resume streaming...");
    Serial.println();
  }
}

void setup()
{
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  //Set the size of WiFi rx/tx buffers in the case where we want to work with large data.
  firebaseData1.setBSSLBufferSize(1024, 1024);

  //Set the size of HTTP response buffers in the case where we want to work with large data.
  firebaseData1.setResponseSize(1024);


  //Set the size of WiFi rx/tx buffers in the case where we want to work with large data.
  firebaseData2.setBSSLBufferSize(1024, 1024);

  //Set the size of HTTP response buffers in the case where we want to work with large data.
  firebaseData2.setResponseSize(1024);



  if (!Firebase.beginStream(firebaseData1, path))
  {
    Serial.println("------------------------------------");
    Serial.println("Can't begin stream connection...");
    Serial.println("REASON: " + firebaseData1.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }

  Firebase.setStreamCallback(firebaseData1, streamCallback, streamTimeoutCallback);
}

void loop()
{
  updateLights();
}

void printResult(FirebaseData &data)
{
  //Serial.println("FirebaseData");
  if (data.dataType() == "int")
    Serial.println(data.intData());
  else if (data.dataType() == "float")
    Serial.println(data.floatData(), 5);
  else if (data.dataType() == "double")
    printf("%.9lf\n", data.doubleData());
  else if (data.dataType() == "boolean")
    Serial.println(data.boolData() == 1 ? "true" : "false");
  else if (data.dataType() == "string")
    Serial.println(data.stringData());
  else if (data.dataType() == "json")
  {
    Serial.println();
    FirebaseJson &json = data.jsonObject();
    //Print all object data
    Serial.println("Pretty printed JSON data:");
    String jsonStr;
    json.toString(jsonStr, true);
    Serial.println(jsonStr);
    Serial.println();
    Serial.println("Iterate JSON data:");
    Serial.println();
    size_t len = json.iteratorBegin();
    String key, value = "";
    int type = 0;
    for (size_t i = 0; i < len; i++)
    {
      json.iteratorGet(i, type, key, value);
      Serial.print(i);
      Serial.print(", ");
      Serial.print("Type: ");
      Serial.print(type == FirebaseJson::JSON_OBJECT ? "object" : "array");
      if (type == FirebaseJson::JSON_OBJECT)
      {
        Serial.print(", Key: ");
        Serial.print(key);
      }
      Serial.print(", Value: ");
      Serial.println(value);
    }
    json.iteratorEnd();
  }
  else if (data.dataType() == "array")
  {
    Serial.println();
    //get array data from FirebaseData using FirebaseJsonArray object
    FirebaseJsonArray &arr = data.jsonArray();
    //Print all array values
    Serial.println("Pretty printed Array:");
    String arrStr;
    arr.toString(arrStr, true);
    Serial.println(arrStr);
    Serial.println();
    Serial.println("Iterate array values:");
    Serial.println();
    for (size_t i = 0; i < arr.size(); i++)
    {
      Serial.print(i);
      Serial.print(", Value: ");

      FirebaseJsonData &jsonData = data.jsonData();
      //Get the result data from FirebaseJsonArray object
      arr.get(jsonData, i);
      if (jsonData.typeNum == FirebaseJson::JSON_BOOL)
        Serial.println(jsonData.boolValue ? "true" : "false");
      else if (jsonData.typeNum == FirebaseJson::JSON_INT)
        Serial.println(jsonData.intValue);
      else if (jsonData.typeNum == FirebaseJson::JSON_DOUBLE)
        printf("%.9lf\n", jsonData.doubleValue);
      else if (jsonData.typeNum == FirebaseJson::JSON_STRING ||
               jsonData.typeNum == FirebaseJson::JSON_NULL ||
               jsonData.typeNum == FirebaseJson::JSON_OBJECT ||
               jsonData.typeNum == FirebaseJson::JSON_ARRAY)
        Serial.println(jsonData.stringValue);
    }
  }
}

void printResult(StreamData &data)
{
  //Serial.println("StreamData");
  if (data.dataType() == "int")
    Serial.println(data.intData());
  else if (data.dataType() == "float")
    Serial.println(data.floatData(), 5);
  else if (data.dataType() == "double")
    printf("%.9lf\n", data.doubleData());
  else if (data.dataType() == "boolean")
    Serial.println(data.boolData() == 1 ? "true" : "false");
  else if (data.dataType() == "string")
    Serial.println(data.stringData());
  else if (data.dataType() == "json")
  {
    Serial.println();
    FirebaseJson *json = data.jsonObjectPtr();
    //Print all object data
    Serial.println("Pretty printed JSON data:");
    String jsonStr;
    json->toString(jsonStr, true);
    Serial.println(jsonStr);
    Serial.println();
    Serial.println("Iterate JSON data:");
    Serial.println();
    size_t len = json->iteratorBegin();
    String key, value = "";
    int type = 0;
    for (size_t i = 0; i < len; i++)
    {
      json->iteratorGet(i, type, key, value);
      Serial.print(i);
      Serial.print(", ");
      Serial.print("Type: ");
      Serial.print(type == FirebaseJson::JSON_OBJECT ? "object" : "array");
      if (type == FirebaseJson::JSON_OBJECT)
      {
        Serial.print(", Key: ");
        Serial.print(key);
      }
      Serial.print(", Value: ");
      Serial.println(value);
    }
    reValue=jsonStr;
    //reValue=value;
    json->iteratorEnd();
  }
  else if (data.dataType() == "array")
  {
    Serial.println();
    //get array data from FirebaseData using FirebaseJsonArray object
    FirebaseJsonArray *arr = data.jsonArrayPtr();
    //Print all array values
    Serial.println("Pretty printed Array:");
    String arrStr;
    arr->toString(arrStr, true);
    Serial.println(arrStr);
    Serial.println();
    Serial.println("Iterate array values:");
    Serial.println();

    for (size_t i = 0; i < arr->size(); i++)
    {
      Serial.print(i);
      Serial.print(", Value: ");

      FirebaseJsonData *jsonData = data.jsonDataPtr();
      //Get the result data from FirebaseJsonArray object
      arr->get(*jsonData, i);
      if (jsonData->typeNum == FirebaseJson::JSON_BOOL)
        Serial.println(jsonData->boolValue ? "true" : "false");
      else if (jsonData->typeNum == FirebaseJson::JSON_INT)
        Serial.println(jsonData->intValue);
      else if (jsonData->typeNum == FirebaseJson::JSON_DOUBLE)
        printf("%.9lf\n", jsonData->doubleValue);
      else if (jsonData->typeNum == FirebaseJson::JSON_STRING ||
               jsonData->typeNum == FirebaseJson::JSON_NULL ||
               jsonData->typeNum == FirebaseJson::JSON_OBJECT ||
               jsonData->typeNum == FirebaseJson::JSON_ARRAY)
        Serial.println(jsonData->stringValue);
    }
  }
}
