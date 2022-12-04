import { Component, OnInit, AfterViewInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-kuinavy-control',
  templateUrl: './kuinavy-control.component.html',
  styleUrls: ['./kuinavy-control.component.scss']
})
export class KuinavyControlComponent implements OnInit, AfterViewInit {

  public selected: string;


  constructor(
    private logger:NGXLogger) { }

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

  }

  /**
   * 連続計測を開始する
   */
  onStartMeasure() {

  }

  /**
   * 計測を停止する
   */
  onStopMeasure() {

  }
}
