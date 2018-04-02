/*
 * Author: Khalid Akash
 */

/*Reference for design can be found:
 * https://www.arduino.cc/en/Tutorial/ShiftOut
 */
/* Include the software serial port library */
#include <SoftwareSerial.h>
/* to communicate with the Bluetooth module's TXD pin */
#define BT_SERIAL_TX 2
/* to communicate with the Bluetooth module's RXD pin */
#define BT_SERIAL_RX 3
/* Initialise the software serial port */
SoftwareSerial BluetoothSerial(BT_SERIAL_TX, BT_SERIAL_RX);
/*Buffer to keep characters recieved from bluetooth */
char buffer1[] = {' ',' ',' ','\0'};
int bufferCount1 = 0;
char buffer2[] = {' ',' ',' ','\0'};
int bufferCount2 = 0;
char buffer3[] = {' ',' ',' ','\0'};
int bufferCount3 = 0;
char buffer4[] = {' ',' ',' ','\0'};
int bufferCount4 = 0;

//Pin connected to ST_CP of 74HC595
int latchPin = 12;
//Pin connected to SH_CP of 74HC595
int clockPin = 13;
////Pin connected to DS of 74HC595
int dataPin = 11;
//Master Reclear Pin
int masterRec = 14;
//Output Enable pin
int outputEn = 15;
//forward request button
int forwardButton = 4;
int prevForwardState = LOW;
//backward request button
int backButton = 5;
int prevBackState = LOW;
void setup() {
  // put your setup code here, to run once:
  /* Set the baud rate for the hardware serial port */
  Serial.begin(9600);
  /* Set the baud rate for the software serial port */
  BluetoothSerial.begin(9600);  
  /* Should respond with OK */
  BluetoothSerial.print("AT");
  waitForResponse();
  Serial.println("Bluetooth is recieving...");

  /*Set up register pins*/
  //set pins to output because they are addressed in the main loop
  pinMode(forwardButton, INPUT);
  pinMode(backButton, INPUT);
  pinMode(latchPin, OUTPUT);
  pinMode(dataPin, OUTPUT); 
  pinMode(clockPin, OUTPUT);
  pinMode(masterRec, OUTPUT);
  pinMode(outputEn, OUTPUT);
  //Reset output upon start up
  digitalWrite(outputEn , HIGH);
  digitalWrite(masterRec , LOW);
  //flip above
  digitalWrite(outputEn , LOW);
  digitalWrite(masterRec , HIGH);

  
}



void loop() {
  int forwardState = digitalRead(forwardButton);
  if(forwardState ==  HIGH && prevForwardState == LOW){
    Serial.println("Forward button pressed!");
    prevForwardState = HIGH;
    BluetoothSerial.write("f\n");
    delay(50);
  }
  else if(forwardState == LOW && prevForwardState == HIGH){
    prevForwardState = LOW;
    delay(50);
  }
  int backState = digitalRead(backButton);
  if(backState ==  HIGH && prevBackState == LOW){
    Serial.println("Back button pressed!");
    prevForwardState = HIGH;
    BluetoothSerial.write("b\n");
    delay(50);
  }
  else if(backState == LOW && prevBackState == HIGH){
    prevForwardState = LOW;
    delay(50);
  }
  
  while (BluetoothSerial.available()) {
    char recvChar = BluetoothSerial.read();
    Serial.print(recvChar);
    if(bufferCount1 < 3){
      buffer1[bufferCount1] = recvChar;
      bufferCount1++;
    }
    else if(bufferCount2 < 3){
      buffer2[bufferCount2] = recvChar;
      bufferCount2++;
    }
    else if(bufferCount3 < 3){
      buffer3[bufferCount3] = recvChar;
      bufferCount3++;
    }
    else if(bufferCount4 < 3){
      buffer4[bufferCount4] = recvChar; 
      bufferCount4++;
    }
  }

  if(bufferCount1 == 3 && bufferCount2 == 3 && bufferCount3 == 3 
    &&  bufferCount4 == 3){
    bufferCount1 = 0; bufferCount2 = 0; bufferCount3 = 0; bufferCount4 = 0;
    int byteToSet1 = atoi(buffer1);
    int byteToSet2 = atoi(buffer2);
    int byteToSet3 = atoi(buffer3);
    int byteToSet4 = atoi(buffer4);
    Serial.println();
    printBits(byteToSet1);printBits(byteToSet2);printBits(byteToSet3);printBits(byteToSet4);
    digitalWrite(latchPin, LOW);
    registerWriteByte(byteToSet1);
    registerWriteByte(byteToSet2);
    registerWriteByte(byteToSet3);
    registerWriteByte(byteToSet4);
    digitalWrite(latchPin, HIGH);
    Serial.println();
  }
}

//This method writes the int (single byte value, example 255 = 0b11111111)
//to shift register
void registerWriteByte(int bytetowrite){
    shiftOut(dataPin, clockPin, LSBFIRST, bytetowrite);
}


// Function to pass BlueTooth output through to serial port output
void waitForResponse() {
delay(1000);
while (BluetoothSerial.available()) {
Serial.write(BluetoothSerial.read());
}
Serial.write("\n");
}


void printBits(byte myByte){
 for(byte mask = 0x80; mask; mask >>= 1){
   if(mask  & myByte)
       Serial.print('1');
   else
       Serial.print('0');
 }
 Serial.println();
}
