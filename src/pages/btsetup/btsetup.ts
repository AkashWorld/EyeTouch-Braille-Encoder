import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NgZone } from '@angular/core';
@Component({
  selector: 'page-btsetup',
  templateUrl: 'btsetup.html'
})
  export class BTsetupPage {
    DEVICE_NAME = "BRAILLE";
    brailleDevice = null;
    isBTEnabled = false;
    isConnectedToDevice = false;
    btStatus = "Not connected."

    constructor(public toastCtrl: ToastController, public bluetoothSerial: BluetoothSerial, public ngZone: NgZone){
      console.log("BTsetupPage controller")
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

