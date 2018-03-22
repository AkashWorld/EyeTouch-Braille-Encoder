import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import * as Braille from '../../assets/js/braille.js'
declare let BrailleKeys:any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
  export class HomePage {
    BrailleKeys = Braille.GetKeysFromMap(Braille.BrailleMap);
    DEVICE_NAME = "BRAILLE";
    brailleDevice = null;
    isBTEnabled = false;
    isConnectedToDevice = false;
    btStatus = "Not connected."

    constructor(public toastCtrl: ToastController, public bluetoothSerial: BluetoothSerial){
      this.DEVICE_NAME = "BRAILLE";
      console.log("HomePage controller")
      console.log(Braille.BrailleMap)
      console.log(this.BrailleKeys)
      this.TurnOnBluetooth();
    }

    //OnClick()=> Method that turns on bluetooth
    TurnOnBluetooth(){
      console.log("Initializing bluetooth connection sequence...")
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
      this.btStatus = "Attempting to pair with Braille device..."
      if(this.isBTEnabled){
        this.bluetoothSerial.discoverUnpaired().then((Devices)=>this.FindBrailleDevice(Devices),function(){console.log("Unable to list unpaired devices.")})
      }
      else{
        console.log("Cannot list bluetooth devices, must enable bluetooth first!")
        this.TurnOnBluetooth();
      }
    }

    FindBrailleDevice(Devices){
      console.log("Listing unpaired Bluetooth devices...")
      console.log(Devices)
      for(let item in Devices){
        if(Devices[item].name == this.DEVICE_NAME){
          this.brailleDevice = Devices[item];
          console.log("Braille BT module found!")
          this.bluetoothSerial.connect(this.brailleDevice.address).subscribe(()=>this.ConnectedToDevice(), ()=>this.DisonnectedFromDevice());
        }
      }
      if(this.brailleDevice == null){
        console.log("Error finding Braille Bluetooth module!")
      }
    }

    ConnectedToDevice(){
      this.isConnectedToDevice = true;
      console.log("Connected to BRAILLE device...")
      this.btStatus = "Braille device connected!"
    }

    DisonnectedFromDevice(){
      this.isConnectedToDevice = false;
      this.brailleDevice = null;
      console.log("Disconnected from BRAILLE device...")
      this.btStatus = "Not connected."
    }

    OnButtonClick(key){
      console.log('Button pressed: ' + key);
      console.log('Button value: ' + Braille.BrailleMap.get(key));
      this.presentToast('Button value: ' + Braille.BrailleMap.get(key));
      if(!this.isConnectedToDevice || this.brailleDevice == null){
        console.log("Not connected to device...")
        return;
      }
      this.btStatus = "Attempting to write: " + key
      this.bluetoothSerial.write(Braille.BrailleMap.get(key)).then(function(){console.log("Write successful.")},function(){console.log("Write failed.")})
    }

/**
 * Toast UI function method
 * @param msg Message to put into toast
 */
    presentToast(msg){
      let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
      });
    toast.present();
    }
  }

