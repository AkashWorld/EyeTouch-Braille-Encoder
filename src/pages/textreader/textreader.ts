import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { NgZone } from '@angular/core';
@Component({
  selector: 'page-textreader',
  templateUrl: 'textreader.html'
})
  export class TextReaderPage {
    constructor(public toastCtrl: ToastController){
      console.log("TextReader controller")
    }
  }
