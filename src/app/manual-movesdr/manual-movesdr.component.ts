import {
  IDragBaseEventArgs,
  IDragMoveEventArgs,
  IgxSliderComponent,
  IgxSliderType,
  ISliderValueChangeEventArgs
} from 'igniteui-angular';
import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ManualService} from "../Manual.Service";
import {error} from "protractor";

@Component({
  selector: 'app-manual-movesdr',
  templateUrl: './manual-movesdr.component.html',
  styleUrls: ['./manual-movesdr.component.scss']
})
export class ManualMovesdrComponent implements OnInit, AfterViewInit {

  @ViewChild('bCircle', {static: true}) public boundCircle: ElementRef;

  @ViewChild("moveSpeedSlider") public moveSpeedSlider : IgxSliderComponent;
  @ViewChild("rotSpeedSlider") public rotSpeedSlider : IgxSliderComponent;
  @ViewChild("reflectorSpeedSlider") public reflectorSilder : IgxSliderComponent;

  screenwidth: any;
  screenheight: any;
  dragmoveelement: any;
  boundingelement: any;
  animationDuration = 0.3;

  manualstartX = 0;   // ドラッグ最初のx座標
  manualstarty = 0;   // ドラッグ最初のy座標
  // sliderType = IgxSliderType;

  // volumeL = 50;
  // volumeH = 50;
  rippleColor = 'grey';

  private _el: HTMLElement;

  constructor(private manualMove: ManualService, el: ElementRef) {
    this._el = el.nativeElement;
  }

  public startX: any;
  public startY: any;

  ngOnInit(): void {
    console.log("Init Module");
  }

  /**
   *  最初の一度だけ実行
   */
  ngAfterViewInit() {

    this.moveSpeedSlider.value = 0;

    // ドラッグ関連エレメント取得
    this.dragmoveelement = this._el.getElementsByClassName('movecircle');
    this.boundingelement = this._el.getElementsByClassName('boundingcircle');

    // ブラウザ画面のサイズ取得
    this.screenwidth = window.innerWidth;
    this.screenheight = window.innerHeight;

    // if (this.screenheight > this.screenwidth) { // 縦長
    //   this.boundingelement[0].style.width = Math.trunc(this.screenwidth * 0.7).toString() + "px";
    //   this.boundingelement[0].style.height = Math.trunc(this.screenwidth * 0.7).toString() + "px";
    //   this.dragmoveelement[0].style.width = Math.trunc(this.screenwidth * 0.4).toString() + "px";
    //   this.dragmoveelement[0].style.height = Math.trunc(this.screenwidth * 0.4).toString() + "px";
    //   this.dragmoveelement[0].style.lineHeight = Math.trunc(this.screenwidth * 0.4).toString() + "px"
    // } else {
    //   this.boundingelement[0].style.width = Math.trunc(this.screenheight * 0.7).toString() + "px";
    //   this.boundingelement[0].style.height = Math.trunc(this.screenheight * 0.7).toString() + "px";
    //   this.dragmoveelement[0].style.width = Math.trunc(this.screenheight * 0.4).toString() + "px";
    //   this.dragmoveelement[0].style.height = Math.trunc(this.screenheight * 0.4).toString() + "px";
    //   this.dragmoveelement[0].style.lineHeight = Math.trunc(this.screenheight * 0.4).toString() + "px"
    //
    // }

    var rect = this.boundCircle.nativeElement.getBoundingClientRect();
    // this.boundCircle.nativeElement.style.top+="100pc";
    this.startX = rect.x;
    this.startY = rect.y;


  }

  /**
   * クリックイベント時の処理
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    console.log("mouse down event");
    console.log(event);

    let rotValue = 0;

    if (event.target.id == "leftturnbtn") {
      console.log("left turn button click.");
      rotValue = 1;
    }
    else if(event.target.id == "rightturnbtn"){
      console.log("right turn button click.");
      rotValue = -1;
    }

    const obs = {
      next:(x:any)=>{console.log("next obs")},
      error:(err:Error)=>{
        console.log("err : "+err);
        console.log(err.message)
      },
      complete:()=>{console.log("comp")}
    };

    this.manualMove.moveRotWheel(rotValue).subscribe(obs);  // 回転の通知

    console.log("Todo roboto is rotation move!!")

  }


  onDragStart(event: IDragBaseEventArgs) {
    console.log("DragStart");
    console.log(event);
    this.manualstartX = event.startX;
    this.manualstarty = event.startY;
    // Sets specific class when dragging.
    // event.owner.data.dragged = true;
  }

  onDragEnd(event: IDragBaseEventArgs) {
    console.log("DragEnd");
    console.log(event);
    console.log("saved Start x: " + this.manualstartX + " y:" + this.manualstarty);

    const obs = {
      next:(x:any)=>{console.log("next obs")},
      error:(err:Error)=>{
        console.log("err : "+err);
        console.log(err.message)
        },
      complete:()=>{console.log("comp")}
    };

    this.manualMove.moveWeelStop().subscribe(obs); // 台車を停止させる

    // ここにロボット停止命令（サービス経由になると思われる）をセットする
    console.log("Todo ROBOT STOP!!")

    // Otherwise animate it to its original position, since it is unchanged.
    event.owner.transitionToOrigin({duration: this.animationDuration});
  }

  onDragMove(event: IDragMoveEventArgs) {
    console.log("DragMove...");
    console.log("start base x: " + event.startX + " y: " + event.startY);
    console.log("from x: " + event.pageX + " y: " + event.pageY);
    console.log("to x: " + event.nextPageX + " y: " + event.nextPageY);

    let rect = this.boundCircle.nativeElement.getBoundingClientRect();
    console.log(`rect pos : ${rect.x}, ${rect.y}, ${this.startX}, ${this.startY}`);

    let nowX = rect.x;
    let nowY = rect.y;

    let diffX = nowX- event.startX;
    let diffY = -(nowY - event.startY);

    console.log("pos "+ diffX + ", " + diffY);

    const obs = {
      next:(x:any)=>{},
      error:(err:Error)=>{console.log("err : "+err);},
      complete:()=>{}
    };

    //https://angular.jp/guide/observables
    this.manualMove.moveWheel(diffX, diffY).subscribe(obs);

  }


  /**
   *
   * @param $event
   */
  onWheelSpeedChange($event: ISliderValueChangeEventArgs) {
    console.log("onWheelSpeedChante");
    console.log($event.value);

    const obs = {
      next:(x:any)=>{console.log("next obs")},
      error:(err:Error)=>{console.log("err : "+err);},
      complete:()=>{console.log("comp")}
    };

    this.manualMove.setMoveMaxSpeed((Number)($event.value)).subscribe(obs);

  }

  /**
   *
   * @param $event
   */
  onWheelRotSpeedChange($event: ISliderValueChangeEventArgs) {
    console.log("onWheelRotSpeedChange");
    console.log($event.value);

    const obs = {
      next:(x:any)=>{console.log("next obs")},
      error:(err:Error)=>{console.log("err : "+err);},
      complete:()=>{console.log("comp")}
    };

    this.manualMove.setRotMaxSpeed((Number)($event.value)).subscribe(obs);
  }

  /**
   *
   * @param $event
   */
  onReflectorSpeedChange($event: ISliderValueChangeEventArgs) {
    console.log("onReflectorSpeedChange");
    console.log($event.value);

    const obs = {
      next:(x:any)=>{console.log("next obs")},
      error:(err:Error)=>{console.log("err : "+err);},
      complete:()=>{console.log("comp")}
    };

    this.manualMove.setRefMaxSpeed((Number)($event.value)).subscribe(obs);
  }
}
