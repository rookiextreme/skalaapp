import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
//import { Http } from "@angular/http"; // api
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { SenaraiProjekPage } from '../senarai-projek/senarai-projek';

/**
 * Generated class for the InfoRingkasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info-ringkas',
  templateUrl: 'info-ringkas.html',
})
export class InfoRingkasPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage) {
  }

  response: any;
  records: any = [];
  lamanutama_projek_aktif: any = [];
  lamanutama_lewat_siap_rekabentuk: any;
  lamanutama_lewat_sst: any;
  lamanutama_kontrak_lewat_2_bulan: any;
  lamanutama_lewat_serah_pelanggan: any;
  lamanutama_lewat_iklan: any;
  lamanutama_lewat_tt_kontrak: any;
  lamanutama_kontrak_lewat_tutup_akaun: any;
  lamanutama_belum_sah_dplan: any;
  lamanutama_lewat_siap_rekabentuk_hodt: any;
  showLewatSiapRb: boolean = false;
  showLewatSSt: boolean = false;
  showKontrakLewat2Bulan: boolean = false;
  showLewatSerahPelanggan: boolean = false;
  showLewatIklan: boolean = false;
  showLewatTtKontrak: boolean = false;
  showKontrakLewatTutupAkaun: boolean = false;
  showBelumSahDplan: boolean = false;
  showLewatSiapRbHodt: boolean = false;
  datetime: any;
  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };
  private loader: any = this.loadingCtrl.create({
    content: "Sila Tunggu..",
    duration: 20000
  });
  //url: string = 'http://admin3-skala.jkr.gov.my/myproject-api/apiInfoRingkas.php';
  apiUrl: string = 'http://admin3-skala.jkr.gov.my/myproject-api/api-info-ringkas.php'; // POST
  idPengguna: string = '';
  role: string = ''; // kpkr, ckub, pakar, negeri

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoRingkasPage');
    this.datetime = new Date().toISOString(); console.log(this.datetime);

    // get role from storage
    this.storage.get('role').then(data => {
      this.role = data;
      console.log(this.role);
      this.showBoxesBasedOnRoles();
    })
    // get ic_number from storage
    this.storage.get('ic_number').then(data => {
      this.idPengguna = data;
      console.log(this.idPengguna);
      //this.getInfoRingkas();
    })
    // get response (API object) from storage
    this.storage.get('response').then(data => {
      console.log(data);
      if (data !== null) {
        this.response = data;
        console.log(this.response);
        // populate from storage to make fast loading
        this.poulateFromStorage();
      } else {
        // fresh data directly from API
        this.getInfoRingkas();
      }
    })
  }

  // show boxes based on roles
  showBoxesBasedOnRoles() {
    if (this.role == 'kpkr' || this.role == 'sektor_pengurusan' || this.role == 'sektor_bisnes') {

      this.showLewatSiapRb = true;
      this.showLewatSSt = true;
      this.showKontrakLewat2Bulan = true;
      this.showLewatSerahPelanggan = true;
      this.showLewatIklan = true;
      this.showKontrakLewatTutupAkaun = true;
    }
    if (this.role == 'ckub') {
      this.showLewatSSt = true;
      this.showLewatIklan = true;
      this.showLewatTtKontrak = true;
    }
    if (this.role == 'negeri') {
      this.showBelumSahDplan = true;
      this.showLewatSerahPelanggan = true;
      this.showKontrakLewatTutupAkaun = true;
    }
    if (this.role == 'sektor_pakar') {
      this.showLewatSiapRb = true;
      this.showLewatIklan = true;
      this.showBelumSahDplan = true;
    }
  }

  // restore data from storage
  poulateFromStorage() {

    this.assignRecords();

    // after populate from storage, we need to get "fresh" data from api and update to storage & page view
    this.storage.get('ctime').then(data => {
      let ctime = new Date(data);
      let now = new Date(this.datetime);
      let difference = now.getTime() - ctime.getTime(); console.log(now.getTime() + ' - ' + ctime.getTime()); console.log('diff: ' + difference);
      let refreshMin = 15 * 1000 * 60; //15 minutes

      // re-fresh data after 15 minutes
      if (difference > refreshMin) {
        this.redoApiData();
      }

    })

  }

  // refresh the storage & update the counts in html
  redoApiData() {
    console.log('redoApiData');
    let postData = {
      "id_pengguna": this.idPengguna
    };

    //this.http.get(url)
    this.http.post(this.apiUrl, postData, this.httpOptions)

      .subscribe(data => {
        console.log(data);
        this.response = data;
        this.assignRecords();

        this.storage.set('response', data).then(() => { //save to storage
          this.storage.set('ctime', this.datetime);
        });
      }, error => {
        alert('Tidak dapat hubungi server.');
      });
  }

  getInfoRingkas() {

    this.loader.present();

    let postData = {
      "id_pengguna": this.idPengguna
    };

    //this.http.get(url)
    this.http.post(this.apiUrl, postData, this.httpOptions)

      .subscribe(data => {
        this.loader.dismiss();
        console.log(data);
        this.response = data;

        this.storage.set('response', data).then(() => { //save to storage
          this.storage.set('ctime', this.datetime);
        });
        this.assignRecords();
      }, error => {
        this.loader.dismiss();
        alert('Tidak dapat hubungi server.');
      });
  }

  goToSenaraiProjek(class_name) {

    this.navCtrl.push(SenaraiProjekPage, { 'class_name': class_name });
  }

  //assign records to variables
  assignRecords() {
    this.records = this.response.records;
    this.lamanutama_projek_aktif = this.records['lamanutama_projek_aktif'];
    this.lamanutama_lewat_siap_rekabentuk = this.records['lamanutama_lewat_siap_rekabentuk'];
    this.lamanutama_lewat_sst = this.records['lamanutama_lewat_sst'];
    this.lamanutama_kontrak_lewat_2_bulan = this.records['lamanutama_kontrak_lewat_2_bulan'];
    this.lamanutama_lewat_serah_pelanggan = this.records['lamanutama_lewat_serah_pelanggan'];
    this.lamanutama_lewat_iklan = this.records['lamanutama_lewat_iklan'];
    this.lamanutama_lewat_tt_kontrak = this.records['lamanutama_lewat_tt_kontrak'];
    this.lamanutama_kontrak_lewat_tutup_akaun = this.records['lamanutama_kontrak_lewat_tutup_akaun'];
    this.lamanutama_belum_sah_dplan = this.records['lamanutama_belum_sah_dplan'];
    this.lamanutama_lewat_siap_rekabentuk_hodt = this.records['lamanutama_lewat_siap_rekabentuk_hodt'];
  }

  /*redirectBasedOnRole(role) {
    if (role == 'kpkr' || role == 'sektor_pengurusan' || role == 'sektor_bisnes') {
      this.navCtrl.setRoot(DashboardAtasanPage);
    }
    if (role == 'sektor_pakar') {
      this.navCtrl.setRoot(DashboardPakarPage);
    }
    if (role == 'ckub') {
      this.navCtrl.setRoot(DashboardCkubPage);
    }
    if (role == 'negeri') {
      this.navCtrl.setRoot(DashboardNegeriPage);
    }

  }*/

}
