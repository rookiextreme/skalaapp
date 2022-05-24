import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { Http } from "@angular/http"; // api
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { InfoRingkasPage } from '../info-ringkas/info-ringkas';
import { CatatanKontrakPage } from '../catatan-kontrak/catatan-kontrak';
import { SenaraiGambarPage } from '../senarai-gambar/senarai-gambar';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';


/**
 * Generated class for the ButiranKontrakPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-butiran-kontrak',
  templateUrl: 'butiran-kontrak.html',
})
export class ButiranKontrakPage {
  @ViewChild(Slides) slides: Slides;

  ruj_kontrak: string = '';
  idPengguna: string = '';
  response: any = [];
  kontrak: any = [];
  maklumatasas: any = [];
  pejabat: any = [];
  kerja: any = [];
  kewangan: any = [];
  bayarans: any = [];
  siap: any = [];
  gambar_projek: any = [];
  apiUrl: string = 'http://admin3-skala.jkr.gov.my/myproject-api/api-butiran-kontrak.php';
  kontrak_offline: any = [];
  kontrak_in_storage: any = [];
  offline: boolean = false;
  sliders: any = [];

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage) {
    //this.ruj_kontrak = this.navParams.get('ruj_kontrak');
    let test = false;
    this.ruj_kontrak = (test) ? '7836' : this.navParams.get('ruj_kontrak');//17146 17176
    console.log(this.ruj_kontrak);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ButiranKontrakPage');

    this.storage.get('ic_number').then(ic_number => {
      this.idPengguna = ic_number;
      console.log(this.idPengguna);
      this.getButiranKontrak();
    })

    this.storage.get('kontrak_offline').then(data => {
      if (data != null) {
        this.kontrak_offline = data;
        this.kontrak_in_storage = this.findKontrakInStorage();
        console.log('this.kontrak_in_storage'); console.log(this.kontrak_in_storage);
      }
    });
  }
  ionViewDidEnter() {
    if (this.gambar_projek.length) {
      this.slides.autoplayDisableOnInteraction = false;
      this.slides.startAutoplay();
      console.log('startAutoplay');
      console.log(this.sliders);
    }
  }
  ionViewWillLeave() {
    if (this.gambar_projek.length) {
      this.slides.stopAutoplay();
      console.log('stopAutoplay');
    }

  }

  getButiranKontrak() {

    const loader = this.loadingCtrl.create({
      content: "Sila tunggu...",
      duration: 3000
    });
    loader.present();

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
        this.assignVariables();
        this.populateSliders();


      }, error => {
        this.offline = true;
        this.readFromOffline();
        loader.dismiss();
      });
  }

  assignVariables() {
    this.maklumatasas = this.kontrak.maklumat_asas_kontrak;
    this.pejabat = this.kontrak.pegawai_taggungjawab;
    this.kerja = this.kontrak.maklumat_kerja;
    this.kewangan = this.kontrak.maklumat_kewangan;
    this.gambar_projek = this.kontrak.gambar_projek;
    this.bayarans = this.kontrak.maklumat_bayaran;
    this.siap = this.kontrak.maklumat_siap;
  }

  readFromOffline() {
    this.kontrak = this.kontrak_in_storage[0];
    this.assignVariables();
    this.populateSliders();
  }

  openInfoRingkas() {
    this.navCtrl.setRoot(InfoRingkasPage);
  }

  addToStorage() {
    console.log(this.kontrak);

    console.log('storage get');
    console.log(this.kontrak_offline);
    // find ruj_projek in storage
    console.log(this.ruj_kontrak);
    //let projek_found = this.findProjekInStorage();
    // if not found in storage, save it
    if (this.kontrak_in_storage.length == 0) {
      let kontrakToPush = this.kontrak;
      kontrakToPush.ctime = new Date().toISOString();
      this.kontrak_offline.push(this.kontrak);
      this.storage.set('kontrak_offline', this.kontrak_offline).then(() => { //save to storage
        //this.storage.set('ctime', this.datetime);
        console.log('storage saved');
        this.kontrak_in_storage.push(this.kontrak);
      });
    }
  }

  findKontrakInStorage() {
    console.log('index: ' + this.findIndexByKeyValue(this.kontrak_offline, 'ruj_projek', this.ruj_kontrak));
    let x = this.kontrak_offline.filter((item) => {
      return (item.ruj_kontrak.indexOf(this.ruj_kontrak) > -1);
    });
    return x;
  }

  findIndexByKeyValue(arraytosearch, key, valuetosearch) {

    for (var i = 0; i < arraytosearch.length; i++) {

      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  }

  catatan() {
    this.navCtrl.push(CatatanKontrakPage, { 'ruj_kontrak': this.ruj_kontrak });
  }

  gambar() {
    let dataParam = {
      'ruj_kontrak': this.ruj_kontrak,
      'gambar_projek': this.gambar_projek,
      'maklumatasas': this.maklumatasas,
      'pejabat_seliatapak': this.kontrak.pejabat_seliatapak
    }
    console.log(dataParam);
    this.navCtrl.push(SenaraiGambarPage, dataParam);
  }

  populateSliders() {
    let totalGambar = this.gambar_projek.length;
    let limit = 5;

    if (totalGambar < limit) {
      limit = totalGambar;
    }

    for (let i = 0; i < limit; i++) {
      let slide = { src: this.gambar_projek[i].thumb_src };
      this.sliders.push(slide);
    }


    // if (totalGambar > 0 && totalGambar <= 4) {
    //   for (let i = 0; i < totalGambar; i++) {
    //     let slide = { src : this.gambar_projek[i].src };
    //     this.sliders.push(slide);
    //   }
    // } else {
    //   let start = totalGambar - 5;
    //   let end = totalGambar - 1;
    //   for (let i = start; i < end; i++) {
    //     console.log(i);
    //     let slide = { src : this.gambar_projek[i].src };
    //     this.sliders.push(slide);
    //   }
    // }

    console.log(this.sliders);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.sliders = [];
    this.getButiranKontrak();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
