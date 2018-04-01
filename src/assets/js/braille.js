import { concat } from "rxjs/operator/concat";

export let BrailleMap = new Map();
    BrailleMap.set('a', '128')
    BrailleMap.set('b', '192')
    BrailleMap.set('c', '136')
    BrailleMap.set('d', '140')
    BrailleMap.set('e', '216')
    BrailleMap.set('f', '200')
    BrailleMap.set('g', '204')
    BrailleMap.set('h', '196')
    BrailleMap.set('i', '072')
    BrailleMap.set('j', '088')
    BrailleMap.set('k', '160')
    BrailleMap.set('l', '224')
    BrailleMap.set('m', '176')
    BrailleMap.set('n', '184')
    BrailleMap.set('o', '168')
    BrailleMap.set('p', '240')
    BrailleMap.set('q', '248')
    BrailleMap.set('r', '232')
    BrailleMap.set('s', '112')
    BrailleMap.set('t', '120')
    BrailleMap.set('u', '164')
    BrailleMap.set('v', '228')
    BrailleMap.set('w', '092')
    BrailleMap.set('x', '180')
    BrailleMap.set('y', '188')
    BrailleMap.set('z', '172')
    BrailleMap.set('CAP', '004')
    BrailleMap.set('!', '104')
    BrailleMap.set('\'', '032')
    BrailleMap.set(',','064');
    BrailleMap.set('-','036');
    BrailleMap.set('.','076');
    BrailleMap.set('?','100');
    BrailleMap.set('#','060');
    BrailleMap.set('0','088');
    BrailleMap.set('1','128');
    BrailleMap.set('2','192');
    BrailleMap.set('3','144');
    BrailleMap.set('4','152');
    BrailleMap.set('5','136');
    BrailleMap.set('6','208');
    BrailleMap.set('7','216');
    BrailleMap.set('8','200');
    BrailleMap.set('9','080');
    BrailleMap.set(' ', '000');




  export function GetBrailleValueFromKey(key){
    let val = BrailleMap.get(key);
    while(val.length < 3){
      val = val.concat('0');
    }
    return val;
  }

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




  export function reverseString(str) {
    let array = str.split("");
    array.reverse();
    str = array.join('');
    return str;
   }



   export function reverseBrailleEncoding(BrailleEncStr){
      if(!BrailleEncStr || typeof(BrailleEncStr) != 'string' ||
      BrailleEncStr.length % 3 != 0){
        console.log("Invalid input for reverseBrailleEncoding. Input is either not a string or the length is not a factor of 3.");
        console.log("Braille String Length % 3 = " + (BrailleEncStr.length % 3));
        console.log("Type of Braille String: " + typeof(BrailleEncStr));
        return null;
      }
      let retStr = "";
      for(let i = BrailleEncStr.length; i >= 0; i = i - 3){
        let EndINdex = i; let StartIndex = i - 3;
        retStr += BrailleEncStr.substring(StartIndex, EndINdex);
      }
      return retStr;
   }



   /**
    * Main method to convert string to braille.
    * @export
    * @param {string} inputString
    * @returns a string with Braille Encodings
    */
   export function convertStringToBraille(inputString){
     if(!inputString || typeof(inputString) != "string"){
       console.log("Input is not a string or undefined.")
       return null;
     }
    console.log("braille.ConvertStringToBraille input: " + inputString);
    let BrailleStr = ""; /*Final return output with the braille encodings*/
    let currToken = "";
    for(let i = 0; i < inputString.length; i++){ /*Main parsing loop*/
      let currChar = inputString.charAt(i);
      let brailleChar = GetBrailleEncoding(currChar);
      if(!brailleChar){ //no encoding received
        console.log("braille.convertStringToBraille: no encoding found, retreving encoding for ' '.");
        brailleChar = GetBrailleEncoding(" ");
      }
      currToken = currToken.concat(brailleChar);
      //if a space is encountered (meaning a new work has begun) or the end of the string is reached
      if(currChar == " " || inputString.length - 1 == i){
        BrailleStr = BrailleStr.concat(currToken);
        currToken = "";
      }
    }
    console.log("braille.convertStringToBraille: final braille string is: \n" + BrailleStr);
    return BrailleStr;
   }

   /**
    * This method translates characters to it's appropriate Braille encoding.
    * @param {A single character input (String)} inputChar
    */
   function GetBrailleEncoding(inputChar){
    if(!inputChar || typeof(inputChar) != 'string' || inputChar.length != 1){
      console.log("braille.GetBrailleEncoding: Input Character is not a type of String.");
      return;
    }
    console.log("braille.GetBrailleEncoding: Attempting to find encoding for: " + inputChar);
    let RetBrailleStr = "";
    if(!isNaN(inputChar*1)){/**Check if character is a number */
      RetBrailleStr = RetBrailleStr.concat(GetBrailleValueFromKey('#'));
      RetBrailleStr = RetBrailleStr.concat(GetBrailleValueFromKey(inputChar));
      console.log("braille.GetBrailleEncoding: Found a number.");
    }
    else{/**Character is a letter */
      if(inputChar == inputChar.toUpperCase()){
        RetBrailleStr = RetBrailleStr.concat(GetBrailleValueFromKey('CAP'));
        RetBrailleStr = RetBrailleStr.concat(GetBrailleValueFromKey(inputChar.toLowerCase()));
        console.log("braille.GetBrailleEncoding: Found a capital letter.");
      }
      else{
        RetBrailleStr = RetBrailleStr.concat(GetBrailleValueFromKey(inputChar));
        console.log("braille.GetBrailleEncoding: Found a letter.");
      }
    }
    console.log("braille.GetBrailleEncoding: Returning " + RetBrailleStr);
    return RetBrailleStr;
   }





