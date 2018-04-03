import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Component } from '@angular/core';
import { NavController, ToastController, Platform, NavParams } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { TestPage } from '../test/test';
import { TextHolder } from '../../assets/js/textHolder.js'
import { Braille } from '../../assets/js/braille.js'
@Component({
  selector: 'page-speechUI',
  templateUrl: 'speechUI.html'
})
export class SpeechUIPage {
  isReverseBraille:any = false;
  inputValue:string = "";
  constructor(public toastCtrl: ToastController, public androidPerm: AndroidPermissions,
      public platform: Platform, public ngZone: NgZone, public bluetoothSerial: BluetoothSerial,
      public navCtrl: NavController){
      console.log("SpeechUI controller");
      this.navCtrl.swipeBackEnabled = false;
      bluetoothSerial.isConnected().then(()=>{this.presentToast("Bluetooth is connected!")},()=>{this.presentToast("Bluetooth is disconnected!")});
  }



OpenTestPage(){
  console.log("Attempting to open test page...")
  this.navCtrl.push(TestPage);
}


OnMessageForward(){
  console.log('Attempting to forward the Braille set by one character');
  TextHolder.brailleHolder.SetBrailleText(this.inputValue);
  let strVal = TextHolder.brailleHolder.GetASetOfBrailleText(true, 1);
  if(this.isReverseBraille){
    strVal = Braille.reverseBrailleEncoding(strVal);
  }
  this.presentToast('Writing value: ' + strVal);
  this.WriteToBluetooth(strVal);
}

OnMessageBackward(){
  console.log('Attempting to move backward the Braille set by one character');
  TextHolder.brailleHolder.SetBrailleText(this.inputValue);
  let strVal = TextHolder.brailleHolder.GetASetOfBrailleText(false, 1);
  if(this.isReverseBraille){
    strVal = Braille.reverseBrailleEncoding(strVal);
  }
  this.presentToast('Writing value: ' + strVal);
  this.WriteToBluetooth(strVal);
}

ConnectedToDevice(){
  console.log("Connected to BRAILLE device...")
  let subscription = this.bluetoothSerial.subscribe('\n').subscribe((input)=>this.RespondToBluetooth(input), ()=>{
    console.log("Error subscribing");
  });
}

RespondToBluetooth(input){
  console.log("String received from Bluetooth device '" + input + "' of size " + input.length);
  this.presentToast("Received from Bluetooth: " + input);
  if(input == "f\n"){
    this.OnMessageForward();
  }
  else if(input == "b\n"){
    this.OnMessageBackward();
  }
}

DisonnectedFromDevice(){
  console.log("Disconnected from BRAILLE device...")
  this.presentToast("Disconnected from BRAILLE device...")
  this.navCtrl.popToRoot();
}



WriteToBluetooth(stringToSend){
  this.bluetoothSerial.write(stringToSend).then(function(){console.log("Write successful.")},function(){console.log("Write failed.")})
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
