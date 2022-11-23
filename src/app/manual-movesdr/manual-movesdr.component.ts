import { IDragBaseEventArgs, IDragMoveEventArgs, IgxSliderType } from 'igniteui-angular';

import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-manual-movesdr',
  templateUrl: './manual-movesdr.component.html',
  styleUrls: ['./manual-movesdr.component.scss']
})
export class ManualMovesdrComponent implements OnInit, AfterViewInit {

  screenwidth: any;
  screenheight: any;
  dragmoveelement: any;
  boundingelement: any;
  animationDuration = 0.3;

  // sliderType = IgxSliderType;

  // volumeL = 50;
  // volumeH = 50;
  rippleColor = 'grey';

  private _el: HTMLElement;

  constructor(el: ElementRef) {
    this._el = el.nativeElement;
   }

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

    if (this.screenheight > this.screenwidth) { // 縦長
      this.boundingelement[0].style.width = Math.trunc(this.screenwidth * 0.7).toString() + "px";
      this.boundingelement[0].style.height = Math.trunc(this.screenwidth * 0.7).toString() + "px";
      this.dragmoveelement[0].style.width = Math.trunc(this.screenwidth * 0.4).toString() + "px";
      this.dragmoveelement[0].style.height = Math.trunc(this.screenwidth * 0.4).toString() + "px";
      this.dragmoveelement[0].style.lineHeight = Math.trunc(this.screenwidth * 0.4).toString() + "px"
    } else {
      this.boundingelement[0].style.width = Math.trunc(this.screenheight * 0.7).toString() + "px";
      this.boundingelement[0].style.height = Math.trunc(this.screenheight * 0.7).toString() + "px";
      this.dragmoveelement[0].style.width = Math.trunc(this.screenheight * 0.4).toString() + "px";
      this.dragmoveelement[0].style.height = Math.trunc(this.screenheight * 0.4).toString() + "px";
      this.dragmoveelement[0].style.lineHeight = Math.trunc(this.screenheight * 0.4).toString() + "px"

    }
  }

  /**
   * クリックイベント時の処理
   */
   @HostListener('mousedown', ['$event'])  
   onMouseDown(event) {
     console.log("mouse down event " + event)
     if(event.target.className == "targetsvg") {
      ;
     }
   }
 

  onDragStart(event: IDragBaseEventArgs) {
    console.log("DragStart");
    console.log(event);
    // Sets specific class when dragging.
    // event.owner.data.dragged = true;
  }

  onDragEnd(event: IDragBaseEventArgs) {
    console.log("DragEnd");
    console.log(event);
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
    event.owner.transitionToOrigin({ duration: this.animationDuration });
  }

  onDragMove(event: IDragMoveEventArgs) {
    console.log("DragMove...");
    console.log("from x: "+event.pageX+" y: "+event.pageY);
    console.log("to x: "+event.nextPageX+" y: "+event.nextPageY);

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