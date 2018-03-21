import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Braille from '../../assets/js/braille.js'
declare let BrailleKeys:any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
  export class HomePage {
    BrailleKeys = Braille.GetKeysFromMap(Braille.BrailleMap);
    constructor(){
      console.log("HomePage controller")
      console.log(Braille.BrailleMap);
      console.log(this.BrailleKeys);
    }


    OnButtonClick(key){
        console.log('Button pressed: ' + key);
        console.log('Button value: ' + Braille.BrailleMap.get(key));
    }



/*
    CreateButtons(){
      let buttons = [];
      for(let[key,value] of Braille.BrailleMap){
          let button = {
          text: key,
          handler: ()=>{
            console.log(value)
          }
        }
        return buttons;
      }
    }
    */
  }
