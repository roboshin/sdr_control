import {Component, OnInit, ViewChild} from '@angular/core';
import {RobotInformation} from "../robot-information";
import {NGXLogger} from "ngx-logger";
import {IgxDialogComponent} from "igniteui-angular";
import {RobotControService} from "../file.service";
import {Point3D_Ts} from "../point3d_-ts";
import {award} from "@igniteui/material-icons-extended";

/**
 * プリンタの吐出位置
 */
@Component({
  selector: 'app-calib-print-point',
  templateUrl: './calib-print-point.component.html',
  styleUrls: ['./calib-print-point.component.scss']
})
export class CalibPrintPointComponent implements OnInit {

  public robotInfo : RobotInformation;
  public dialogTitle : string;
  public dialogMsg : string;

  public refPos : Point3D_Ts;  // 吐出開始時のリフレクター座標値
  public printPos : Point3D_Ts; // 吐出位置の値
  public errorPos : Point3D_Ts; // 計算されたエラー値

  @ViewChild('alert', {static : true}) public alertDialg: IgxDialogComponent;

  constructor(private logger: NGXLogger,private rcs: RobotControService,) { }

  ngOnInit(): void {
    this.refPos = new Point3D_Ts();
    this.printPos = new Point3D_Ts();
    this.errorPos = new Point3D_Ts();
  }

  /**
   * ロボットの状態を取得する
   */
  onGetRobotIfo(t : string) : Point3D_Ts {

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

        if (t == 'refPointButton') {
          // リフレクタ位置計測ボタン
          this.refPos.x = x.nowMeasurePoint.x;
          this.refPos.y = x.nowMeasurePoint.y;
          this.refPos.z = x.nowMeasurePoint.z;

        } else if (t == 'printPointButton') {
          // 吐出位置計測ボタン
          this.printPos.x = x.nowMeasurePoint.x;
          this.printPos.y = x.nowMeasurePoint.y;
          this.printPos.z = x.nowMeasurePoint.z;

        } else if (t == 'calcErrorButton') {
          // エラー計算ボタン
          let ex = this.refPos.x - this.printPos.x;
          let ey = this.refPos.y - this.printPos.y;
          let ez = this.refPos.z - this.printPos.z;

          this.errorPos.x = ex;
          this.errorPos.y = ey;
          this.errorPos.z = ez;
        }

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

    return new Point3D_Ts();
  }

  async measureButtonClick($event: MouseEvent) {
    console.log($event.target);
    let b = $event.target as HTMLButtonElement;
    let compName = b.name;

    this.onGetRobotIfo(compName);

  }

  /**
   * 補正値書込ボタン
   * @param $event
   */
  writeCorrectValue($event: MouseEvent) {

  }
}
