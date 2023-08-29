#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <ArduinoJson.h>

#define SERVICE_UUID           "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID    "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// 구조체 정의
struct DataCar {
    int angle1 = -1;
    int angle2 = -1;
    int vel = -1;
};

// 전역 변수로 DataStorage 인스턴스 생성
DataCar car;

unsigned int counter = 0;
BLECharacteristic *pCharacteristic;

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      Serial.println("Device connected");
    }

    void onDisconnect(BLEServer* pServer) {
      Serial.println("Device disconnected");
      BLEDevice::startAdvertising();  // Start advertising again after disconnect
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
        std::string value = pCharacteristic->getValue();
        if (value.length() > 0) {
            Serial.println("Received Value:");
            for (int i = 0; i < value.length(); i++) {
                Serial.print(value[i]);
            }
            Serial.println();

            // 받은 JSON을 파싱
            DynamicJsonDocument doc(1024);  // JSON 문서에 대한 메모리 할당
            DeserializationError error = deserializeJson(doc, value.c_str());

            if (error) {
                Serial.println("JSON 파싱 실패!");
            } else {
                car.angle1 = doc["angle1"] | -1;
                car.angle2 = doc["angle2"] | -1;
                car.vel = doc["vel"] | -1;

                Serial.print("Angle1: "); Serial.println(car.angle1);
                Serial.print("Angle2: "); Serial.println(car.angle2);
                Serial.print("Vel: "); Serial.println(car.vel);
            }
        }
    }
};

void setup() {
  Serial.begin(115200);

  BLEDevice::init("i2r-04-ESP32");
  BLEServer *pServer = BLEDevice::createServer();

  // Set server callbacks
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristic->setCallbacks(new MyCallbacks());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("BLE ready!");
}

void loop() {
  char buffer[50];
  Serial.println(counter);
  snprintf(buffer, sizeof(buffer), "%u", counter++);
  pCharacteristic->setValue(buffer);
  //pCharacteristic->notify();
  delay(3000);  // Wait for 3 seconds
}

