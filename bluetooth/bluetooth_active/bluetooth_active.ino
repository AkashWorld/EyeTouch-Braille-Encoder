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
  while (BluetoothSerial.available()) {
    char recvChar = BluetoothSerial.read();
    Serial.print("Recieve Char: "); Serial.println(recvChar);
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
    digitalWrite(latchPin, LOW);
    registerWriteByte(byteToSet1);
    registerWriteByte(byteToSet2);
    registerWriteByte(byteToSet3);
    registerWriteByte(byteToSet4);
    digitalWrite(latchPin, HIGH);
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
}
