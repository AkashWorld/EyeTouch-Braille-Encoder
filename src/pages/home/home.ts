import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import * as Braille from '../../assets/js/braille.js'
declare let BrailleKeys:any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
  export class HomePage {
    btStatus = "Not connected."
    BrailleKeys = Braille.GetKeysFromMap(Braille.BrailleMap);
    DEVICE_NAME = "BRAILLE";
    brailleDevice = null;
    isBTEnabled = false;
    isConnectedToDevice = false;
    constructor(public toastCtrl: ToastController, public bluetoothSerial: BluetoothSerial){
      this.DEVICE_NAME = "BRAILLE";
      console.log("HomePage controller")
      console.log(Braille.BrailleMap)
      console.log(this.BrailleKeys)
    }

    //OnClick()=> Method that turns on bluetooth
    TurnOnBluetoothOnClick(){
      this.bluetoothSerial.isEnabled().then(()=>this.DeviceIsEnabled(),()=>this.EnableDevice());
    }


    EnableDevice(){
      console.log("Attempting to enable bluetooth...")
      this.bluetoothSerial.enable().then(()=>this.DeviceIsEnabled(),()=>this.DeviceIsDisabled())
    }


    DeviceIsEnabled(){
      console.log("Bluetooth is enabled...")
      this.isBTEnabled = true;
    }

    DeviceIsDisabled(){
      console.log("Bluetooth is disabled...")
      this.isBTEnabled = false;
    }

    //OnClick() => Find nearby braille devices
    FindBrailleDeviceOnClick(){
      if(this.isBTEnabled){
        this.bluetoothSerial.discoverUnpaired().then((Devices)=>this.FindBrailleDevice(Devices),function(){console.log("Unable to list unpaired devices.")})
      }
      else{
        console.log("Cannot list bluetooth devices, must enable bluetooth first!")
      }
    }

    FindBrailleDevice(Devices){
      console.log("Listing unpaired Bluetooth devices...")
      for(let i = 0; i < Devices.size; i++){
        let device = Devices[i]
        console.log("Name: " + device.name)
        if(device.name == this.DEVICE_NAME){
          this.brailleDevice = device;
          console.log("Braille BT module found!")
          let retval = this.bluetoothSerial.connect(this.brailleDevice.address).subscribe(()=>this.ConnectedToDevice(), ()=>this.DisonnectedFromDevice());
        }
      }
    }

    ConnectedToDevice(){
      console.log("Connected to BRAILLE device...")
      this.isConnectedToDevice = true;
    }

    DisonnectedFromDevice(){
      console.log("DIsconnected from BRAILLE device...")
      this.isConnectedToDevice = false;
    }

    OnButtonClick(key){
      console.log('Button pressed: ' + key);
      console.log('Button value: ' + Braille.BrailleMap.get(key));
      this.presentToast('Button value: ' + Braille.BrailleMap.get(key));
      if(!this.isConnectedToDevice || this.brailleDevice == null){
        console.log("Not connected to device...")
        return;
      }
      this.bluetoothSerial.write(Braille.BrailleMap.get(key))
    }


    presentToast(msg){
      let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
      });
    toast.present();
    }
  }

