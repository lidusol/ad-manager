import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule  } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging'
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import firebase from 'firebase/app';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { LayoutService } from './layout/layout.service';
import { LoaderInterceptor } from './loader.interceptor';
import { PresenceService } from './layout/presence.service';
import { FIREBASE_CREDENTIALS } from '../environments/environment';
import { AuthModule } from './auth/auth.module';
import { LoaderService } from './services/loader.service';
import { AuthInterceptor } from './auth/auth.interceptor';
/*  import { DeviceDetectorModule } from 'ngx-device-detector'; */

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    /* StoreModule,
    StoreRouterConnectingModule.forRoot(),
    AdfRouterModule */
 
  ],
  providers: [LayoutService, LoaderService, PresenceService, { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }, {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
