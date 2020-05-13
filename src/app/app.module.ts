
/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AgmCoreModule } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { SetlocationComponent } from './setlocation/setlocation.component';
import { AgmDirectionModule } from 'agm-direction';
import { EditlocationnComponent } from './editlocationn/editlocationn.component';
import { HttpClientModule , HttpClient} from '@angular/common/http';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { Camera } from '@ionic-native/camera/ngx';
import { StorageService } from './filestorage.service';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FirestoreService } from './firestore.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';



@NgModule({
  declarations: [
    AppComponent,
    PaymentPageComponent,
    SetlocationComponent,
    EditlocationnComponent
  ],
  entryComponents: [
    PaymentPageComponent,
    SetlocationComponent,
    EditlocationnComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    HttpClientModule,
    AngularFireStorageModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBwIrcA9xj5NPfGiE4AcfcFUD1E4O_mtto',
      libraries: ['places', 'geometry']
    }),
    ReactiveFormsModule,
    AgmDirectionModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    AngularFireDatabaseModule
  ],
  providers: [
    Camera,
    StorageService,
    HttpClient,
    StatusBar,
    Geolocation,
    SplashScreen,
    FirestoreService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
