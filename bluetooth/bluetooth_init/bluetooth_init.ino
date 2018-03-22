/* Include the software serial port library */
#include <SoftwareSerial.h>
/* to communicate with the Bluetooth module's TXD pin */
#define BT_SERIAL_TX 2
/* to communicate with the Bluetooth module's RXD pin */
#define BT_SERIAL_RX 3
/* Initialise the software serial port */
SoftwareSerial BluetoothSerial(BT_SERIAL_TX, BT_SERIAL_RX);

void setup() {
  // put your setup code here, to run once:
/* Set the baud rate for the hardware serial port */
Serial.begin(9600);
/* Set the baud rate for the software serial port */
BluetoothSerial.begin(9600);
delay(1000);

// Should respond with OK
BluetoothSerial.print("AT");
waitForResponse();

// Should respond with its version
BluetoothSerial.print("AT+VERSION");
waitForResponse();

// Set pin to 1234
BluetoothSerial.print("AT+PIN1234");
waitForResponse();

// Set the name to BRAILLE
BluetoothSerial.print("AT+NAMEBRAILLE");
waitForResponse();

// Set baudrate from 9600 (default)
BluetoothSerial.print("AT+BAUD4");
waitForResponse();


Serial.println("Finished!");
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

 

}
