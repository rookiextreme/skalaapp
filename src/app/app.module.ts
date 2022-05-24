import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
//import { HttpModule } from "@angular/http"; // api
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';


import { LoginPageModule } from './../pages/login/login.module';
import { ButiranProjekPageModule } from '../pages/butiran-projek/butiran-projek.module';
import { CarianPageModule } from '../pages/carian/carian.module';
import { HubungiKamiPageModule } from '../pages/hubungi-kami/hubungi-kami.module';
import { InfoRingkasPageModule } from '../pages/info-ringkas/info-ringkas.module';
import { SenaraiKontrakOfflinePageModule } from '../pages/senarai-kontrak-offline/senarai-kontrak-offline.module';
import { SenaraiProjekOfflinePageModule } from '../pages/senarai-projek-offline/senarai-projek-offline.module';
import { SenaraiProjekPageModule } from '../pages/senarai-projek/senarai-projek.module';
import { ButiranKontrakPageModule } from '../pages/butiran-kontrak/butiran-kontrak.module';
import { CatatanKontrakPageModule } from '../pages/catatan-kontrak/catatan-kontrak.module';
import { TambahCatatanKontrakPageModule } from '../pages/tambah-catatan-kontrak/tambah-catatan-kontrak.module';
import { SenaraiGambarPageModule } from '../pages/senarai-gambar/senarai-gambar.module';
import { MuatNaikGambarPageModule } from '../pages/muat-naik-gambar/muat-naik-gambar.module';
import { PaparGambarPageModule } from '../pages/papar-gambar/papar-gambar.module';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),

    LoginPageModule,
    ButiranProjekPageModule,
    CarianPageModule,
    HubungiKamiPageModule,
    InfoRingkasPageModule,
    SenaraiKontrakOfflinePageModule,
    SenaraiProjekOfflinePageModule,
    SenaraiProjekPageModule,
    ButiranKontrakPageModule,
    CatatanKontrakPageModule,
    TambahCatatanKontrakPageModule,
    SenaraiGambarPageModule,
    MuatNaikGambarPageModule,
    PaparGambarPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    FileTransfer,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
