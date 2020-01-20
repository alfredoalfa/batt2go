import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { Geolocation } from '@ionic-native/geolocation/ngx';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { EmailComposer } from '@ionic-native/email-composer/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule,    
    ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,    
    QRScanner,
    InAppBrowser,                 
    EmailComposer,      
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
