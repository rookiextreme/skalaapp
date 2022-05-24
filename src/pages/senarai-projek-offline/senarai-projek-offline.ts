import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
//import { Http } from "@angular/http"; // api
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { ButiranProjekPage } from '../butiran-projek/butiran-projek';

/**
 * Generated class for the SenaraiProjekOfflinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-senarai-projek-offline',
  templateUrl: 'senarai-projek-offline.html',
})
export class SenaraiProjekOfflinePage {
  projek_offline: any;
  offline_data: any;
  filteredProjects: any;
  total: any;
  limit: number = 10;
  totalPage: any;
  prevDisabled: boolean = true;
  nextDisabled: boolean = false;
  currentPage: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage) {
    this.getProjectsOffline();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SenaraiProjekOfflinePage');
  }

  getProjectsOffline() {
    this.storage.get('projek_offline').then(data => {
      if (data != null) {
        this.projek_offline = data;
        this.offline_data = data; // not msnipulated by ngModel, onchange and so on..
        this.total = this.projek_offline.length;
        console.log(this.projek_offline);
      }
    })
  }

  paparButiranProjek(project) {
    console.log(project);
    var ruj_projek = project.ruj_projek;
    this.navCtrl.push(ButiranProjekPage, { 'ruj_projek': ruj_projek });
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.filteredProjects = this.offline_data;

    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log('val: ' + val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      let x = this.filteredProjects.filter((item) => {
        return (item.butiran_projek.tajuk.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }); console.log('haha');
      this.total = x.length;
      this.projek_offline = x;
    } else { // backspace untill clear...
      this.total = this.offline_data.length;
      this.projek_offline = this.offline_data;
    }
  }

  onCancel(ev: any) {
    // Reset items back to all of the items
    this.total = this.offline_data.length;
    this.projek_offline = this.offline_data;
  }

}
