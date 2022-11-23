import { ThisMonthExpression } from 'igniteui-angular-core';

import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';

import { SvgPoint } from '../interface/svg-point';

@Component({
  selector: 'app-svg-view',
  templateUrl: './svg-view.component.html',
  styleUrls: ['./svg-view.component.scss']
})
// export class SvgViewComponent implements OnInit, AfterViewInit, AfterViewChecked {
export class SvgViewComponent implements OnInit, AfterViewInit {

  screenwidth: any;
  screenheight: any;
  imageurl = "";
  targetsvgtag: any;
  buttonbasetag: any;
  realimgwidth: any;
  realimgheight: any;
  browthertateyokorasio: number;   
  svgtateyokorasio: number;
  on_point1: boolean;
  on_point2: boolean;
  on_point3: boolean;
  classpoint1: SvgPoint = {   // 実画像サイズでのポイント1情報
    point_x : 0,
    point_y : 0,
    point_z : 0,
  };
  classpoint2: SvgPoint = {   // 実画像サイズでのポイント2情報
    point_x : 0,
    point_y : 0,
    point_z : 0,
  };
  classpoint3: SvgPoint = {   // 実画像サイズでのポイント3情報
    point_x : 0,
    point_y : 0,
    point_z : 0,
  };
  cross1point: any;
  cross2point: any;
  cross3point: any;
  moji1point: any;
  moji2point: any;
  moji3point: any;

  private _el: HTMLElement;

  constructor(el: ElementRef) {
    this._el = el.nativeElement;
   }

  /**
   *  最初の一度だけ実行
   */
   ngOnInit(): void {
    this.on_point1 = false;
    this.on_point2 = false;
    this.on_point3 = false;

    this.imageurl = "/assets/dxf_file/out.svg" 
    console.log(this.classpoint1);
  };

  /**
   *  最初の一度だけ実行
   */
  ngAfterViewInit() {
    // SVGファイルの全体が常に１画面に表示されるよう表示サイズ調整する

    // SVGファイルの実サイズ取得
    this.targetsvgtag = this._el.getElementsByClassName('targetsvg');
    this.buttonbasetag = this._el.getElementsByClassName('btnbase');
    console.log(this.targetsvgtag);
    this.realimgwidth = this.targetsvgtag[0].width;
    this.realimgheight = this.targetsvgtag[0].height;
    console.log("svgwidth: "+this.realimgwidth+ " svgheight: "+this.realimgheight);

    // ブラウザ画面のサイズ取得
    this.screenwidth = window.innerWidth;
    this.screenheight = window.innerHeight;

    // 画面とSVGファイルそれぞれの縦横比算出
    this.browthertateyokorasio = this.screenwidth / this.screenheight;   
    this.svgtateyokorasio = this.realimgwidth / this.realimgheight;  

    if (this.browthertateyokorasio > 1.0 ) {  // 横長ブラウザ
      if (this.svgtateyokorasio > this.browthertateyokorasio) { // 画像の方が横長度が高い
        this.buttonbasetag[0].style.width = "99%";
        this.buttonbasetag[0].style.height = "auto";
        this.targetsvgtag[0].style.width = "99%";
        this.targetsvgtag[0].style.height = "auto";
      } else {
        this.buttonbasetag[0].style.width = "auto";
        this.buttonbasetag[0].style.height = "99%";
        this.targetsvgtag[0].style.width = "auto";
        this.targetsvgtag[0].style.height = "99%";
      }
    } else {  // 縦長ブラウザ
      if (this.svgtateyokorasio > this.browthertateyokorasio) {
        this.buttonbasetag[0].style.width = "auto";
        this.buttonbasetag[0].style.height = "99%";
        this.targetsvgtag[0].style.width = "auto";
        this.targetsvgtag[0].style.height = "99%";
      } else { // 画像の方が横長度が高い
        this.buttonbasetag[0].style.width = "99%";
        this.buttonbasetag[0].style.height = "auto";
        this.targetsvgtag[0].style.width = "99%";
        this.targetsvgtag[0].style.height = "auto";
      }
    }
    // 基準点タグ,文字列それぞれのエレメント情報をあらかじめ保存
    this.cross1point = this._el.getElementsByClassName('cross1');
    this.cross2point = this._el.getElementsByClassName('cross2');
    this.cross3point = this._el.getElementsByClassName('cross3');
    this.moji1point = this._el.getElementsByClassName('p1disp');
    this.moji2point = this._el.getElementsByClassName('p2disp');
    this.moji3point = this._el.getElementsByClassName('p3disp');
  }

  /**
   * SVGファイル表示エリア内でのクリックイベント時の処理
   */
  @HostListener('mousedown', ['$event'])  
  onMouseDown(event) {
    console.log("mouse down event")
    if(event.target.className == "targetsvg") {
      console.log("svg natural width: "+event.target.naturalWidth+" height: "+event.target.naturalHeight);
      console.log("inbrowther width: "+this.screenwidth+" height: "+this.screenheight);
      console.log("svg display width: "+event.target.width + " height: "+event.target.height);
      console.log("event parent width: "+this._el.clientWidth + " hight: "+this._el.clientHeight);
      console.log("click! at x:"+event.clientX+" y:"+event.clientY);

      console.log("SVGデータの位置情報等 x: "+event.target.x+" y: "+event.target.y);

      // ブラウザ内左上とSVG画像左上のオフセット算出準備
      var svgx: number = event.target.x;  // SVG画像左上 x座標
      var svgy: number = event.target.y;  // SVG画像左上 y座標
      var titleheight: number = 56;  // タイトルバーの高さ56ピクセルは固定
      var inbrowserwidth: number = this.screenwidth;  // ブラウザ描画領域の幅
      var svgwidth: number = event.target.width       // SVG画像の幅

      // SVG画像の拡大縮小率
      var svgdispratio = event.target.width / event.target.naturalWidth;

      // 設定目的ポイントを割り出し、SVGポイントクラスにセット
      if (this.on_point1 && !this.on_point2 && !this.on_point3) {         // Point1
        this.classpoint1.point_x = (event.clientX-svgx) / svgdispratio;
        this.classpoint1.point_y = (event.clientY-svgy) / svgdispratio;
        this.classpoint1.point_z = 0;
        console.log("set point1 x:"+this.classpoint1.point_x +" y:"+this.classpoint1.point_y +" z:"+this.classpoint1.point_z);
        const tops: number = Math.trunc(this.classpoint1.point_y * svgdispratio) + svgy;
        const lefts: number = Math.trunc(this.classpoint1.point_x * svgdispratio) + svgx - 10;  // 10 はバッテンマークの幅/2
        console.log("top: "+tops+ "px svgy:"+svgy);
        console.log("left: "+lefts+ "px svgx:"+svgx);
        this.cross1point[0].style.top = tops.toString() + "px";
        this.cross1point[0].style.left = lefts.toString() + "px";
        this.cross1point[0].style.display = "inline-block";
        this.moji1point[0].style.top = (tops + 10).toString() + "px";
        this.moji1point[0].style.left = (lefts + 10).toString() + "px";
        this.moji1point[0].style.display = "inline-block";
      } else if(!this.on_point1 && this.on_point2 && !this.on_point3) {   // Point2
        this.classpoint2.point_x = (event.clientX-svgx) / svgdispratio;
        this.classpoint2.point_y = (event.clientY-svgy) / svgdispratio;
        this.classpoint2.point_z = 0;
        console.log("set point2 x:"+this.classpoint2.point_x +" y:"+this.classpoint2.point_y +" z:"+this.classpoint2.point_z);
        const tops: number = Math.trunc(this.classpoint2.point_y * svgdispratio) + svgy;
        const lefts: number = Math.trunc(this.classpoint2.point_x * svgdispratio) + svgx - 10;  // 10 はバッテンマークの幅/2
        console.log("top: "+tops+ "px svgy:"+svgy);
        console.log("left: "+lefts+ "px svgx:"+svgx);
        this.cross2point[0].style.top = tops.toString() + "px";
        this.cross2point[0].style.left = lefts.toString() + "px";
        this.cross2point[0].style.display = "inline-block";
        this.moji2point[0].style.top = (tops + 10).toString() + "px";
        this.moji2point[0].style.left = (lefts + 10).toString() + "px";
        this.moji2point[0].style.display = "inline-block";
      } else if(!this.on_point1 && !this.on_point2 && this.on_point3) {   // Point3
        this.classpoint3.point_x = (event.clientX-svgx) / svgdispratio;
        this.classpoint3.point_y = (event.clientY-svgy) / svgdispratio;
        this.classpoint3.point_z = 0;
        console.log("set point3 x:"+this.classpoint3.point_x +" y:"+this.classpoint3.point_y +" z:"+this.classpoint3.point_z);
        const tops: number = Math.trunc(this.classpoint3.point_y * svgdispratio) + svgy;
        const lefts: number = Math.trunc(this.classpoint3.point_x * svgdispratio) + svgx - 10;  // 10 はバッテンマークの幅/2
        console.log("top: "+tops+ "px svgy:"+svgy);
        console.log("left: "+lefts+ "px svgx:"+svgx);
        this.cross3point[0].style.top = tops.toString() + "px";
        this.cross3point[0].style.left = lefts.toString() + "px";
        this.cross3point[0].style.display = "inline-block";
        this.moji3point[0].style.top = (tops + 10).toString() + "px";
        this.moji3point[0].style.left = (lefts + 10).toString() + "px";
        this.moji3point[0].style.display = "inline-block";
      } else {       // どれもちがう
        console.log("push only");
        console.log("get point1 x:"+this.classpoint1.point_x +" y:"+this.classpoint1.point_y +" z:"+this.classpoint1.point_z);
        console.log("get point2 x:"+this.classpoint2.point_x +" y:"+this.classpoint2.point_y +" z:"+this.classpoint2.point_z);
        console.log("get point3 x:"+this.classpoint3.point_x +" y:"+this.classpoint3.point_y +" z:"+this.classpoint3.point_z);
      }
    }
  }

  @HostListener('window:blur', ['$event'])
  onWindowBlur() {
    console.log("Blur");
  }

  /**
   * ブラウザのサイズ変更イベント時の処理（SVGファイル表示が画面に収まるようサイズ調整）
   */
   @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenwidth = window.innerWidth;
    this.screenheight = window.innerHeight - 56;  // タイトル部分(56pic)
    console.log("width: "+this.screenwidth+ " height: "+this.screenheight);
    this.realimgwidth = this.targetsvgtag[0].width;
    this.realimgheight = this.targetsvgtag[0].height;
    console.log("svgwidth: "+this.realimgwidth+ " svgheight: "+this.realimgheight);

    // ブラウザ画面の縦横比により
    this.browthertateyokorasio = this.screenwidth / this.screenheight;   
    this.svgtateyokorasio = this.realimgwidth / this.realimgheight;
    console.log("browser rasio: "+this.browthertateyokorasio + " svgratio: "+this.svgtateyokorasio);

    if (this.browthertateyokorasio > 1.0 ) {  // 横長ブラウザ
      if (this.svgtateyokorasio > this.browthertateyokorasio) { // 画像の方が横長度が高い
        this.buttonbasetag[0].style.width = "99%";
        this.buttonbasetag[0].style.height = "auto";
        this.targetsvgtag[0].style.width = "99%";
        this.targetsvgtag[0].style.height = "auto";
      } else {
        this.buttonbasetag[0].style.width = "auto";
        this.buttonbasetag[0].style.height = "99%";
        this.targetsvgtag[0].style.width = "auto";
        this.targetsvgtag[0].style.height = "99%";
      }
    } else {  // 縦長ブラウザ
      if (this.svgtateyokorasio > this.browthertateyokorasio) {
        this.buttonbasetag[0].style.width = "auto";
        this.buttonbasetag[0].style.height = "99%";
        this.targetsvgtag[0].style.width = "auto";
        this.targetsvgtag[0].style.height = "99%";
      } else { // 画像の方が横長度が高い
        this.buttonbasetag[0].style.width = "99%";
        this.buttonbasetag[0].style.height = "auto";
        this.targetsvgtag[0].style.width = "99%";
        this.targetsvgtag[0].style.height = "auto";

      }
    }
  }

  /**
   * P1セットボタン押下時の処理
   */
  onclickbtn1() {
    console.log("btn1 click!");
    this.on_point1 = !this.on_point1;
    this.on_point2 = false;
    this.on_point3 = false;
    console.log(this.on_point1);
  }; 

  /**
   * P2セットボタン押下時の処理
   */
   onclickbtn2() {
    this.on_point1 = false;
    this.on_point2 = !this.on_point2;
    this.on_point3 = false;
  }; 

  /**
   * P3セットボタン押下時の処理
   */
   onclickbtn3() {
    this.on_point1 = false;
    this.on_point2 = false;
    this.on_point3 = !this.on_point3;
  }; 

}
