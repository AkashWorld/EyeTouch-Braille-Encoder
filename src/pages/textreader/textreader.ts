import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
declare let SMS:any;
@Component({
  selector: 'page-textreader',
  templateUrl: 'textreader.html'
})
  export class TextReaderPage {
    messages:any=[]
    constructor(public toastCtrl: ToastController, public androidPerm: AndroidPermissions,
      public platform: Platform, public ngZone: NgZone){
      console.log("TextReader controller")
      this.CheckPermissions();
    }

    CheckPermissions(){
      this.androidPerm.requestPermission(this.androidPerm.PERMISSION.READ_SMS).then(
        success=>{
          console.log("User granted permission!");
          this.ReadSMSList();
        },
        error=>{
          console.log("User denied permission! " + error);
        })
    }

    ReadSMSList(){
      console.log("Reading SMS List");
      this.platform.ready().then((readySource) => {
        if(SMS) SMS.listSMS({}, (ListSms)=>{
        this.ngZone.run(()=>{
          this.messages=ListSms
          console.log(this.messages);
        });
        },
        Error=>{
          console.log("Error retrieving SMS..." + Error)
        });
      });
    }

  }
