import { Component, OnInit, NgZone,ViewChild, ElementRef } from '@angular/core';
import { IgxSwitchModule } from 'igniteui-angular';
import {RobotInfoService} from "../robotInfo.service";
import {NGXLogger} from "ngx-logger";
import {Matrix, Point3D, RobotInfo} from "../RobotInfoInterface";


@Component({
  selector: 'app-robot-info',
  templateUrl: './robot-info.component.html',
  styleUrls: ['./robot-info.component.scss']
})
export class RobotInfoComponent implements OnInit {

  nowPoint : Point3D;
  errorMat : Matrix;
  drawing : boolean;
  imuAngle :number;

  constructor(private logger : NGXLogger,
              private robotInfoService : RobotInfoService) { }


  // rInfo : RobotInfo;

  ngOnInit(): void {

    const robotInfo = this.robotInfoService.getRobotInfo();

    this.nowPoint = new class implements Point3D {
      x: number;
      y: number;
      z: number;
    };

    this.errorMat = new class implements Matrix {
      rx: number;
      ry: number;
      rz: number;
      x: number;
      y: number;
      z: number;
    }

    this.drawing = true;


    // サーバからデータを取得する
    const getRobotInfoObs = {
      next : (x:any) =>{
        this.logger.debug(`${x}`);
        console.log(x);

        this.nowPoint.x = x["NowMeasurePoint3D"]['X'];
        this.nowPoint.y = x["NowMeasurePoint3D"]['Y'];
        this.nowPoint.z = x["NowMeasurePoint3D"]['Z'];

        this.errorMat.x = x["ErrorMatrixElement"][3];
        this.errorMat.x = x["ErrorMatrixElement"][7];
        this.errorMat.x = x["ErrorMatrixElement"][11];

        let nDrawingCurve = x["NowDrawingCurve"];
        if(nDrawingCurve == null) {
          this.drawing = false;
        }

        this.imuAngle = x["NowImuAngles"]["Degrees"];
      },
      error : (err:Error)=> {

      },
      complete : ()=>{

      }
    };

    robotInfo.subscribe(getRobotInfoObs);

  }

}
