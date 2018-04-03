import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import * as Braille from '../../assets/js/braille.js'
import * as TextHolder from '../../assets/js/textHolder.js'
import { NgZone } from '@angular/core';
import {Storage} from '@ionic/storage'
import { TextReaderPage } from '../textreader/textreader';
import { SpeechUIPage } from './../speechUI/speechUI';
import { BTsetupPage } from '../btsetup/btsetup';
@Component({
  selector: 'page-test',
  templateUrl: 'test.html'
})
  export class TestPage {
    BrailleKeys = Braille.GetKeysFromMap(Braille.BrailleMap);
    DEVICE_NAME = "BRAILLE";
    brailleDevice = null;
    isBTEnabled = false;
    isConnectedToDevice = false;
    isReverseBraille = false;
    btStatus = "Not connected."
    inputValue = "";
    constructor(public toastCtrl: ToastController, public bluetoothSerial: BluetoothSerial,
       public ngZone: NgZone, public storage: Storage, private navCtr: NavController){
      console.log("HomePage controller")
      console.log(Braille.BrailleMap)
      console.log(this.BrailleKeys)
      this.storage.get('reverseBraille').then((value)=>{
        console.log("Found reverse braille value: " + value);
        if(value == "true"){
          this.isReverseBraille = true;
        }else{
          this.isReverseBraille = false;
        }
      })
      this.bluetoothSerial.isConnected().then(()=>this.ConnectedToDevice(),()=>this.DisonnectedFromDevice());
    }


    OnButtonClick(key){
      console.log('Button pressed: ' + key);
      console.log('Button value: ' + Braille.BrailleMap.get(key));
      TextHolder.brailleHolder.SetBrailleText(key);
      let strVal = TextHolder.brailleHolder.GetASetOfBrailleText(true, 0);
      console.log(TextHolder.brailleHolder);
      if(this.isReverseBraille){
        strVal = Braille.reverseBrailleEncoding(strVal);
      }
      this.presentToast('Writing value: ' + strVal);
      this.WriteToBluetooth(strVal);
    }

    SendInputMessage(){
      console.log('Attempting to send value: ' + this.inputValue);
      TextHolder.brailleHolder.SetBrailleText(this.inputValue);
      let strVal = TextHolder.brailleHolder.GetASetOfBrailleText(true, 0);
      if(this.isReverseBraille){
        strVal = Braille.reverseBrailleEncoding(strVal);
      }
      this.presentToast('Writing value: ' + strVal);
      this.WriteToBluetooth(strVal);
    }

    OpenTextReaderPage(){
      console.log('Attempting to open Text Reader...');
      this.navCtr.push(TextReaderPage);
    }

    OpenSpeechUI(){
      console.log('Attempting to open Speech UI...');
      this.navCtr.push(SpeechUIPage);
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
      this.ngZone.run(() => {
        //Asynchronous promise
        this.isConnectedToDevice = true;
        this.btStatus = "Braille device connected!"
      });
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
      this.ngZone.run(()=>{
        //Asynchronous promise
        this.isConnectedToDevice = false;
        this.btStatus = "Not connected."
      });
      console.log("Disconnected from BRAILLE device...")
      this.presentToast("Disconnected from BRAILLE device...")
      this.brailleDevice = null;
      this.navCtr.popToRoot();
    }



    WriteToBluetooth(stringToSend){
      this.bluetoothSerial.write(stringToSend).then(function(){console.log("Write successful.")},function(){console.log("Write failed.")})
    }

    OnReverseToggle(){
      if(this.isReverseBraille){
        this.isReverseBraille = false;
        this.storage.set('reverseBraille',  'false');
      }
      else if(!this.isReverseBraille){
        this.isReverseBraille = true;
        this.storage.set('reverseBraille', 'true')
      }
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

