let textHolder = require('../src/assets/js/textHolder');
let assert = require('assert');
let brailleHolder = new textHolder.TextHolder();

describe("TextHolder", function(){
  describe("#Set/Get BrailleText()", function(){
    it("Should Set Braille Text in the object", function(){
      brailleHolder.SetBrailleText("aaaabbbb");
      assert.equal(brailleHolder.GetBrailleText(), '128128128128192192192192');
      assert.equal(brailleHolder.GetIndex(), 0);
      })
  })
  describe("#Move forwards()", function(){
    it("Should move the Braille Encoded Text forward", function(){
      assert.equal(brailleHolder.GetIndex(),0);
      assert.equal(brailleHolder.GetASetOfBrailleText(true,0),'128128128128');
      assert.equal(brailleHolder.GetASetOfBrailleText(true,1), '128128128192');
      assert.equal(brailleHolder.GetASetOfBrailleText(true,1), '128128192192');
      assert.equal(brailleHolder.GetASetOfBrailleText(true,1), '128192192192');
      assert.equal(brailleHolder.GetASetOfBrailleText(true,1), '192192192192');
      assert.equal(brailleHolder.GetASetOfBrailleText(true,1), '192192192000');
      assert.equal(brailleHolder.GetASetOfBrailleText(true,1), '192192000000');
      assert.equal(brailleHolder.GetASetOfBrailleText(true,1),'192000000000');
      assert.equal(brailleHolder.GetASetOfBrailleText(true,1), '000000000000');
    })
  })
  describe("#Move backwards()", function(){
    it("Should move the Braille Encoded Text forward", function(){
      assert.equal(brailleHolder.GetIndex(),24);
      assert.equal(brailleHolder.GetASetOfBrailleText(false,0),'000000000000');
      assert.equal(brailleHolder.GetASetOfBrailleText(false,1), '192000000000');
      assert.equal(brailleHolder.GetASetOfBrailleText(false,1), '192192000000');
      assert.equal(brailleHolder.GetASetOfBrailleText(false,1), '192192192000');
      assert.equal(brailleHolder.GetASetOfBrailleText(false,1), '192192192192');
      assert.equal(brailleHolder.GetASetOfBrailleText(false,1), '128192192192');
      assert.equal(brailleHolder.GetASetOfBrailleText(false,1), '128128192192');
      assert.equal(brailleHolder.GetASetOfBrailleText(false,1),'128128128192');
      assert.equal(brailleHolder.GetASetOfBrailleText(false,1), '128128128128');
      assert.equal(brailleHolder.GetASetOfBrailleText(false,1), '128128128128');
    })
  })
})
