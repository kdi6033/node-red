import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  isDragging = false;
  startAngle = 0;
  currentAngle = 270; // 물리적 위치는 270°에 있지만, 값은 0°로 취급
  devices: any[] = []; // 스캔된 블루투스 디바이스 목록을 저장
  showRetryMessage = false;  // 연결 실패 메시지 표시 여부

  isConnected: boolean = false;
  connectedDeviceId: string | null = null;  // 연결된 장치의 ID 저장
  SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // 서비스 UUID로 교체
  CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // 특성 UUID로 교체

  // debounce 시간 설정
  private DEBOUNCE_TIME = 200;  // 200ms
  private DEBOUNCE_TIME2 = 400;  // 400ms
  private lastSentTime = 0;
  private lastDetectedAngle: number | null = null;
  private lastDetectedDistance: number | null = null;
  private lastDetectedAngle2: number | null = null;
  private lastSentTime2 = 0;

  intervalId: any = null; // 블루투스 연결표시 Led

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.setupOriginalSlider();
    this.setupSecondSlider('second-slider');
    // 프로그램 시작할 때 updatePointerPosition 함수를 호출합니다.
    setTimeout(() => {
      this.updatePointerPosition(this.currentAngle);
    }, 100);  // 100ms 지연
    // 블루투스 연결 상태를 1초마다 확인
    this.intervalId = setInterval(() => this.checkAndReconnectBluetooth(), 1000);
  }

  ngOnDestroy() { // 컴포넌트 파괴 시 인터벌 해제
    if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }
  }

  // setupSecondSlider 내에 있었지만 녹색볼의 초기 위치를 주기위해 여기에 선언하여 사용함
  updatePointerPosition(angle: number) {
    const sliderId = 'second-slider';
    const container = this.el.nativeElement.querySelector(`#${sliderId}`);
    const pointer = container.querySelector('.circle-pointer');

    const radius = container.offsetWidth / 2;
    const radian = angle * (Math.PI / 180);
    const x = radius + (radius - 20) * Math.cos(radian);
    const y = radius - (radius - 20) * Math.sin(radian);

    pointer.style.left = `${x - pointer.offsetWidth / 2}px`;
    pointer.style.bottom = `${y - pointer.offsetHeight / 2}px`;
  }

  async checkAndReconnectBluetooth() {
    try {
        if (this.connectedDeviceId) {
            // 연결 상태를 확인하기 위해 해당 디바이스의 서비스를 가져옵니다.
            await BleClient.getServices(this.connectedDeviceId);
            this.isConnected = true;  // 성공적으로 가져온 경우, LED를 녹색으로 설정합니다.
        }
    } catch (error) {
        console.error("블루투스 연결 상태를 확인하는 중 오류 발생:", error);
        this.isConnected = false;  // 연결이 끊어졌거나 오류가 발생한 경우, LED를 빨간색으로 설정합니다.

        // 이전에 연결되었던 블루투스 장치로 재연결을 시도합니다.
        try {
            if (this.connectedDeviceId) {
              await BleClient.connect(this.connectedDeviceId);
            }
            console.log('블루투스 재연결 성공:', this.connectedDeviceId);
            this.isConnected = true;  // 재연결 성공, LED를 녹색으로 설정합니다.
        } catch (reconnectError) {
            console.error("블루투스 재연결 중 오류 발생:", reconnectError);
            this.isConnected = false;  // 재연결 실패, LED를 빨간색으로 설정합니다.
        }
    }
  }

  async scanBluetoothDevices() {
    await BleClient.initialize();
    this.devices = []; 
    try {
      const result = await BleClient.requestDevice({});
      if (result && result.deviceId) {
        this.devices.push(result);
        console.log('불루투스 연결', result.deviceId);
        await BleClient.connect(result.deviceId);
        this.isConnected = true;
        this.connectedDeviceId = result.deviceId;
        await BleClient.write(result.deviceId, this.SERVICE_UUID, this.CHARACTERISTIC_UUID, this.stringToBytes1('connected'));
        this.showRetryMessage = false;
      }
    } catch (error) {
      console.error("Error scanning for devices:", error);
      this.showRetryMessage = true;  // 연결 실패 메시지 표시
    }
  }


  async connectToDevice(deviceId: string) {
    try {
      await BleClient.write(deviceId, this.SERVICE_UUID, this.CHARACTERISTIC_UUID, this.stringToBytes1('ok'));
    } catch (error) {
      console.error("Error connecting to device:", error);
    }
  }

  stringToBytes1(string: string): DataView {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    return new DataView(data.buffer);
  }

  async sendJsondataToDevice1() {
    try {
      const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // 서비스 UUID로 교체
      const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // 특성 UUID로 교체
      const jsonData = JSON.stringify({
        "angle1": this.lastDetectedAngle !== null ? Math.round(this.lastDetectedAngle) : null,
        "angle2": this.lastDetectedAngle2 !== null ? Math.round(this.lastDetectedAngle2) : null,
        "vel": this.lastDetectedDistance !== null ? Math.round(this.lastDetectedDistance) : null
      });
      const dataBuffer = this.stringToBytes(jsonData);
      const data1 = new DataView(dataBuffer);
      if(this.connectedDeviceId !== null) {
        await BleClient.write(this.connectedDeviceId, serviceUUID, characteristicUUID, data1);
        console.log('Data written to device',this.connectedDeviceId);
      }
    } catch (error) {
      console.error("Error sending data to device:", error);
    }
  }

  async sendDataToDevice(deviceId: string, data: string) {
    try {
      console.log('start write',deviceId);
      const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // 서비스 UUID로 교체
      const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // 특성 UUID로 교체
      const dataBuffer = this.stringToBytes(data);
      const data1 = new DataView(dataBuffer);

      await BleClient.write(deviceId, serviceUUID, characteristicUUID, data1);
      console.log('Data written to device',deviceId);
    } catch (error) {
      console.error("Error sending data to device:", error);
    }
  }

  stringToBytes(string: string) {
    const array = new Uint8Array(string.length);
    for (let i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  async disconnectFromDevice() {
    if (!this.isConnected || !this.connectedDeviceId) {
      console.error("장치가 연결되어 있지 않습니다.");
      return;
    }
  
    try {
      await BleClient.disconnect(this.connectedDeviceId);
      this.isConnected = false;
      this.connectedDeviceId = null;
      console.log("블루투스 연결이 끊어졌습니다.");
    } catch (error) {
      console.error("장치와의 연결을 끊는 중 오류 발생:", error);
    }
  }

  getEventPosition(event: any) {
    if (event instanceof MouseEvent) {
      return { x: event.clientX, y: event.clientY };
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    return { x: 0, y: 0 };
  }

  setupOriginalSlider() {
    const circle = this.el.nativeElement.querySelector('#circle');
    const ball = this.el.nativeElement.querySelector('#ball');
    const radiusDisplay = this.el.nativeElement.querySelector('#radius');
    const angleDisplay = this.el.nativeElement.querySelector('#angle');

    circle.addEventListener('mousedown', (event: MouseEvent) => {
      const pos = this.getEventPosition(event);
      const rect = ball.getBoundingClientRect();
      if (pos.x >= rect.left && pos.x <= rect.right && 
          pos.y >= rect.top && pos.y <= rect.bottom) {
          this.isDragging = true;
      }
    });

    circle.addEventListener('touchstart', (event: TouchEvent) => {
      const pos = this.getEventPosition(event);
      const rect = ball.getBoundingClientRect();
      if (pos.x >= rect.left && pos.x <= rect.right && 
          pos.y >= rect.top && pos.y <= rect.bottom) {
          this.isDragging = true;
      }
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    document.addEventListener('touchend', () => {
      this.isDragging = false;
      if (this.lastDetectedAngle !== null && this.lastDetectedDistance !== null) {
        this.sendJsondataToDevice1();
      }
    });

    circle.addEventListener('mousemove', this.handleOriginalSliderMovement.bind(this));
    circle.addEventListener('touchmove', this.handleOriginalSliderMovement.bind(this));
  }

  handleOriginalSliderMovement(event: any) {
    if (!this.isDragging) return;
  
    const circle = this.el.nativeElement.querySelector('#circle');
    const ball = this.el.nativeElement.querySelector('#ball');
    const radiusDisplay = this.el.nativeElement.querySelector('#radius');
    const angleDisplay = this.el.nativeElement.querySelector('#angle');
    const rect = circle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
  
    const pos = this.getEventPosition(event);
    const deltaX = pos.x - centerX;
    const deltaY = pos.y - centerY;
  
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
    if (distance <= rect.width / 2) {
        ball.style.left = `${pos.x - rect.left}px`;
        ball.style.top = `${pos.y - rect.top}px`;
  
        radiusDisplay.textContent = distance.toFixed(2);
        angleDisplay.textContent = angle.toFixed(2);
        
        // 블루투스 장치에 각도와 거리 값을 전송
        // 마지막으로 변경된 위치 값을 debounce 기법으로 전송
        const currentTime = Date.now();
        this.lastDetectedAngle = angle;
        this.lastDetectedDistance = distance;

         if (currentTime - this.lastSentTime > this.DEBOUNCE_TIME) {
          const jsonData = {
            "angle1": Math.round(this.lastDetectedAngle),
            "vel": Math.round(this.lastDetectedDistance)
          };
          if(this.connectedDeviceId !== null)
            this.sendDataToDevice(this.connectedDeviceId, JSON.stringify(jsonData));
          this.lastSentTime = currentTime;
        }
    }
    event.preventDefault();
  }
  
  setupSecondSlider(sliderId: string) {
    const container = this.el.nativeElement.querySelector(`#${sliderId}`);
    const display = container.querySelector('.value-display');
    const pointer = container.querySelector('.circle-pointer');
    const pointerLine = container.querySelector('.pointer-line');

    const getAngle = (event: any) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pos = this.getEventPosition(event);
        const deltaX = pos.x - centerX;
        const deltaY = pos.y - centerY;
        let angle = (Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 360 - 180) % 360;
        return (angle + 270) % 360; // 270°의 위치에서 각도 0°로 설정
    };

    /*
    const updatePointerPosition = (angle: number) => {
        const radius = container.offsetWidth / 2;
        const radian = angle * (Math.PI / 180);
        const x = radius + (radius - 20) * Math.cos(radian);  // 20은 수정된 녹색 포인터의 반지름입니다.
        const y = radius - (radius - 20) * Math.sin(radian);  // 20은 수정된 녹색 포인터의 반지름입니다.

        pointer.style.left = `${x - pointer.offsetWidth / 2}px`;
        pointer.style.bottom = `${y - pointer.offsetHeight / 2}px`;
    };
    */

    container.addEventListener('mousedown', (event: MouseEvent) => {
      this.isDragging = true;
      this.startAngle = getAngle(event) - (this.currentAngle - 270);
      event.preventDefault();
    });

    container.addEventListener('touchstart', (event: TouchEvent) => {
      this.isDragging = true;
      this.startAngle = getAngle(event) - (this.currentAngle - 270);
      event.preventDefault();
    });

    document.addEventListener('touchend', () => {
      this.isDragging = false;
      if (this.lastDetectedAngle2 !== null ) {
        this.sendJsondataToDevice1();
      }
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
    
    container.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.isDragging) {
        handleDrag(event);
      }
    });

    container.addEventListener('touchmove', (event: TouchEvent) => {
      if (this.isDragging) {
        handleDrag(event);
      }
    });

  // handleDrag를 async 함수로 선언합니다.
  const handleDrag = async (event: any) => {
      this.currentAngle = (getAngle(event) - this.startAngle + 360) % 360 + 270;
      let displayAngle = Math.round(this.currentAngle - 270) % 360; 
      display.textContent = `${displayAngle}°`;

      // 지침의 각도를 업데이트
      pointerLine.style.transform = `rotate(${this.currentAngle}deg)`;

      // 녹색 포인터의 위치를 업데이트
      this.updatePointerPosition(this.currentAngle);

      // 마지막으로 변경된 위치 값을 debounce 기법으로 전송
      const currentTime2 = Date.now();
      this.lastDetectedAngle2 = displayAngle;

      if (currentTime2 - this.lastSentTime2 > this.DEBOUNCE_TIME2) {
        const jsonData = JSON.stringify({
          "angle2": displayAngle
        });
        if (this.isConnected && this.connectedDeviceId !== null) {
          this.sendDataToDevice(this.connectedDeviceId, jsonData);
          this.lastSentTime2 = currentTime2;
        }
      }
      event.preventDefault();
    };
  }

}

