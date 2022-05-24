import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
//import { Http } from "@angular/http"; // api
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { ButiranKontrakPage } from '../butiran-kontrak/butiran-kontrak';

/**
 * Generated class for the SenaraiKontrakOfflinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-senarai-kontrak-offline',
  templateUrl: 'senarai-kontrak-offline.html',
})
export class SenaraiKontrakOfflinePage {
  kontrak_offline: any;
  offline_data: any;
  filteredKontraks: any;
  total: any;
  limit: number = 10;
  totalPage: any;
  prevDisabled: boolean = true;
  nextDisabled: boolean = false;
  currentPage: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage) {
    this.getKontrakOffline();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SenaraiKontrakOfflinePage');
  }

  getKontrakOffline() {
    this.storage.get('kontrak_offline').then(data => {
      console.log(data);
      if (data != null) {

        this.kontrak_offline = data;
        this.offline_data = data; // not msnipulated by ngModel, onchange and so on..
        this.total = this.kontrak_offline.length;
        console.log(this.kontrak_offline);
      }
    })
  }

  paparButiranKontrak(kontrak) {
    console.log(kontrak);
    var ruj_kontrak = kontrak.ruj_kontrak;
    this.navCtrl.push(ButiranKontrakPage, { 'ruj_kontrak': ruj_kontrak });
  }

  getItems(ev: any) {
    console.log(this.offline_data);
    // Reset items back to all of the items
    this.filteredKontraks = this.offline_data;

    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log('val: ' + val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      let x = this.filteredKontraks.filter((item) => {
        return (item.maklumat_asas_kontrak.tajuk.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }); console.log('haha');
      this.total = x.length;
      this.kontrak_offline = x;
    } else { // backspace untill clear...
      this.total = this.offline_data.length;
      this.kontrak_offline = this.offline_data;
    }
  }

  onCancel(ev: any) {
    // Reset items back to all of the items
    this.total = this.offline_data.length;
    this.kontrak_offline = this.offline_data;
  }

}
