import { TextToSpeech } from '@ionic-native/text-to-speech';
import { TestPage } from './../test/test';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NgZone } from '@angular/core';
import { SpeechUIPage } from '../speechUI/speechUI';

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

    constructor(private toastCtrl: ToastController, private bluetoothSerial: BluetoothSerial, private ngZone: NgZone,
                private navCtrl:NavController, private storage:Storage, private tts: TextToSpeech){
      console.log("BTsetupPage controller")
      this.TurnOnBluetooth();
    }

    OpenSpeechUI(){
      this.navCtrl.push(SpeechUIPage);
    }

    OpenTestPage(){
      this.navCtrl.push(TestPage);
    }

    /**
     * Checks if bluetooth is on, and turns it on if not. After, it starts the
     * sequence to connect to the BRAILLE bluetooth module.
     */
    TurnOnBluetooth(){
      this.tts.speak('Attempting to connect to Braille Device');
      console.log("Initializing bluetooth connection sequence...")
      this.bluetoothSerial.isEnabled().then(()=>this.DeviceIsEnabled(),
      //on device disabled
      ()=>{this.bluetoothSerial.enable().then(()=>this.DeviceIsEnabled(),
        //on failed attempt to enable device
        ()=>{
        console.log("Bluetooth is disabled...")
        this.isBTEnabled = false;
      })});
    }

    DeviceIsEnabled(){
      console.log("Bluetooth is enabled...")
      this.isBTEnabled = true;
      this.storage.get(this.DEVICE_NAME).then((value)=>{
        console.log("Found BRAILLE address: " + value);
        console.log("Connecting to device.")
        this.bluetoothSerial.connect(value).subscribe(()=>this.ConnectedToDevice(), ()=>this.DisonnectedFromDevice());
      }, ()=>{
        console.log("Could not find device address in internal storage...");
        this.FindBrailleDeviceSequence();
      })
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
          this.storage.set(this.DEVICE_NAME, this.brailleDevice.address);
          this.bluetoothSerial.connect(this.brailleDevice.address).subscribe(()=>this.ConnectedToDevice(), ()=>this.DisonnectedFromDevice());
        }
      }
      if(this.brailleDevice == null){
        console.log("Error finding Braille Bluetooth module!")
        this.FindBrailleDeviceSequence();
      }
    }

    ConnectedToDevice(){
      this.navCtrl.popToRoot();
      this.tts.speak("Connected to Braille Device");
      console.log("Connected to BRAILLE device...")
      this.ngZone.run(() => {
        //Asynchronous promise
        this.isConnectedToDevice = true;
        this.btStatus = "Braille device connected!"
      });
      this.navCtrl.push(SpeechUIPage);
    }

    DisonnectedFromDevice(){
      this.tts.speak("Disconnected from Braille Device");
      //TODO POP ALL PAGES TO ROOT ON FINAL RELEASE
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

