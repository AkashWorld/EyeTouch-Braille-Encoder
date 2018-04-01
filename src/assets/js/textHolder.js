import * as Braille from '../js/braille.js'

function BrailleHolder() {
  this.BrailleText = "";
  this.index = 0;
  this.BrailleEncodingSize = 3;
}

export let brailleHolder = new BrailleHolder();

/**
 * Sets the BrailleText from an input of normal text. Converts
 * the normal ASCII text to it's braille integer encodings and
 * stores it in memory.
 * @param {Normal ASCII string} input
 */
export function SetBrailleText(input) {
  let brailleText = Braille.convertStringToBraille(input);
  console.log("textHolder.SetBrailleText: Setting ASCII text: " + input + " to Braille Text Encoding: " + brailleText);
  console.log(brailleHolder);
  if (brailleText) {
    brailleHolder.BrailleText = brailleText;
    brailleHolder.index = 0;
  }
}

export function GetBrailleText() {
  return brailleHolder.BrailleText;
}

/**
 * Returns the String of Braille Encodings based on the current index tracked by the
 * Braille Holder Object.
 * @param {boolean isForward a set that is ahead of the current index if true, else retrieve
 * a set that is previous of the current index} isForward
 */
export function GetASetOfBrailleText(isForward) {
  let BrailleSetSize = 4 * brailleHolder.BrailleEncodingSize;
  console.log("textHolder.GetASetOfBrailleText: expected set size", BrailleSetSize);
  if (!isForward) {
    if ((brailleHolder.index - BrailleSetSize) >= 0) {
      brailleHolder.index = brailleHolder.index - BrailleSetSize;
      console.log("textHolder.GetASetOfBrailleText: detected request to go backwards. Setting index to: " + brailleHolder.index);
    }
  }
  let charactersLeft = brailleHolder.BrailleText.length - BrailleSetSize;
  let retStr = "";
  if (charactersLeft < 0) {
    console.log("textHolder.GetASetOfBrailleText: Characters Left " + charactersLeft + " is less than the Braille Set Size " + BrailleSetSize);
    retStr = brailleHolder.BrailleText.substring(brailleHolder.index);
    brailleHolder.index = brailleHolder.index + retStr.length;
    while (retStr.length < BrailleSetSize) {
      retStr = retStr.concat('0');
    }
  }
  else {
    console.log("textHolder.GetASetOfBrailleText: Braille set size " + BrailleSetSize + "is less than the amount of Characters Left " + charactersLeft);
    retStr = brailleHolder.BrailleText.substring(brailleHolder.index, brailleHolder.index + BrailleSetSize);
    brailleHolder.index = brailleHolder.index + BrailleSetSize;
  }
  console.log("textHolder.GetASetOfBrailleText: returning " + retStr);
  return retStr;
}
