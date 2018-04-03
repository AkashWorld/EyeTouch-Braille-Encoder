import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'
import { AndroidPermissions } from '@ionic-native/android-permissions'

import { SpeechUIPage } from './../pages/speechUI/speechUI';
import { MyApp } from './app.component';
import { TestPage } from '../pages/test/test';
import { TextReaderPage } from '../pages/textreader/textreader';
import {BTsetupPage} from '../pages/btsetup/btsetup';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial';
@NgModule({
  declarations: [
    MyApp,
    TestPage,
    BTsetupPage,
    TextReaderPage,
    SpeechUIPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TestPage,
    BTsetupPage,
    TextReaderPage,
    SpeechUIPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
