import * as Braille from '../js/braille.js'

export function TextHolder() {
  this.BrailleText = "";
  this.index = 0;
  this.BrailleEncodingSize = 3;

  /**
 * Sets the BrailleText from an input of normal text. Converts
 * the normal ASCII text to it's braille integer encodings and
 * stores it in memory.
 * @param {Normal ASCII string} input
 */
  this.SetBrailleText = function(input) {
    let brailleText = Braille.convertStringToBraille(input);
    if(brailleText == this.BrailleText){
      console.log("textHolder.SetBrailleText: Text already set. Not resetting index.");
    }
    else if (brailleText) {
      console.log("textHolder.SetBrailleText: Setting new braille text, index being reset to 0");
      this.BrailleText = brailleText;
      this.index = 0;
    }
    console.log(this);
  }

  /**
   * Sets the index of the BrailleText currently in memory safetly
   * so it does not overflow or underflow.
   * @param Requested index
   */
  this.SetIndex = function(index){
    if(typeof(index) != 'number'){
      console.log("textHolder.SetIndex: input value is invalid " + index);
      return;
    }
    if(index < 0){
      console.log("textHolder.SetIndex: Setting index to 0.");
      this.index = 0;
    }
    else if(index > this.BrailleText.length){
      this.index = this.BrailleText.length;
      console.log("textHolder.SetIndex: Setting index to maximum length " + this.BrailleText.length - 1);
    }
    else{
      console.log("textHolder.SetIndex: Setting index to " + index);
      this.index = index;
    }
  }

  /**
   * Increments the index by a set amount based on the Braille Encoding Size.
   * @param incrementAmount is the amount of BRAILLE CELLS to increment, not encode characters.
   */
  this.IncrementIndex = function(incrementAmount){
    let currIndex = this.GetIndex();
    currIndex = currIndex + incrementAmount * this.BrailleEncodingSize;
    console.log("textHolder.IncrementIndex: attempting to increment index from " + this.GetIndex() + " to " + currIndex);
    this.SetIndex(currIndex);
  }

  /**
   * Decrements the index by a set amount based on the Braille Encoding Size.
   * @param decrementAmount is the amount of BRAILLE CELLS to decrement, not encode characters.
   */
  this.DecrementIndex = function(decrementAmount){
    let currIndex = this.GetIndex();
    currIndex = currIndex - decrementAmount * this.BrailleEncodingSize;
    console.log("textHolder.DecrementIndex: attempting to decrement index from " + this.GetIndex() + " to " + currIndex);
    this.SetIndex(currIndex);
  }


  this.GetIndex = function(){
    console.log("textHolder.GetIndex: returning index " + this.index);
    return this.index;
  }

  this.GetBrailleText = function() {
    return this.BrailleText;
  }

  /**
   * Returns the Braille Text from an index that is the size of a specified Braille Cell
   */
  this.GetPaddedBrailleText = function(numberOfCells){
    let retStr = this.BrailleText;
    let charactersLeft = (this.BrailleText.length - 1) - this.GetIndex();
    let setSize = numberOfCells * this.BrailleEncodingSize;
    if(charactersLeft < setSize){ //If the number of characters left is less than the Set Size (4 braille cells), pad the rest with 0s.
      if(this.GetIndex() == this.BrailleText.length){
        retStr = '';
      }
      else{
        retStr = retStr.substring(this.GetIndex());
      }
      while(retStr.length < setSize){
        retStr = retStr.concat('0');
      }
      return retStr;
    }
    else{
      return retStr.substring(this.GetIndex(), this.GetIndex() + setSize);
    }
  }


/**
 * Returns the String of Braille Encodings based on the current index tracked by the
 * Braille Holder Object.
 * @param {boolean isForward a set that is ahead of the current index if true, else retrieve
 * a set that is previous of the current index} isForward. Moves forward the index by a set
 * of four encodings.
 */
  this.GetASetOfBrailleText = function(isForward, shiftAmount) {
    if(isForward){ //Request to shift cells forward
      this.IncrementIndex(shiftAmount);
    }
    else if(!isForward){ //Request to shift cells backward
      this.DecrementIndex(shiftAmount);
    }
    let retStr = this.GetPaddedBrailleText(4);
    return retStr;
  }
}

export let brailleHolder = new TextHolder();







