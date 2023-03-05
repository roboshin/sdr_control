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
