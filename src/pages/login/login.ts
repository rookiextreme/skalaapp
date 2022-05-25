import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { InfoRingkasPage } from '../info-ringkas/info-ringkas';
// to force reload app.html
import { Events } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // declare class properties (variables)
  errorMessageIc: string = '';
  errorMessagePwd: string = '';
  errorMessage: string = '';
  noKadPengenalan: string = '';
  kataLaluan: string = '';
  countError: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage, public alertCtrl: AlertController, public events: Events) {
    this.checkRememberMe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    // test debug
    this.storage.get('name').then(data => {
      let x = data;
      console.log(x);
    })
  }

  checkRememberMe() {
    this.storage.get('remember_me').then(data => {
      let remember_me = data;
      if (remember_me == true) {
        this.navCtrl.setRoot(InfoRingkasPage);
      }
    })
  }
  // check login
  checkLogin() {
    console.log('checkLogin');
    let error = false;
    if (this.noKadPengenalan == "") {
      this.errorMessageIc = "Sila masukkan No. Kad Pengenalan";
      error = true;
    } else if (this.noKadPengenalan.length != 12) {
      console.log(this.noKadPengenalan.length);
      this.errorMessageIc = "No. Kad Pengenalan tidak sah";
      error = true;
    } else {
      this.errorMessageIc = "";
    }

    if (this.kataLaluan == "") {
      var noPwd = 'Sila masukkan Kata Laluan';
      this.errorMessagePwd = noPwd;
      error = true;
    } else if (this.kataLaluan.length < 8) {
      console.log(this.kataLaluan.length);
      this.errorMessagePwd = "Panjang kata laluan tidak sah";
      error = true;
    }

    if (error) {
      this.errorMessage = 'Harap Maaf. ID dan kata laluan yang anda masukkan tidak sah. Sila cuba sekali lagi.';
    } else {
      this.errorMessage = '';
    }

    // if no error at this level, hantar login data ke API
    if (this.errorMessage == "") {

      this.tryLogin();
    }

  }

  tryLogin() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };

    let postData = {
      "ic_number": this.noKadPengenalan,
      "password": this.kataLaluan
    };

    //let url = "http://admin3-skala.jkr.gov.my/~teras/skala/web/www/api_login_dev.php";
    //let url = "http://admin3-skala.jkr.gov.my/~teras/skala/web/www/api-login-v2.php";
    let url = "http://admin3-skala.jkr.gov.my/myproject-api/api-login-v2.php";

    const loader = this.loadingCtrl.create({
      content: "Sila Tunggu...",
      duration: 3000
    });
    loader.present();

    this.http.post(url, postData, httpOptions)
      .subscribe(data => {
        let ic_number = data['ic_number'];
        let status = data['status'];
        let dept = data['dept'];
        let name = data['name'];
        let photo_url = data['photo_url'];
        let msg = data['msg'];
        let dept_id = data['dept_id'];
        let ptm = data['ptm'];
        let role = data['role'];

        if (status == 'pass') {
          this.storage.set('ic_number', ic_number);
          this.storage.set('status', status);
          this.storage.set('dept', dept);
          this.storage.set('name', name);
          this.storage.set('photo_url', photo_url);
          this.storage.set('msg', msg);
          this.storage.set('dept_id', dept_id);
          this.storage.set('ptm', ptm);
          this.storage.set('remember_me', true);
          this.storage.set('role', role).then(() => { // **1
            // force app.html to refresh
            this.events.publish('user:logged_in', ic_number, Date.now());

            //redirect
            this.navCtrl.setRoot(InfoRingkasPage);
            loader.dismiss();
          });
          /*
          * **1:
          * to make sure storage, store all input, set then() to the last storage.set
          * javascript will process every save (set) in 1 second, but will jump to next process without waiting to complete
          * */

        } else {
          //this.errorMessagePwd = "Kombinasi nama pengguna dan kata laluan tidak sah";
          this.countError++;
          this.showAlertRalat();
        }

        console.log(data);
      }, error => {
        console.log(error);
      })
  }

  showAlertRalat() {
    const alert = this.alertCtrl.create({
      title: 'Ralat!',
      subTitle: 'Kombinasi id pengguna dan kata laluan tidak sah',
      buttons: ['OK']
    });
    alert.present();
    if (this.countError > 3) {
      this.errorMessage = "Sila hubungi helpdesk JKR utk bantuan.";
    }
  }

}
