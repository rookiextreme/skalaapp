import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PaparGambarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-papar-gambar',
  templateUrl: 'papar-gambar.html',
})
export class PaparGambarPage {
  image: any = [];
  images: any = [];
  tajuk_kontrak: string = '';
  curIdx: number = -1;
  prevDisabled: boolean = true;
  nextDisabled: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaparGambarPage');
    this.image = this.navParams.get('image');
    this.images = this.navParams.get('images');
    this.tajuk_kontrak = this.navParams.get('tajuk_kontrak');
    this.getImageIndex();
  }

  getImageIndex() {
    let idx = this.findIndexByKeyValue(this.images, 'gambar_id', this.image.gambar_id);
    this.curIdx = idx;
    console.log(idx);
    this.enabledDisabledbuttons();

    //console.log(this.images);
  }

  findIndexByKeyValue(arraytosearch, key, valuetosearch) {

    for (var i = 0; i < arraytosearch.length; i++) {

      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  }

  next() {
    if ((this.curIdx + 1) < this.images.length) {
      this.curIdx++;

      this.enabledDisabledbuttons();
      this.image = this.images[this.curIdx];
    }
  }

  prev() {
    if (this.curIdx > 0) {
      this.curIdx--;
      this.enabledDisabledbuttons();
    }
    this.image = this.images[this.curIdx];
  }

  enabledDisabledbuttons() {

    if (this.curIdx == 0) {
      this.prevDisabled = true;
    }
    if (this.curIdx > 0) {
      this.prevDisabled = false;
    }
    if ((this.curIdx + 1) == this.images.length) {
      this.nextDisabled = true;
    } else {
      this.nextDisabled = false;
    }
    if ((this.curIdx != 0) && ((this.curIdx + 1) != this.images.length)) {
      this.prevDisabled = false;
    }
  }

}
