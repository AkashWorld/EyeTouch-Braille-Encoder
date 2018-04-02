import * as Braille from '../js/braille.js'

function TextHolder() {
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
    console.log("textHolder.SetBrailleText: Setting ASCII text: " + input + " to Braille Text Encoding: " + brailleText);
    console.log(this);
    if (brailleText) {
      this.BrailleText = brailleText;
      this.index = 0;
    }
  }


  this.GetBrailleText = function() {
    return this.BrailleText;
  }

/**
 * Returns the String of Braille Encodings based on the current index tracked by the
 * Braille Holder Object.
 * @param {boolean isForward a set that is ahead of the current index if true, else retrieve
 * a set that is previous of the current index} isForward
 */
this.GetASetOfBrailleText = function(isForward) {
  let BrailleSetSize = 4 * this.BrailleEncodingSize;
  console.log("textHolder.GetASetOfBrailleText: expected set size", BrailleSetSize);
  if (!isForward) {
    if ((this.index - BrailleSetSize) >= 0) {
      this.index = this.index - BrailleSetSize;
      console.log("textHolder.GetASetOfBrailleText: detected request to go backwards. Setting index to: " + this.index);
    }
  }
  let charactersLeft = this.BrailleText.length - BrailleSetSize;
  let retStr = "";
  if (charactersLeft < 0) {
    console.log("textHolder.GetASetOfBrailleText: Characters Left " + charactersLeft + " is less than the Braille Set Size " + BrailleSetSize);
    retStr = this.BrailleText.substring(this.index);
    this.index = this.index + retStr.length;
    while (retStr.length < BrailleSetSize) {
      retStr = retStr.concat('0');
    }
  }
  else {
    console.log("textHolder.GetASetOfBrailleText: Braille set size " + BrailleSetSize + "is less than the amount of Characters Left " + charactersLeft);
    retStr = this.BrailleText.substring(this.index, this.index + BrailleSetSize);
    this.index = this.index + BrailleSetSize;
  }
  console.log("textHolder.GetASetOfBrailleText: returning " + retStr);
  return retStr;
}
}

export let brailleHolder = new TextHolder();







