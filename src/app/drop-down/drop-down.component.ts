import {Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {AfterViewInit, TemplateRef, ViewChild, ElementRef} from "@angular/core";
import { Country, data } from './local-data';
import {RobotControService} from "../file.service";
import { from, Observable } from 'rxjs';
import {NGXLogger} from "ngx-logger";
import {IgxDialogComponent} from "igniteui-angular";
import {RobotInformation} from "../robot-information";


@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit{
  public items: Country[] = data;
  public rippleColor = 'grey';


  private _interval: number = -1;
  private _refreshInterval: number = 500;
  private shouldTick: boolean = true;

  public robotInfo : RobotInformation;

  dialogTitle: string;  // dialog用タイトル
  dialogMsg : string    // dialog用メッセージ

  @ViewChild('alert', {static : true}) public alertDialg: IgxDialogComponent;

  // 各ボタンの有効無効フラグ
  playButtonDisable: boolean = true;

  constructor(private rcs: RobotControService,
              private logger: NGXLogger,
              private _zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit():void{
    this.robotInfo = new RobotInformation();
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

  /**
   * ロボットの現在値を取得する
   */
  onGetRobotPose(){
    const obs = {
      next: (x: any) => {

      },
      error : (err:Error) =>{
    },
      complete : ()=>{
      }
    }


  }

  /**
   * ロボットの状態を取得する
   */
  onGetRobotIfo(){

    const obs = {
      next: (x: RobotInformation) => {
        // 設定しましたDialogを表示する
        this.logger.log(`x : ${typeof x}`)
        if (x.obstacleDetected == true) {
          this.dialogTitle = `障害物`;
          this.dialogMsg = `障害物を検知`;
          this.alertDialg.open();
        }
        else if(x.nonKuiNavyData == true){
          this.dialogTitle = `杭ナビエラー`;
          this.dialogMsg = `杭ナビがエラーを通知しました`;
          this.alertDialg.open();
        }

        // 現在情報をセットする
        this.robotInfo = x;

        // DXFの読み込みが完了している場合
        if(this.robotInfo.dxfLoaded) this.playButtonDisable = false;

        this.changeDetectorRef.detectChanges(); // 画面の再描画

      },
      error: (err: Error) => {
        this.logger.error("err : " + `${err.message}`);
        this.dialogTitle = "通信エラー";
        this.dialogMsg = `ロボットと通信ができません`;
        this.alertDialg.open();
      },
      complete: () => {
        // フォームを閉じる
        this.logger.log("comp");
      }
    }

    this.rcs.getRobotInfo("test").subscribe(obs);
  }

  /**
   * タイマ処理
   * @private
   */
  private tick(): void {

    if (this.shouldTick) {
      // ロボットの状態を所得する
      this.onGetRobotIfo();
    }
  }

  /**
   * 動作開始
   */
  onPlay(){
    // console.log("onPlay");
    this.logger.log("onPlay");

    let obs = {
      next : (response:any)=> { this.logger.log(response); },
      error : (err: Error)=> { this.logger.error('Error: ' + `${err.message}`); },
      complete :()=> { this.logger.log('Completed'); }
    };

    this.rcs.setPlay('play').subscribe(obs);
  };

  /**
   * 動作一時停止
   */
  onHold(){

    let obs = {
      next : (response:any)=> { this.logger.log(response); },
      error : (err: Error)=> { this.logger.error('Error: ' + `${err.message}`); },
      complete :()=> { this.logger.log('Completed'); }
    };

    this.rcs.setHold('hold').subscribe(obs);
  };

  /**
   * 動作停止
   */
  onStop(){

    let obs = {
      next : (response:any)=> { this.logger.log(response); },
      error : (err: Error)=> { this.logger.error('Error: ' + `${err.message}`); },
      complete :()=> { this.logger.log('Completed'); }
    };

    this.rcs.setStop('stop').subscribe(obs);
  };


  /**
   * 現在値の計測
   * 計測結果は、現在の杭ナビ値とそれをDXF座標系で表した値
   */
  onMeasureNowPoint(){
    this.logger?.log(`[START]:onMeasureNowPoint`);

    this.logger?.log(`[END]:onMeasureNowPoint`);
  }
}
