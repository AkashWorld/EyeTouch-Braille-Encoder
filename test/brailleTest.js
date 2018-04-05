let assert = require('assert');
let Braille = require('../src/assets/js/braille');

describe("Braille Library", function(){
  describe("ReverseString()", function(){
    it('Should reverse the characters in the string.', function(){
      assert.equal(Braille.reverseString('test'),'tset');
      assert.equal(Braille.reverseString('128128128'), '821821821');
      assert.equal(Braille.reverseString('super hero'), 'oreh repus');
      assert.equal(Braille.reverseString(''),'');
    })
  })
  describe("ReverseBrailleEncoding()", function(){
    it('Should reverse the order of triple digit Braille Encodings without reversing the integer itself.', function(){
      assert.equal(Braille.reverseBrailleEncoding('128128128'),'128128128');
      assert.equal(Braille.reverseBrailleEncoding('001002003'), '003002001');
      assert.equal(Braille.reverseBrailleEncoding('128192173173'), '173173192128');
      assert.equal(Braille.reverseBrailleEncoding('12'), null);
    })
  })
  describe("ConvertStringToBraille()", function(){
    it('Should convert an ASCII string to its Braille Encodings', function(){
      assert.equal(Braille.convertStringToBraille('aaaa'),'128128128128');
      assert.equal(Braille.convertStringToBraille('AA'), '004128004128');
      assert.equal(Braille.convertStringToBraille(''), null);
    })
  })
})
