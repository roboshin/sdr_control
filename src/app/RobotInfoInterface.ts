/**
 * ロボット情報表示用データ
 */
export interface Point3D{
  x : number;
  y : number;
  z : number;
}

/**
 * マトリックス要素管理用
 */
export interface Matrix{
  x : number;
  y : number;
  z : number;
  rz : number;
  ry : number;
  rx : number;
}

/**
 * ロボットの現在状態表示用
 */
export interface RobotInfo{
  nowPoint : Point3D;
  errorMat : Matrix;
  drawing : boolean;
  imuAngle : number;
}

class rinfo implements RobotInfo {
  drawing: boolean;
  errorMat: Matrix;
  imuAngle: number;
  nowPoint: Point3D;

  // コンストラクタ
  constructor(nowPoint : Point3D, errorMat : Matrix, imuAngle: number, drawing : boolean) {
    this.drawing = drawing;
    this.errorMat = errorMat;
    this.imuAngle = imuAngle;
    this.nowPoint = nowPoint;
  }

}

/**
 * ロボットの状態を管理するクラス
 */
export class RobotInformation {

  /** @type {Point3D} */
  NowMeasurePoint: Point3D;

  /** @type {Point3D} */
  NowMeasureDxfPoint: Point3D;

  /** @type {boolean} */
  InkOnStatus: boolean;

  constructor() {
    this.NowMeasurePoint = new class implements Point3D {
      x: number;
      y: number;
      z: number;
    }
    this.NowMeasureDxfPoint = new class implements Point3D {
      x: number;
      y: number;
      z: number;
    }

    this.NowMeasurePoint.x = 0;
    this.NowMeasurePoint.y = 0;
    this.NowMeasurePoint.z = 0;

    this.NowMeasureDxfPoint.x = 0;
    this.NowMeasureDxfPoint.y = 0;
    this.NowMeasureDxfPoint.z = 0;
  }
}
