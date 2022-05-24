import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { InfoRingkasPage } from '../pages/info-ringkas/info-ringkas';
import { SenaraiProjekPage } from '../pages/senarai-projek/senarai-projek';
import { CarianPage } from '../pages/carian/carian';
import { SenaraiProjekOfflinePage } from '../pages/senarai-projek-offline/senarai-projek-offline';
import { SenaraiKontrakOfflinePage } from '../pages/senarai-kontrak-offline/senarai-kontrak-offline';
import { HubungiKamiPage } from '../pages/hubungi-kami/hubungi-kami';
import { ButiranKontrakPage } from '../pages/butiran-kontrak/butiran-kontrak';
import { MuatNaikGambarPage } from '../pages/muat-naik-gambar/muat-naik-gambar';
import { ButiranProjekPage } from '../pages/butiran-projek/butiran-projek';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  // array "pages" declaration Array( variables: types )
  pages: Array<{ title: string, component: any, icon: string, parameter: any }>;
  nama: string = '';
  photo_url: string = '';
  dept: string = '';

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, public events: Events) {
    this.initializeApp();
    events.subscribe('user:logged_in', (user, time) => {
      this.initializeUser();
    });
    this.pages = [
      { title: 'Info Ringkas', component: InfoRingkasPage, icon: 'apps', parameter: {} },
      { title: 'Senarai Projek', component: SenaraiProjekPage, icon: 'list', parameter: { "class_name": "lamanutama_projek_aktif" } },
      { title: 'Carian', component: CarianPage, icon: 'search', parameter: {} },
      { title: 'Senarai Projek Offline', component: SenaraiProjekOfflinePage, icon: 'easel', parameter: {} },
      { title: 'Senarai Kontrak Offline', component: SenaraiKontrakOfflinePage, icon: 'contract', parameter: {} },
      { title: 'Hubungi Kami', component: HubungiKamiPage, icon: 'call', parameter: {} }
    ];
  }
  initializeUser() {
    // get nama from storage
    this.storage.get('name').then(data => {
      this.nama = data;
      console.log(this.nama);
    })
    // get photo_url from storage
    this.storage.get('photo_url').then(data => {
      this.photo_url = data;
      console.log(this.photo_url);
      //this.getInfoRingkas();
    })
    // get dept from storage
    this.storage.get('dept').then(data => {
      this.dept = data;
      console.log(this.dept);
      //this.getInfoRingkas();
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('initialize');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initializeUser();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, page.parameter);
  }

  logout() {

    this.storage.get('remember_me').then(data => {
      let remember_me = data;
      if (remember_me) {
        this.storage.clear().then(clear => {
          this.nav.setRoot(LoginPage);
        });

      }
    })
  }
}
