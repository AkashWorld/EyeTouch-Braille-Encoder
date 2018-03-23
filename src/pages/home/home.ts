import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import * as Braille from '../../assets/js/braille.js'
import { NgZone } from '@angular/core';
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
    inputValue = "";

    constructor(public toastCtrl: ToastController, public bluetoothSerial: BluetoothSerial, public ngZone: NgZone){
      console.log("HomePage controller")
      console.log(Braille.BrailleMap)
      console.log(this.BrailleKeys)
      this.TurnOnBluetooth();
    }

    /**
     * Checks if bluetooth is on, and turns it on if not. After, it starts the
     * sequence to connect to the BRAILLE bluetooth module.
     */
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
      this.FindBrailleDeviceSequence();
    }

    DeviceIsDisabled(){
      console.log("Bluetooth is disabled...")
      this.isBTEnabled = false;
    }


    FindBrailleDeviceSequence(){
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
        this.FindBrailleDeviceSequence();
      }
    }

    ConnectedToDevice(){
      console.log("Connected to BRAILLE device...")
      this.ngZone.run(() => {
        //Asynchronous promise
        this.isConnectedToDevice = true;
        this.btStatus = "Braille device connected!"
      });
    }

    DisonnectedFromDevice(){
      this.ngZone.run(()=>{
        //Asynchronous promise
        this.isConnectedToDevice = false;
        this.btStatus = "Not connected."
      });
      console.log("Disconnected from BRAILLE device...")
      this.brailleDevice = null;
      this.TurnOnBluetooth();
    }

    OnButtonClick(key){
      console.log('Button pressed: ' + key);
      console.log('Button value: ' + Braille.BrailleMap.get(key));
      if(!this.isConnectedToDevice || this.brailleDevice == null){
        console.log("Not connected to device...")
        this.TurnOnBluetooth();
        return;
      }
      let value = Braille.BrailleMap.get(key);
      let strVal = Braille.ConvertKeyToPaddedString(value)
      while(strVal.length < 12){
        strVal = strVal.concat('0');
      }
      this.presentToast('Writing value: ' + strVal);
      this.bluetoothSerial.write(strVal).then(function(){console.log("Write successful.")},function(){console.log("Write failed.")})
    }

    SendInputMessage(){
      console.log('Attempting to send value: ' + this.inputValue);
      if(!this.isConnectedToDevice || this.brailleDevice == null){
        console.log("Not connected to device...")
        this.TurnOnBluetooth();
        return;
      }
      let strVal = "";
      for(let i = this.inputValue.length - 1; i >= 0; i--){
        let val = Braille.BrailleMap.get(this.inputValue.charAt(i))
        strVal = strVal.concat(Braille.ConvertKeyToPaddedString(val))
      }
      while(strVal.length < 12){
        strVal = '0'.concat(strVal);
      }
      this.presentToast('Writing value: ' + strVal);
      this.bluetoothSerial.write(strVal).then(function(){console.log("Write successful.")},function(){console.log("Write failed.")})
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

