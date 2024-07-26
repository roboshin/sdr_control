import { Component, OnInit, AfterViewInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {KuiNavyService} from "../KuiNavy.service";

@Component({
  selector: 'app-kuinavy-control',
  templateUrl: './kuinavy-control.component.html',
  styleUrls: ['./kuinavy-control.component.scss']
})
export class KuinavyControlComponent implements OnInit, AfterViewInit {

  public selected: string;


  constructor(
    private logger:NGXLogger,
    private kuinavy:KuiNavyService) { }

  ngOnInit(): void {
    this.logger.debug("[START] : ngOnInit")
  }

  ngAfterViewInit() {
    this.logger.debug("[START] : ngAfterViewInit")

    // 起動時に杭ナビの状態をロボットから取得し、その情報を書くコンポーネントに反映する
  }

  /**
   * 杭ナビに接続を開始する
   */
  onConnect() {

  }

  /**
   * 杭ナビの接続を解除する
   */
  onDisconnect() {

  }

  /**
   * ターゲットサーチコマンドを発行
   */
  onSearchTarget() {
    const obs = {
      next : (x : any)=>{
        console.log("杭ナビサーチ開始")
      },
      error:(err:Error) =>{
        console.log("杭ナビサーチ開始エラー")
        console.log(err.message);
      },
      complete:()=>{
        console.log("杭ナビサーチ開始Complete")
      }
    };

    this.kuinavy.setCmdSearch().subscribe(obs);
  }

  /**
   * 連続計測を開始する
   */
  onStartMeasure() {
    const obs = {
      next : (x : any)=>{
        console.log("杭ナビ計測開始")
      },
      error:(err:Error) =>{
        console.log("杭ナビ計測開始")
        console.log(err.message);
      },
      complete:()=>{
        console.log("杭ナビ計測開始omplete")
      }
    };

    this.kuinavy.setCmdStartMeasure().subscribe(obs);
  }

  /**
   * 計測を停止する
   */
  onStopMeasure() {
    const obs = {
      next : (x : any)=>{
        console.log("杭ナビ計測停止")
      },
      error:(err:Error) =>{
        console.log("杭ナビ計測停止エラー")
        console.log(err.message);
      },
      complete:()=>{
        console.log("杭ナビ計測停止Complete")
      }
    };

    this.kuinavy.setCmdStopMeasure().subscribe(obs);
  }
}
