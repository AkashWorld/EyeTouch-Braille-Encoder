//Pin connected to ST_CP of 74HC595
int latchPin = 3;
//Pin connected to SH_CP of 74HC595
int clockPin = 4;
////Pin connected to DS of 74HC595
int dataPin = 2;
//MR Pin
int masterRec = 18;

int outputEn = 19;

void setup() {
  //set pins to output because they are addressed in the main loop
  pinMode(latchPin, OUTPUT);
  pinMode(dataPin, OUTPUT);  
  pinMode(clockPin, OUTPUT);
  pinMode(masterRec, OUTPUT);
  pinMode(outputEn, OUTPUT);
  digitalWrite(outputEn , HIGH);
  digitalWrite(masterRec , LOW);
  digitalWrite(outputEn , LOW);
  digitalWrite(masterRec , HIGH);
  Serial.begin(9600);
  Serial.println("reset");

}

void loop() {
  if (Serial.available() > 0) {
  // put your main code here, to run repeatedly:
    // ASCII '0' through '9' characters are
    // represented by the values 48 through 57.
    // so if the user types a number from 0 through 9 in ASCII, 
    // you can subtract 48 to get the actual value:
    int bitToSet = Serial.read() - 48;
    registerWrite(bitToSet, HIGH);
  }
}

// This method sends bits to the shift register:

void registerWrite(int whichPin, int whichState) {
  Serial.println(whichPin);
// the bits you want to send
  byte bitsToSend = 0;
  // turn off the output so the pins don't light up
  // while you're shifting bits:
  digitalWrite(latchPin, LOW);
  // turn on the next highest bit in bitsToSend:
  bitWrite(bitsToSend, whichPin, whichState);
  byte altBitsToSend = 0b11100100;
  Serial.print("Bits to write ");
  printBits(bitsToSend);
  Serial.println("");
  // shift the bits out:
  shiftOut(dataPin, clockPin, LSBFIRST, altBitsToSend);
  // turn on the output so the LEDs can light up:
  digitalWrite(latchPin, HIGH);

}

void printBits(byte myByte){
 for(byte mask = 0x80; mask; mask >>= 1){
   if(mask  & myByte)
       Serial.print('1');
   else
       Serial.print('0');
 }
}
