import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
//import { Http } from "@angular/http"; // api
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { ButiranProjekPage } from '../butiran-projek/butiran-projek';

/**
 * Generated class for the SenaraiProjekPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-senarai-projek',
  templateUrl: 'senarai-projek.html',
})
export class SenaraiProjekPage {
  @ViewChild(Content) content: Content;

  scrollToTop() {
    this.content.scrollToTop();
  }

  //projects: Array<{ tajuk: string, pelanggan: string, pengurus_program: string, kos_semasa: string }>;
  projects: any;
  total: any;
  response: any;
  limit: number = 10;
  totalPage: any;
  prevDisabled: boolean = true;
  nextDisabled: boolean = false;
  currentPage: number = 1;
  carian: string = '';
  offset: number = 0;
  class_title: string = '';
  class_name: string = '';
  idPengguna: string = '';
  role: string = ''; // kpkr, ckub, pakar, negeri
  apiUrl: string = 'http://admin3-skala.jkr.gov.my/myproject-api/api-senarai-projek.php';
  //projectPerPage: number;
  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public loadingCtrl: LoadingController, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SenaraiProjekPage');

    this.storage.get('role').then(data => {
      this.role = data;
      console.log(this.role);
    })
    this.storage.get('ic_number').then(data => {
      this.idPengguna = data;
      console.log(this.idPengguna);
      //this.getInfoRingkas();
      this.getProjects();
    })
  }

  getProjects() {
    /*this.projects = [
      { tajuk: 'Cadangan Bina Jambatan Gantung', pelanggan: 'KEMENTRIAN PENDIDIKAN', pengurus_program: 'CAWANGAN KERJA KESELAMATAN (CKS)', kos_semasa: 'RM 1,209,000.00' },
      { tajuk: 'Cadangan Bina Jambatan Gantung2', pelanggan: 'KEMENTRIAN PENDIDIKAN', pengurus_program: 'CAWANGAN KERJA KESELAMATAN (CKS)', kos_semasa: 'RM 21,209,000.00' }
    ];*/
    const loader = this.loadingCtrl.create({
      content: "Sila Tunggu..",
      duration: 20000
    });
    loader.present();
    console.log('carian: ' + this.carian);
    this.offset = (this.currentPage - 1) * this.limit;
    this.class_name = this.navParams.get('class_name'); console.log(this.class_name);
    //var url = "http://admin3-skala.jkr.gov.my/apiSenaraiProjek.php?id_pengguna=670518035324&class=lamanutama_projek_aktif&limit=" + this.limit + "&offset=" + offset;
    /*
    $ent_projek = array('lamanutama_projek_aktif');
		$ent_subprojek = array('lamanutama_lewat_siap_rekabentuk', 'lamanutama_lewat_sst', 'lamanutama_lewat_serah_pelanggan', 'lamanutama_lewat_iklan');
		$ent_kontrak = array('lamanutama_kontrak_lewat_2_bulan', 'lamanutama_lewat_tt_kontrak', 'lamanutama_kontrak_lewat_tutup_akaun');
		$ent_dplan = array('lamanutama_belum_sah_dplan', 'lamanutama_lewat_siap_rekabentuk_hodt');
    */

    let postData = {
      "id_pengguna": this.idPengguna,
      "class": this.class_name,
      "limit": this.limit,
      "offset": this.offset,
      "search": ''
    };

    if (this.carian != '') {
      //  url = url + "&search=" + this.carian;
      postData.search = this.carian;
    }
    console.log(postData);

    //this.http.get(url)
    this.http.post(this.apiUrl, postData, this.httpOptions)

      .subscribe(data => {
        loader.dismiss();
        console.log(data);
        this.response = data;
        this.class_title = this.response.class_title;
        this.total = this.response.counts;

        var totalRecord = this.total * 1;
        this.totalPage = Math.ceil(totalRecord / this.limit);
        this.projects = this.response.records;
        if (this.currentPage == this.totalPage) {
          this.nextDisabled = true;
        } else {
          this.nextDisabled = false;
        }
      }, error => {
        loader.dismiss();
        alert('Tidak dapat hubungi server.');
      });
  }

  next() {
    if (this.currentPage < this.totalPage) {
      this.currentPage++;

      if (this.currentPage > 1) {
        this.prevDisabled = false;
      }
      this.scrollToTop();
      this.getProjects();
    }
  }

  prev() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.currentPage == 1) {
        this.prevDisabled = true;
      }
    }
    this.scrollToTop();
    this.getProjects();
  }

  reload() {
    console.log('reload!');
    this.scrollToTop();
    this.getProjects();
  }

  paparButiranProjek(project) {
    console.log(project);
    var ruj_projek = project.ruj_projek;
    this.navCtrl.push(ButiranProjekPage, { 'ruj_projek': ruj_projek });
  }

  setCarian(carian) {
    console.log(carian);
    this.offset = 0; // reset to first page
    this.currentPage = 1;
    this.prevDisabled = true;
    this.getProjects();
  }

}
