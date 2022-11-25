import { IDragBaseEventArgs, IDragMoveEventArgs, IgxSliderType } from 'igniteui-angular';
import { error } from 'protractor';

import {
    AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild
} from '@angular/core';

import { ManualService } from '../Manual.Service';

@Component({
  selector: 'app-manual-movesdr',
  templateUrl: './manual-movesdr.component.html',
  styleUrls: ['./manual-movesdr.component.scss']
})
export class ManualMovesdrComponent implements OnInit, AfterViewInit {

  @ViewChild('bCircle', {static: true}) public boundCircle: ElementRef;
  screenwidth: any;
  screenheight: any;
  dragmoveelement: any;
  boundingelement: any;
  animationDuration = 0.3;

  manualstartX = 0;   // ドラッグ最初のx座標
  manualstarty = 0;   // ドラッグ最初のy座標
  public leftbtnpress: boolean = false;
  public rightbtnpress: boolean = false;

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
  }

  /**
   *  最初の一度だけ実行
   */
  ngAfterViewInit() {
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
    this.startX = rect.x;
    this.startY = rect.y;

  }

  /**
   * ポインターダウン((or マウスダウン) or タッチ) イベント時の処理
   */
  // @HostListener('mousedown', ['$event'])
  @HostListener('pointerdown', ['$event'])    // スマートフォンのタッチも認識するため変更
  onMouseDown(event) {
    console.log("mouse down event");
    // console.log(event);
    if (event.target.className.indexOf('leftturnbtn') >= 0) {   // 押されたボタンのクラス名に"leftturnbtn"(左回転ボタン)が含まれている
      console.log("left turn button click.");
      this.leftbtnpress = true;   // 左回転中フラグセット

      // ここにロボット左回転命令（サービス経由になると思われる）をセットする
      console.log("Todo ROBOT HIDARI KAITEN JIKKOH")      
    } else if (event.target.className.indexOf('rightturnbtn') >= 0) {   // 押されたボタンのクラス名に"rightturnbtn"(右回転ボタン)が含まれている
      console.log("right turn button click.");
      this.rightbtnpress = true;   // 右回転中フラグセット

      // ここにロボット右回転命令（サービス経由になると思われる）をセットする
      console.log("Todo ROBOT MIGI KAITEN JIKKOH")      
    }
  }

  /**
   * ポインターアップ((or マウスアップ) or タッチリリース) イベント時の処理
   */
   @HostListener('pointerup', ['$event'])  
   onMouseUp(event) {
     console.log("mouse up event");
    //  console.log(event);

    // もし左右どちらかに回転中フラグが立っていた場合
    // 指やマウスを押したままボタンから外れた状態でリリースされた場合、リリースイベントにボタンIDは入らないが、その場合でも対応できるように
    if (this.leftbtnpress == true || this.rightbtnpress == true) {
      // ここにロボット回転停止命令（サービス経由になると思われる）をセットする
      console.log("Todo ROBOT KAITEN STOP.")

      // 左右回転フラグを落とす（ここでは無駄になる判断入れずに両方のフラグを落としてしまうことにする）
      this.leftbtnpress = false;
      this.rightbtnpress = false; 
    }
   }

  /**
   * ポインターアウト((or マウスアウト) or タッチアウト) イベント時の処理 
   * 押しっぱなしでポインタもしくは指がエレメント外に移動したときのための処理（回転ボタンについてはキャンセルしたものとする）
   */
      @HostListener('pointerout', ['$event'])  
      onMouseOut(event) {
        console.log("mouse out of element event");
       //  console.log(event);
   
       // もし左右どちらかに回転中フラグが立っていた場合
       // 指やマウスを押したままボタンから外れた場合、どちらかに回転中の場合はこのイベントで止める
       if (this.leftbtnpress == true || this.rightbtnpress == true) {
         // ここにロボット回転停止命令（サービス経由になると思われる）をセットする
         console.log("Todo ROBOT KAITEN STOP.")
   
         // 左右回転フラグを落とす（ここでは無駄になる判断入れずに両方のフラグを落としてしまうことにする）
         this.leftbtnpress = false;
         this.rightbtnpress = false; 
       }
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


    this.manualMove.moveWeelStop().subscribe(); // 台車を停止させる
    // if (this.newIndex !== null) {
    //     // When we have moved the dragged element up/down, animate it to its new location.
    //     const moveDown = this.newIndex > itemIndex;
    //     // If the new position is below add the height moved down, otherwise subtract it.
    //     const prefix = moveDown ? 1 : -1;
    //     // The height that the new position differs from the current. We know that each item is 55px height.
    //     const movedHeight = prefix * Math.abs(this.newIndex - itemIndex) * this.listItemHeight;
    //     const originLocation = event.owner.originLocation;
    //     event.owner.transitionTo(
    //         new IgxDragLocation(originLocation.pageX, originLocation.pageY + movedHeight),
    //         { duration: this.animationDuration }
    //     );
    // }

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

    var rect = this.boundCircle.nativeElement.getBoundingClientRect();
    console.log(rect);

    var nowX = rect.x;
    var nowY = rect.y;

    let diffX = nowX- this.startX;
    let diffY = -(nowY- this.startY);

    console.log("pos "+ diffX + ", " + diffY);

    const obs = {
      next:(x:any)=>{console.log("next obs")},
      error:(err:Error)=>{console.log("err : "+err);},
      complete:()=>{console.log("comp")}
    };

    //https://angular.jp/guide/observables
    this.manualMove.moveWheel(diffX, diffY).subscribe(obs);

    // const containerPosY = this.listContainer.nativeElement.getBoundingClientRect().top;
    // // Relative position of the dragged element to the list container.
    // const relativePosY = event.nextPageY - containerPosY;

    // let newIndex = Math.floor(relativePosY / this.listItemHeight);
    // newIndex = newIndex < 0 ? 0 : (newIndex >= this.employees.length ? this.employees.length - 1 : newIndex);
    // if (newIndex === this.newIndex) {
    //     // If the current new index is unchanged do nothing.
    //     return;
    // }

    // const movingDown = newIndex > itemIndex;
    // if (movingDown && newIndex > this.newIndex ||
    //     (!movingDown && newIndex < this.newIndex && newIndex !== itemIndex)) {
    //     // If we are moving the dragged element down and the new index is bigger than the current
    //     // this means that the element we are stepping into is not shifted up and should be shifted.
    //     // Same if we moving the dragged element up and the new index is smaller than the current.
    //     const elementToMove = this.getDragDirectiveRef(this.employees[newIndex].id);
    //     const currentLocation = elementToMove.location;
    //     const prefix = movingDown ? -1 : 1;
    //     elementToMove.transitionTo(
    //         new IgxDragLocation(currentLocation.pageX, currentLocation.pageY + prefix * this.listItemHeight),
    //         { duration: this.animationDuration }
    //     );
    // } else {
    //     // Otherwise if are moving up but the new index is still bigger than the current, this means that
    //     // the item we are stepping into is already shifted and should be returned to its original position.
    //     // Same if we are moving down and the new index is still smaller than the current.
    //     const elementToMove = this.getDragDirectiveRef(this.employees[this.newIndex].id);
    //     elementToMove.transitionToOrigin({ duration: this.animationDuration });
    // }

    // this.newIndex = newIndex;
  }


}
