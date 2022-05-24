import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { TambahCatatanKontrakPage } from './../tambah-catatan-kontrak/tambah-catatan-kontrak';

/**
 * Generated class for the CatatanKontrakPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-catatan-kontrak',
  templateUrl: 'catatan-kontrak.html',
})
export class CatatanKontrakPage {
  ruj_kontrak: string;
  idPengguna: string = '';
  dept_id: string = '';
  ptm: boolean = false;
  response: any = [];
  kontrak: any = [];
  catatans: any = [];
  apiUrl: string = 'http://admin3-skala.jkr.gov.my/myproject-api/api-catatan-kontrak.php';
  showNoResult: boolean = false;

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage) {
    //this.ruj_kontrak = this.navParams.get('ruj_kontrak');
    let test = false;
    this.ruj_kontrak = (test) ? '17126' : this.navParams.get('ruj_kontrak');
    console.log(this.ruj_kontrak);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CatatanKontrakPage');
    this.storage.get('dept_id').then(dept_id => {
      this.dept_id = dept_id;
    })
    this.storage.get('ptm').then(ptm => {
      this.ptm = ptm;
    })
    this.storage.get('ic_number').then(ic_number => {
      this.idPengguna = ic_number;
      console.log(this.idPengguna);
      this.getCatatanKontrak();
    })
  }

  //ionViewDidEnter() {
  ionViewWillEnter() {
    console.log('ionViewDidEnter CatatanKontrakPage');
    // to AVOID HttpErrorResponse in Console
    // because this ionViewDidEnter will be executed even before ionViewDidLoad finish
    // if (this.idPengguna != '') {
    //   this.getCatatanKontrak();
    // }
    this.storage.get('new_catatan_added').then(data => {
      if (data) {
        console.log('will enter');
        this.getCatatanKontrak();
        this.storage.set('new_catatan_added', false)
      }
    })
  }

  getCatatanKontrak() {
    //function to fetch catatan kontrak detail from API
    const loader = this.loadingCtrl.create({
      content: "Sila tunggu...",
      duration: 2000
    });
    //loader.present();

    let postData = {
      "id_pengguna": this.idPengguna,
      "ruj_kontrak": this.ruj_kontrak
    };
    console.log(postData);

    //this.http.get(url)
    this.http.post(this.apiUrl, postData, this.httpOptions)

      .subscribe(data => {

        console.log(data);
        this.response = data;

        this.kontrak = this.response.records;
        this.catatans = this.kontrak.kontrak_catatan;
        console.log(this.kontrak);
        console.log(this.catatans.length);
        if (this.catatans.length == 0) {
          this.showNoResult = true;
        } else {
          this.showNoResult = false;
        }
      });

  }

  openAddCatatan() {
    this.navCtrl.push(TambahCatatanKontrakPage, { 'ruj_kontrak': this.ruj_kontrak });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getCatatanKontrak();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
