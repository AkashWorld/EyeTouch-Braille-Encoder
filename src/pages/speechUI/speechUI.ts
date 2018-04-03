import { Storage } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Component } from '@angular/core';
import { NavController, ToastController, Platform, NavParams } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { TestPage } from '../test/test';
import { TextHolder } from '../../assets/js/textHolder.js';
import { Braille } from '../../assets/js/braille.js';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-speechUI',
  templateUrl: 'speechUI.html'
})
export class SpeechUIPage {
  isReverseBraille:any = false;
  inputValue:string = "";

  //Constructor that sets up the Speech UI Page
  constructor(private toastCtrl: ToastController, private bluetoothSerial: BluetoothSerial, private navCtrl: NavController,
              private speechRecognition: SpeechRecognition, private tts: TextToSpeech, private storage: Storage){
      console.log("SpeechUI controller");
      //checks internal storage to see if the user prefers to use reversed Braille letters
      //in their BRAILLE device
      this.storage.get('reverseBraille').then((value)=>{
        console.log("Found reverse braille value: " + value);
        if(value == "true"){
          this.isReverseBraille = true;
        }else{
          this.isReverseBraille = false;
        }
      })
      this.tts.speak("Listening for your request.");
      //Checks if bluetooth is connected.
      bluetoothSerial.isConnected().then(()=>{this.ConnectedToDevice()},()=>(console.log("Device is disconnected from BT, popping to root.")));
      //Checks if the phone gives user permission use speech recognition, if successful, the speech recognition sequence is started.
      this.speechRecognition.requestPermission().then(()=>this.StartSpeechRecognition(), ()=>console.log("Error receiving permission!"));
  }

  /**
   * Asks user to record speech.
   */
  StartSpeechRecognition(){
    this.speechRecognition.isRecognitionAvailable()
    .then((available: boolean) => {
      console.log("Speech Recognition is available");
      if(available){
        this.speechRecognition.startListening().subscribe((detectedText)=>this.ParseDetectedSpeech(detectedText));
      }
    });
  }

  /**
   * Speech parser method that delegates the received inputs to various methods
   * @param input array of strings that are detected from the speech recognition.
   */
  ParseDetectedSpeech(input){
    console.log("Listing detected speech...");
    //loop through the received messages
    for(let index in input){
      let speech = input[index];
      console.log(speech);
      speech = speech.toLowerCase(); //normalize the text to lower case
      if(speech == 'open test' || speech == 'test'){
        this.OpenTestPage();
        return;
      }
      else{

      }
    }
  }


/**
 * Opens the TestPage for debugging purposes.
 */
OpenTestPage(){
  console.log("Attempting to open test page...")
  this.navCtrl.push(TestPage);
}

/**
 *
 * @param stringToSend is the string which the phone will send to the bluetooth.
 */
WriteToBluetooth(stringToSend){
  this.bluetoothSerial.write(stringToSend).then(function(){console.log("Write successful.")},function(){console.log("Write failed.")})
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
  //create a listener subscription that returns a call back whenever the bluetooth receives an input
  //calls RespondToBluetooth method that responds to the call
  let subscription = this.bluetoothSerial.subscribe('\n').subscribe((input)=>this.RespondToBluetooth(input), ()=>{
    console.log("Error subscribing");
  });
}

/**Method that responds to the Bluetooth callback for a read.
*If 'f\n' is found, the braille letters on the device is incremented forward
*If 'b\n' is found, the braille letters on the device is decremented backward
*@param Input is the received message
**/
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
