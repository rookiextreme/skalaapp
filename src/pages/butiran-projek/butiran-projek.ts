import { ButiranKontrakPage } from './../butiran-kontrak/butiran-kontrak';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { Http } from "@angular/http"; // api
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { InfoRingkasPage } from '../info-ringkas/info-ringkas';


/**
 * Generated class for the ButiranProjekPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-butiran-projek',
  templateUrl: 'butiran-projek.html',
})
export class ButiranProjekPage {

  ruj_projek: string;
  idPengguna: string = '';
  response: any = [];
  project: any = [];
  strategi: any = [];
  butiran: any = [];
  aktiviti: any = [];
  apiUrl: string = 'http://admin3-skala.jkr.gov.my/myproject-api/api-butiran-projek.php';
  projek_offline: any = [];
  projek_in_storage: any = [];
  offline: boolean = false;
  phases: any = [];

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage) {
    //this.ruj_projek = this.navParams.get('ruj_projek');
    let test = false;
    this.ruj_projek = (test) ? '24334' : this.navParams.get('ruj_projek');
    this.storage.get('ic_number').then(data => {
      this.idPengguna = data;
      console.log(this.idPengguna);
      this.getButiranProject();
    });
    console.log(this.ruj_projek);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ButiranProjekPage');

    this.storage.get('projek_offline').then(data => {
      if (data != null) {
        this.projek_offline = data;
        this.projek_in_storage = this.findProjekInStorage();
        console.log('this.projek_in_storage'); console.log(this.projek_in_storage);
      }
    });
  }

  readFromOffline() {
    this.project = this.projek_in_storage[0];
    this.assignVariables();
  }

  getButiranProject() {

    const loader = this.loadingCtrl.create({
      content: "Sila tunggu...",
      duration: 3000
    });
    loader.present();

    let postData = {
      "id_pengguna": this.idPengguna,
      "ruj_projek": this.ruj_projek
    };
    console.log(postData);

    //this.http.get(url)
    this.http.post(this.apiUrl, postData, this.httpOptions)
      //function to fetch project detail from API

      .subscribe(data => {
        console.log(data);
        this.response = data;
        this.project = this.response.records;
        this.assignVariables();

        var tajuk = this.butiran.tajuk;
        console.log(tajuk);
      }, error => {
        this.offline = true;
        this.readFromOffline();
        loader.dismiss();
      });
  }

  assignVariables() {
    this.strategi = this.project.strategi_perlaksanaan;
    this.butiran = this.project.butiran_projek;
    this.aktiviti = this.project.jadual_aktiviti;
    this.phases = this.aktiviti.fasa; console.log(this.phases);
  }

  openInfoRingkas() {
    this.navCtrl.setRoot(InfoRingkasPage);
  }

  addToStorage() {
    console.log(this.project);

    console.log('storage get');
    console.log(this.projek_offline);
    // find ruj_projek in storage
    console.log(this.ruj_projek);
    //let projek_found = this.findProjekInStorage();
    // if not found in storage, save it
    if (this.projek_in_storage.length == 0) {
      let projekToPush = this.project;
      projekToPush.ctime = new Date().toISOString();
      this.projek_offline.push(this.project);
      this.storage.set('projek_offline', this.projek_offline).then(() => { //save to storage
        //this.storage.set('ctime', this.datetime);
        console.log('storage saved');
        this.projek_in_storage.push(this.project);
      });
    }
  }

  findProjekInStorage() {
    console.log('index: ' + this.findIndexByKeyValue(this.projek_offline, 'ruj_projek', this.ruj_projek));
    let x = this.projek_offline.filter((item) => {
      return (item.ruj_projek.indexOf(this.ruj_projek) > -1);
    });
    return x;
  }

  paparButiranKontrak(project) {
    this.navCtrl.push(ButiranKontrakPage, { 'ruj_kontrak': project.ruj_kontrak });
  }

  findIndexByKeyValue(arraytosearch, key, valuetosearch) {

    for (var i = 0; i < arraytosearch.length; i++) {

      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  }

}
