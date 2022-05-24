import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { CatatanKontrakPage } from '../catatan-kontrak/catatan-kontrak';

/**
 * Generated class for the TambahCatatanKontrakPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tambah-catatan-kontrak',
  templateUrl: 'tambah-catatan-kontrak.html',
})
export class TambahCatatanKontrakPage {
  ruj_kontrak: string;
  tarikh: string = '';
  catatan: string = '';
  idPengguna: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.ruj_kontrak = this.navParams.get('ruj_kontrak');
    console.log(this.ruj_kontrak);

    this.storage.get('ic_number').then(ic_number => {
      this.idPengguna = ic_number;
      console.log(this.idPengguna);

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TambahCatatanKontrakPage');
  }

  validateCatatan() {
    console.log('this.catatan: ' + this.catatan)
    if ((this.tarikh == "") || (this.catatan == "")) {
      this.showAlertRalat('Sila isi tarikh dan catatan!');
    } else {
      this.tambahCatatan();
    }
  }
  tambahCatatan() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };

    let postData = {
      "id_pengguna": this.idPengguna,
      "ruj_kontrak": this.ruj_kontrak,
      "t_catatan": this.tarikh,
      "catatan": this.catatan
    };
    console.log(postData);

    let url = "http://admin3-skala.jkr.gov.my/myproject-api/api-create-catatankontrak.php";

    const loader = this.loadingCtrl.create({
      content: "Sila Tunggu...",
      duration: 3000
    });
    loader.present();

    this.http.post(url, postData, httpOptions)
      .subscribe(data => {
        console.log(data['records'].status);
        if (data['records'].status == 'success') {
          this.storage.set('new_catatan_added', true).then(() => {
            this.presentToast('Data Berjaya disimpan', true);
          });

        } else {
          this.presentToast('Data Gagal disimpan', false);
        }


        console.log(data);
        loader.dismiss();
      }, error => {
        this.presentToast(error);
      })
  }

  presentToast(msg, success = true) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      cssClass: 'toast'
    });
    toast.present().then(() => {
      if (success) {
        this.navCtrl.pop(); // redirect to prev page
        //this.navCtrl.push(CatatanKontrakPage, { 'ruj_kontrak': this.ruj_kontrak });
      }
    });
  }

  showAlertRalat(msg) {
    const alert = this.alertCtrl.create({
      title: 'Ralat!',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }
}
