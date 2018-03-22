/* Include the software serial port library */
#include <SoftwareSerial.h>
/* to communicate with the Bluetooth module's TXD pin */
#define BT_SERIAL_TX 2
/* to communicate with the Bluetooth module's RXD pin */
#define BT_SERIAL_RX 3
/* Initialise the software serial port */
SoftwareSerial BluetoothSerial(BT_SERIAL_TX, BT_SERIAL_RX);
/*Buffer to keep characters recieved from bluetooth */
char buffer[] = {' ',' ',' '};
int bufferCount = 0;

void setup() {
  // put your setup code here, to run once:
/* Set the baud rate for the hardware serial port */
Serial.begin(9600);
/* Set the baud rate for the software serial port */
BluetoothSerial.begin(9600);
/* Should respond with OK */
BluetoothSerial.print("AT");
waitForResponse();
Serial.println("Bluetooth is recieving...:");
BluetoothSerial.begin(9600);
}

// Function to pass BlueTooth output through to serial port output
void waitForResponse() {
delay(1000);
while (BluetoothSerial.available()) {
Serial.write(BluetoothSerial.read());
}
Serial.write("\n");
}

void loop() {
  while (BluetoothSerial.available()) {
    char recvChar = BluetoothSerial.read();
    buffer[bufferCount] = recvChar;
    bufferCount++;
  }

  if(bufferCount >= 3){
    bufferCount = 0;
    int byteToSet = atoi(buffer);
    Serial.print("Byte recieved "); Serial.println(byteToSet);
    Serial.print("Binary form "); printBits(byteToSet); Serial.println("");
  }
}


void printBits(byte myByte){
 for(byte mask = 0x80; mask; mask >>= 1){
   if(mask  & myByte)
       Serial.print('1');
   else
       Serial.print('0');
 }
}
