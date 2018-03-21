import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import * as Braille from '../../assets/js/braille.js'
declare let BrailleKeys:any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
  export class HomePage {
    BrailleKeys = Braille.GetKeysFromMap(Braille.BrailleMap);
    constructor(private toastCtrl: ToastController, private bluetoothSerial: BluetoothSerial){
      console.log("HomePage controller")
      console.log(Braille.BrailleMap)
      console.log(this.BrailleKeys)
      this.bluetoothSerial.isEnabled().then(this.bluetoothSuccess, this.bluetoothFailed)
    }

    bluetoothSuccess(success){
      console.log("Bluetooth is enabled..." + success)
      this.presentToast("Bluetooth is enabled..." + success)
      this.bluetoothSerial.discoverUnpaired().then(this.listUnpairedDevices, this.failedListing)
    }


    bluetoothFailed(error){
      console.log("Bluetooth is not enabled with error: " + error + " ...attempting to enabled...")
      this.presentToast("Bluetooth is not enabled with error: " + error + " ...attempting to enabled...")      
      this.bluetoothSerial.enable().then(this.bluetoothSuccess, this.bluetoothEnableFailure)
    }

    bluetoothEnableFailure(error){
      console.log("Bluetooth enable failed due to error: " + error);
      this.presentToast("Bluetooth enable failed due to error: " + error)
    }

    failedListing(error){
      console.log("Failed listing unpaired devices..." +error)
      this.presentToast("Failed listing unpaired devices..." +error)
    }

    listUnpairedDevices(list){
      console.log("Found devices...");
      console.log(list);
      this.presentToast("Found " + list.size + " devices.");
    }

    OnButtonClick(key){
      console.log('Button pressed: ' + key);
      console.log('Button value: ' + Braille.BrailleMap.get(key));
      this.presentToast('Button value: ' + Braille.BrailleMap.get(key));
    }

    presentToast(msg){
      let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
      });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
    }
  }
