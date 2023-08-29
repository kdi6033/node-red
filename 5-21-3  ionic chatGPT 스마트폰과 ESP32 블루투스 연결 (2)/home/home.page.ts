//const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
//const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
import { Component } from '@angular/core';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  devices: BleDevice[] = [];
  connectedDevice: BleDevice | null = null;

  constructor() {
    this.initializeBluetooth();
  }

  async initializeBluetooth() {
    try {
      await BleClient.initialize();
      console.log('Bluetooth initialized successfully');
    } catch (error) {
      console.error('Error initializing Bluetooth:', error);
    }
  }

  async scan() {
    try {
      const result = await BleClient.requestDevice();
      if (result) {
        this.devices = [result];
      }
    } catch (error) {
      console.error('Error scanning for devices:', error);
    }
  }

  async connectToDevice(device: BleDevice) {
    try {
      await BleClient.connect(device.deviceId);
      console.log('Connected to', device.name);
      this.connectedDevice = device;  // 연결된 장치 저장

      const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
      const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
      const uint8Array = new TextEncoder().encode("ok");
      const dataView = new DataView(uint8Array.buffer);
      await BleClient.write(
        device.deviceId,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        dataView
      );
      console.log('Sent "ok" to', device.name);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }

  async disconnect() {
    if (this.connectedDevice) {
      try {
        await BleClient.disconnect(this.connectedDevice.deviceId);
        console.log('Disconnected from', this.connectedDevice.name);
        this.connectedDevice = null;
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  }
}
