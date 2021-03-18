import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { FIREBASE_CREDENTIALS } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule  } from '@angular/fire';
import {AngularFireMessagingModule} from '@angular/fire/messaging'
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { LayoutService } from './layout/layout.service';
import firebase from 'firebase/app';
/*  import { DeviceDetectorModule } from 'ngx-device-detector'; */
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './loader.interceptor';
import { PresenceService } from './layout/presence.service';
import { AngularFireDatabaseModule } from '@angular/fire/database';
firebase.initializeApp(FIREBASE_CREDENTIALS)
@NgModule({
  declarations: [
    AppComponent,
    //UserAuthorizedPipe,
  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence({synchronizeTabs: false}),
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
    AngularFireAuthModule,
  /*    DeviceDetectorModule.forRoot(), */
    /*  UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120}), */
    AngularFireMessagingModule,
    AuthModule,
    /* StoreModule,
    StoreRouterConnectingModule.forRoot(),
    AdfRouterModule */
 
  ],
  providers: [LayoutService, LoaderService, PresenceService, { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
