import { Component , OnInit, NgZone, OnDestroy} from '@angular/core';
import {AfterViewInit, TemplateRef, ViewChild, ElementRef} from "@angular/core";
import { Country, data } from './local-data';
import {RobotControService} from "../file.service";
import { from, Observable } from 'rxjs';
import {NGXLogger} from "ngx-logger";
import {IgxDialogComponent} from "igniteui-angular";

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit{
  public items: Country[] = data;
  public rippleColor = 'grey';


  private _interval: number = -1;
  private _refreshInterval: number = 3000;
  private shouldTick: boolean = true;

  dialogTitle: string;  // dialog用タイトル
  dialogMsg : string    // dialog用メッセージ

  @ViewChild('alert', {static : true}) public alertDialg: IgxDialogComponent;

  constructor(private rcs: RobotControService,
              private logger: NGXLogger,
              private _zone: NgZone,) {
  }

  ngOnInit():void{

  }

  public ngAfterViewInit() {

    this.setupInterval();

  }

  public ngOnDestroy(){
    this._interval = -1;
  }



  /**
   *
   * @private
   */
  private setupInterval(): void {
    if (this._interval >= 0) {
      this._zone.runOutsideAngular(() => {
        window.clearInterval(this._interval);
      });
      this._interval = -1;
    }

    this._zone.runOutsideAngular(() => {
      this._interval = window.setInterval(() => this.tick(),
        this._refreshInterval);
    });
  }

  onGetRobotIfo(){
    const obs = {
      next: (x: any) => {
        // 設定しましたDialogを表示する
        console.log(x)
        if (x['Obstacle'] == true) {
          this.dialogTitle = `障害物`;
          this.dialogMsg = `障害物を検知`;
          this.alertDialg.open();
        }
        else if(x['NonKuinabi'] == true){
          this.dialogTitle = `杭ナビエラー`;
          this.dialogMsg = `杭ナビがエラーを通知しました`;
          this.alertDialg.open();
        }

      },
      error: (err: Error) => {
        console.log("err : " + err);
        console.log(err.message);

        this.dialogTitle = "通信エラー";
        this.dialogMsg = `ロボットと通信ができません`;
        this.alertDialg.open();
      },
      complete: () => {
        // フォームを閉じる
        console.log("comp")

      }
    }

    this.rcs.getRobotInfo("test").subscribe(obs);
  }

  /**
   *
   * @private
   */
  private tick(): void {

    if (this.shouldTick) {
      //console.log("tick")
      // const newVal = {px:100+200, py:210};
      // this.NowRobotPos.push(newVal)
      //
      // //console.log(this.NowRobotPos.length);
      // this.NowRobotPos.pop()
      //
      // this.NowRobotPos[0].px += 10; // 現在地の更新
      // this.scatterSeriesRobotPos.dataSource = this.NowRobotPos;

      this.onGetRobotIfo();
    }
  }

  /**
   * 動作開始
   */
  onPlay(){
    console.log("onPlay");
    this.rcs.setPlay('play').subscribe({
      next(response) { console.log(response); },
      error(err) { console.error('Error: ' + err); },
      complete() { console.log('Completed'); }
    })};

  /**
   * 動作一時停止
   */
  onHold(){
    this.rcs.setHold('hold').subscribe({
      next(response) { console.log(response); },
      error(err) { console.error('Error: ' + err); },
      complete() { console.log('Completed'); }
    })};

  /**
   * 動作停止
   */
  onStop(){
    this.rcs.setStop('stop').subscribe({
      next(response) { console.log(response); },
      error(err) { console.error('Error: ' + err); },
      complete() { console.log('Completed'); }
    })};


}
