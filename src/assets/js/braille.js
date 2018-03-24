import { concat } from "rxjs/operator/concat";

export let BrailleMap = new Map();
    BrailleMap.set('a', 128)
    BrailleMap.set('b', 192)
    BrailleMap.set('c', 136)
    BrailleMap.set('d', 140)
    BrailleMap.set('e', 216)
    BrailleMap.set('f', 200)
    BrailleMap.set('g', 204)
    BrailleMap.set('h', 196)
    BrailleMap.set('i', 72)
    BrailleMap.set('j', 88)
    BrailleMap.set('k', 160)
    BrailleMap.set('l', 224)
    BrailleMap.set('m', 176)
    BrailleMap.set('n', 184)
    BrailleMap.set('o', 168)
    BrailleMap.set('p', 240)
    BrailleMap.set('q', 248)
    BrailleMap.set('r', 232)
    BrailleMap.set('s', 112)
    BrailleMap.set('t', 120)
    BrailleMap.set('u', 164)
    BrailleMap.set('v', 228)
    BrailleMap.set('w', 92)
    BrailleMap.set('x', 180)
    BrailleMap.set('y', 188)
    BrailleMap.set('z', 172)
    BrailleMap.set('CAP', 4)
    BrailleMap.set('!', 104)
    BrailleMap.set('\'', 32)
    BrailleMap.set(',',64);
    BrailleMap.set('-',36);
    BrailleMap.set('.',76);
    BrailleMap.set('?',100);
    BrailleMap.set('#',60);
    BrailleMap.set('0',88);
    BrailleMap.set('1',128);
    BrailleMap.set('2',192);
    BrailleMap.set('3',144);
    BrailleMap.set('4',152);
    BrailleMap.set('5',136);
    BrailleMap.set('6',208);
    BrailleMap.set('7',216);
    BrailleMap.set('8',200);
    BrailleMap.set('9',80);
    BrailleMap.set(' ', 0);


  //Helper function to convert decimal to it's binary representation
  //for verification
  export function DecimalToBinary(decimal) {
        let bin = Number(decimal).toString(2);
        return bin;
  }

  export function BinaryToBrailleConsole(input){
    let binary = DecimalToBinary(number)
    let bin_digits = [];
    let retStrArr = [];
    let strBin = binary.toString();
    for(let i = 0, len = strBin.length; i < len; i++){
        bin_digits.push(+strBin.charAt(i));
    }
    for(let i = 0; i < 3; i++){
        let bindots = ""
        if(bin_digits[i] == 1){
            bindots += "•"
        }
        else{
            bindots += " "
        }
        if(bin_digits[i + 3] == 1){
            bindots += "•"
        }
        else{
            bindots += " "
        }
        retStrArr.push(bindots)
        console.log(bindots)
    }
    return retStrArr
  }


  export function printBraille(){
      //Iterate and verify the valeus in the Braille Encoder Map
    for(let[key, value] of BrailleMap){
       let bin = DecimalToBinary(value);
       console.log("Key: " + key + " Decimal: " + value + " Binary: " + bin);
       BinaryToBrailleConsole(bin)
    }
  }

  export function GetKeysFromMap(map){
    return Array.from(map.keys());
  }

/**
 * Converts the input number 'key' to a string of length three, padding
 * with zeros if nessesary
 * @param {*} key Number from 0 to 255
 */
  export function ConvertKeyToPaddedString(key){
    if(!Number.isInteger(key)){
      console.log("Key " +key+" is not an integer.")
      return;
    }
    if(key > 255 || key < 0){
      console.log("Key is out of range scope.")
      return;
    }
    var retStr = key.toString();
    while(retStr.length < 3){
      retStr = "0".concat(retStr)
    }
    console.log("Key converted to: " + retStr)
    return retStr;


  }


  export function reverseString(str) {
    let array = str.split("");
    array.reverse();
    str = array.join('');
    return str;
   }

   //Main method to convert string to braille
   export function convertStringToBraille(inputString){
     if(!inputString || typeof(inputString) != "string"){
       console.log("Input is not a string or undefined.")
     }
    let BrailleStr = ""; /*Final return output with the braille encodings*/
    let currToken = ""; /*Current token/word being worked on inside the main look*/
    for(let i = 0; i < inputString.length; i++){ /*Main parsing loop*/
      currChar = inputString.charAt(i);
      if(currChar != " "){/** If the current character is a letter/punctuation */
        let brailleChars = GetBrailleEncoding(currChar);
        if(!brailleChar){
          currToken = currToken.concat(brailleChars);
        }
        else{
          console.log("Could not receive Braille mapping for " + currChar);
        }
      }
      else if(currChar == " " || i == (inputString.length - 1)){ /**If end of string is reached or a space is encountered*/
        /** Append the current token to the BrailleStr, and empty the token. */
        BrailleStr.concat(currToken);
        currToken = "";
      }
    }
    console.log("Final braille string is: \n" + BrailleStr);
    return BrailleStr;
   }

   /**
    * This method translates characters to it's appropriate Braille encoding.
    * @param {A single character input (String)} inputChar
    */
   function GetBrailleEncoding(inputChar){
    if(!inputChar || typeof(inputChar) != 'string' || inputChar.length != 1){
      console.log("Input Character is not a type of String.");
      return;
    }
    let RetBrailleStr = "";
    if(!isNaN(inputChar*1)){/**Check if character is a number */
      RetBrailleStr.concat(BrailleMap.get('#'));
      RetBrailleStr.concat(BrailleMap.get(inputChar));

    }
    else{/**Character is a letter */
      if(inputChar == inputChar.toUpperCase){
        RetBrailleStr.concat(BrailleMap.get('CAP'));
        RetBrailleStr.concat(BrailleMap.get(inputChar));
      }
      else{
        RetBrailleStr.concat(BrailleMap.get(inputChar));
      }
    }
    return RetBrailleStr;
   }





