import {Component, OnInit, ViewChild} from '@angular/core';
import {RobotInfoService, SettingInfo} from "../robotInfo.service";
import { NGXLogger } from "ngx-logger";
import {IgxDialogComponent} from "igniteui-angular";

@Component({
  selector: 'app-robot-settings',
  templateUrl: './robot-settings.component.html',
  styleUrls: ['./robot-settings.component.scss']
})
export class RobotSettingsComponent implements OnInit {

  constructor(
    private logger : NGXLogger,
    private robotService : RobotInfoService) { }

  @ViewChild('alert', {static : true}) public alertDialog: IgxDialogComponent;

  xErrorGain : number = 1;
  yErrorGain : number = 1;
  drawing : boolean = false;
  drawSpeed : number = 70;

  dialogTitle : string; // ダイアログタイトル用文字列
  dialogMsg : string; // ダイアログメッセージ

  ngOnInit(): void {
  }

  /**
   * ロボットへ値を通知する
   * @param $event
   */
  setRobotSettings($event: any) {
    var settings = new SettingInfo();
    settings.XErrorGain = this.xErrorGain;
    settings.YErrorGain = this.yErrorGain;
    settings.InkOn = this.drawing;
    settings.DrawSpeed = this.drawSpeed;

    const rSettings = this.robotService.setRobotSettings("all", settings);

    const settingsObj = {
      next: (x: any) => {
        // 設定しましたDialogを表示する
        console.log(x);

        this.dialogTitle = `ロボット設定`;
        this.dialogMsg = `ロボットに情報を設定しました`;
        this.alertDialog.open();

        // 設定されたポイント値を更新する
      },
      error: (err: Error) => {
        console.log("err : " + err);
        console.log(err.message);

        this.dialogTitle = "ロボットエラー";
        this.dialogMsg = `ロボットへの設定に失敗しました`;
        this.alertDialog.open();
      },
      complete: () => {
        // フォームを閉じる
        console.log("comp")

      }
    };

    rSettings.subscribe(settingsObj); // サーバへ値を設定する
  }
}
