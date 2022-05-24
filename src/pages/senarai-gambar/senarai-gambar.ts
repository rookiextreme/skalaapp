import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaparGambarPage } from '../papar-gambar/papar-gambar';
import { MuatNaikGambarPage } from '../muat-naik-gambar/muat-naik-gambar';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the SenaraiGambarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-senarai-gambar',
  templateUrl: 'senarai-gambar.html',
})
export class SenaraiGambarPage {

  images: any = [];
  ruj_kontrak: string = '';
  dept_id: string = '';
  idPengguna: string = '';
  pejabat_seliatapak: string = '';
  ptm: boolean = false;
  maklumatasas: any = [];
  showNoResult: boolean = false;
  response: any = [];
  records: any = [];

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage) {
    //this.images = this.navParams.get('gambar_projek'); console.log(this.images);
    this.ruj_kontrak = this.navParams.get('ruj_kontrak'); console.log(this.ruj_kontrak);
    this.maklumatasas = this.navParams.get('maklumatasas'); console.log(this.maklumatasas);
    this.pejabat_seliatapak = this.navParams.get('pejabat_seliatapak');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SenaraiGambarPage');
    this.storage.get('dept_id').then(dept_id => {
      this.dept_id = dept_id;
    })
    this.storage.get('ptm').then(ptm => {
      this.ptm = ptm;
    })
    this.storage.get('ic_number').then(ic_number => {
      this.idPengguna = ic_number;
      console.log(this.idPengguna);
      this.getGambarProjek();
    })
  }

  ionViewWillEnter() {
    console.log('ionViewDidEnter SenaraiGambarPage');
    this.storage.get('new_gambar_added').then(data => {
      if (data) {
        console.log('will enter');
        this.getGambarProjek();
        this.storage.set('new_gambar_added', false)
      }
    })
  }

  paparGambar(image) {

    let dataParam = {
      'image': image,
      'images': this.images,
      'tajuk_kontrak': this.records.tajuk
    }
    this.navCtrl.push(PaparGambarPage, dataParam);
  }

  tambahGambar() {

    let dataParam = {
      'ruj_kontrak': this.ruj_kontrak,
      'images': this.images
    };
    this.navCtrl.push(MuatNaikGambarPage, dataParam);
  }

  getGambarProjek() {
    //function to fetch catatan kontrak detail from API
    const loader = this.loadingCtrl.create({
      content: "Sila tunggu...",
      duration: 2000
    });
    //loader.present();
    let url = "http://admin3-skala.jkr.gov.my/myproject-api/api-senarai-gambar.php";
    let postData = {
      "id_pengguna": this.idPengguna,
      "ruj_kontrak": this.ruj_kontrak
    };
    console.log(postData);

    //this.http.get(url)
    this.http.post(url, postData, this.httpOptions)

      .subscribe(data => {

        console.log(data);
        this.response = data;

        this.records = this.response.records;
        this.images = this.records.gambar_projek;
        console.log(this.records);
        console.log(this.images.length);
        if (this.images.length == 0) {
          this.showNoResult = true;
        } else {
          this.showNoResult = false;
        }
      });

  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getGambarProjek();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
