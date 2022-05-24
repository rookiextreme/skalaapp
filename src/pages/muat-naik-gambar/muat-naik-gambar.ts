import { CatatanKontrakPage } from './../catatan-kontrak/catatan-kontrak';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the MuatNaikGambarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-muat-naik-gambar',
  templateUrl: 'muat-naik-gambar.html',
})
export class MuatNaikGambarPage {
  idPengguna: string = '';
  ptm: boolean = false;
  dept_id: string = '';
  foto: string;
  album: any = [];
  fotoBeingUpload: string;
  successUpload: number = 0;
  photoFileNames: any = [];
  ruj_kontrak: string = '';
  catatan: string = '';
  has_error: boolean = false;
  images: any = [];

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera, private transfer: FileTransfer, private file: File, private http: HttpClient, private loadingCtrl: LoadingController, private storage: Storage, private toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.storage.get('dept_id').then(dept_id => {
      this.dept_id = dept_id;
    })
    this.storage.get('ptm').then(ptm => {
      this.ptm = ptm;
    })
    // get ic_number from storage
    this.storage.get('ic_number').then(data => {
      this.idPengguna = data;
      console.log(this.idPengguna);
      //this.getInfoRingkas();
    });

    let test = false;
    this.ruj_kontrak = (test) ? '17176' : this.navParams.get('ruj_kontrak');
    this.images = this.navParams.get('images');
    console.log(this.ruj_kontrak);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MuatNaikGambarPage');
  }

  galeri() {
    console.log('buka photo galeri');

    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then((imageData) => {
      this.foto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {

    });
  }

  singkirFoto() {
    this.foto = null;
  }

  simpan() {
    let dataGambar = {
      "imageFile": this.foto,
      "catatan": this.catatan
    };
    this.album.push(dataGambar);
    //reset buffer gambar dan catatan
    this.singkirFoto();
    this.catatan = '';
  }

  kamera() {

    console.log('buka photo kamera');

    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.foto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {

    });
  }

  muatNaikSecaraPukal() {
    if (this.album) {
      if (this.album.length != 0) {
        for (let i = 0; i < this.album.length; i++) {
          this.fotoBeingUpload = this.album[i].imageFile;
          let desc = this.album[i].catatan;
          this.muatNaikIndividu(desc);
        }
      }
    }
  }

  muatNaikIndividu(desc) {
    let createdAt = new Date().getTime();
    let namaFail = this.ruj_kontrak + '_' + createdAt + '.jpg';
    // alert(namaFail);

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: namaFail,
      chunkedMode: false, // hantar partially sikit-sikit
      httpMethod: 'post',
      mimeType: 'image/JPEG',
      headers: {}
    };

    // let url = "http://api.favotechsystem.com/jkr/myproject/upload_photo.php";
    let url = "http://admin3-skala.jkr.gov.my/myproject-api/mobile_upload_photo.php";

    const loader = this.loadingCtrl.create({
      content: "Muat naik... sila tunggu",
      duration: 15000
    });

    fileTransfer.upload(this.fotoBeingUpload, url, options)
      .then((data) => {
        this.successUpload++;
        this.uploadFileName(namaFail, desc);
        loader.dismissAll();
        // toast success message if all images has been successfully uploaded
        if (this.successUpload == this.album.length) {
          // const toast = this.toastCtrl.create({

          //   message: 'Muat naik berjaya',
          //   duration: 3000
          // });
          // toast.present();
          // // clear album image to avoid double send by user.
          // this.album = [];
          // // add photo file name into its array... so it can be uploaded to database later on
          // this.photoFileNames.push({ nama: namaFail, tarikh: new Date() });
          // // this.uploadFileName();
          // this.storage.set('gambar_baru', 'true').then(() => {
          //   this.navCtrl.pop();
          // });
          this.storage.set('new_gambar_added', true).then(() => {
            this.presentToast('Gambar Berjaya Dimuatnaik', true);
          });
        }
      }, (err) => {
        //alert(err);
        //console.log(err);
        this.has_error = true;
      })
  }

  uploadFileName(namaFail, desc) {
    let url = "http://admin3-skala.jkr.gov.my/myproject-api/api-create-maklumatgambar.php";

    let postData = {
      "id_pengguna": this.idPengguna,
      "ruj_kontrak": this.ruj_kontrak,
      "filename": namaFail,
      "description": desc
    };

    //this.http.get(url)
    this.http.post(url, postData, this.httpOptions)

      .subscribe(data => {
        console.log(data);
      }, error => {
        alert('Tidak dapat hubungi server.');
      });
  }

  hapusGambar(idx) {
    let alert = this.alertCtrl.create({
      title: 'Sah Padam',
      message: 'Adakah anda pasti untuk memadam gambar ini?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ya, Padam',
          handler: () => {
            this.album.splice(idx, 1);
          }
        }
      ]
    });
    alert.present();

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

}
