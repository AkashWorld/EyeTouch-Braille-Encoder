import {Braille} from 'braille.js'

export class TextHolder{
  BrailleText = "";
  Index = 0;
  BrailleEncodingSize = 3;
  constructor(){}

  SetBrailleText(input){
    let brailleText = Braille.convertStringToBraille(input);
    if(!brailleText){
      this.BrailleText = brailleText;
      Index = 0;
    }
  }

  GetBrailleText(){
    return this.BrailleText;
  }

  GetASetOfBrailleText(isForward){
    if(!isForward){
      if((this.Index - 4*this.BrailleEncodingSize) >= 0){
        this.Index = this.Index - 4*this.BrailleEncodingSize;
      }
    }
    let retStr = this.BrailleText.substring(this.Index, this.Index+4*this.BrailleEncodingSize);
    this.Index = this.Index + 4*this.BrailleEncodingSize;
    return retStr;
  }
  GetASetOfBrailleText(isForward, quantity){
    if(!isForward){
      if((this.Index - quantity*this.BrailleEncodingSize) >= 0){
        this.Index = this.Index - quantity*this.BrailleEncodingSize;
      }
    }
    let retStr = this.BrailleText.substring(this.Index, this.Index+quantity*this.BrailleEncodingSize);
    this.Index = this.Index + quantity*this.BrailleEncodingSize;
    return retStr;
  }

}
