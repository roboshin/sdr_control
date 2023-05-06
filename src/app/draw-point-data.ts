import {NGXLogger} from "ngx-logger";
// import {name} from "jszip";

export namespace Chart {
  /**
   * 2D位置保持クラス
   */
  export class Point2D {
    public X: number;
    public Y: number;

    constructor(x: number, y: number) {
      this.X = x;
      this.Y = y;
    }
  }

  /**
   * 3D位置保持クラス
   */
  export class Point3D{
    public X : number;
    public Y : number;
    public Z : number;
  }
}

/**
 * 基準点データ
 */
export class BasePoint{
  //
  public Name : string;
  public MasterPoint : Chart.Point2D;
  public MeasurePoint : Chart.Point2D;
  public ID: number;
  public MasterName : string;
  public Updated : boolean;


  logger : NGXLogger;

  constructor(name : string,
              masterPoint : Chart.Point2D,
              measurePoint : Chart.Point2D,
              id : number,
              masterName : string,
              updateed : boolean) {
    this.Name = name;
    this.MasterPoint = masterPoint;
    this.MeasurePoint = measurePoint;
    this.ID  = id;
    this.MasterName = masterName;
    this.Updated = updateed;
  }


}

export class BaseMsterPoint{
  public Name:string;
  public Point : Chart.Point2D;
}

export class DrawPolygonPoint{
  public Points : Chart.Point2D[];
}

export class DrawPoint{
 public Point : Chart.Point2D;
}

/**
 * グラフ表示に関するデータクラス
 */
export class DxfChartDatas {
  // 計測基準点名のリスト
  // public BasePointList = [
  //   {BasePoint : {name: "P1", masterPoint: [100.0, 101.0], measurePoint: [200.0, 201.0], id: 1, masterName: "MASTER_P1", updated : false}},
  //   {BasePoint : {name: "P2", masterPoint: [101.0, 101.0], measurePoint: [200.0, 201.0], id: 2, masterName: "MASTER_P2", updated : false}},
  //   {BasePoint : {name: "P3", masterPoint: [102.0, 101.0], measurePoint: [200.0, 201.0], id: 3, masterName: "MASTER_P3", updated : false}},
  //
  // ];


  // 基準点データと測定データ管理用
  public BasePointList = [
    new BasePoint("P1", new Chart.Point2D(0, 0), new Chart.Point2D(0, 0), 1, "MASTER_P1", false),
    new BasePoint("P2", new Chart.Point2D(0, 0), new Chart.Point2D(0, 0), 1, "MASTER_P2", false),
    new BasePoint("P3", new Chart.Point2D(0, 0), new Chart.Point2D(0, 0), 1, "MASTER_P3", false),

  ]

  // 基準点の候補値
  public BasePointsCrossPointData : Array<{Point2D : {X:number, Y:number}}> =
    [
      // {points: [{x: 0, y: 0}], px: 100, py: 100},
      // {points: [{x: 0, y: 0}], px: 200, py: 300},
      // {points: [{x: 0, y: 0}], px: 400, py: 500},
      {Point2D: {X: 100, Y: 100}},
      {Point2D: {X: 200, Y: 300}},
      {Point2D: {X: 400, Y: 500}},
    ];

  // public BaseMasterPointData = [
  //   // {name : "P1", points: [{x: 0, y: 0}], px: 100, py: 100},
  //   // {name : "P2",points: [{x: 0, y: 0}], px: 200, py: 200},
  //   // {name : "P3",points: [{x: 0, y: 0}], px: 300, py: 300},
  //   {BaseMasterPoint: {name: "P1", Point2D: {X: 100, Y: 100}}},
  //   {BaseMasterPoint: {name: "P2", Point2D: {X: 200, Y: 200}}},
  //   {BaseMasterPoint: {name: "P3", Point2D: {X: 300, Y: 300}}},
  // ]

  // 描画範囲設定用
  public DrawPolygonPointData =
    [
      {
        points: [
          [{x: 1020, y: 1000}, {x: 2000, y: 1000}, {x: 2000, y: 2000}, {x: 1000, y: 2000}, {x: 1020, y: 1000}],
          [{x: 5000, y: 5000}, {x: 6000, y: 6000}]
        ]
      },
    ]

  // 描画範囲ポイント設定用
  //
  public DrawPointData = [
    {Point2D: {X: 1020, Y: 1000}},
    {Point2D: {X: 2000, Y: 1000}},
    {Point2D: {X: 2000, Y: 2000}},
    {Point2D: {X: 1000, Y: 2000}},
    {Point2D: {X: 1020, Y: 1000}}
  ]

  constructor(private logger: NGXLogger) {
  }

  /**
   * 指定番号の基準点情報を取得する
   * @param itemNumber
   */
  getBasePointFromNumber(itemNumber: number):BasePoint {

    return this.BasePointList[itemNumber];
  }

  /**
   * 名前指定の基準点情報を取得する
   * @param baseName
   */
  getBasePointFromName(baseName : string):BasePoint{
    var retAns = this.BasePointList.find(d=>d.Name == baseName);

    return retAns;
  }

  /**
   * 基準点情報を設定する
   * @param baseName
   * @param x
   * @param y
   * @param index
   */
  setBasePoint(baseName : string, x : number, y : number, index : number){
    var basePointName = `MASTER_P${index}`;
    this.logger.log("Convert number" + `${basePointName}`)
    this.BasePointList.push(new BasePoint(baseName,new Chart.Point2D(x,y), new Chart.Point2D(x,y), 1, basePointName, false));
  }

  /**
   * 基準点情報の全クリア
   */
  clearBasePoint(){
    this.BasePointList.splice(0);
  }


  /**
   * 基準点表示用のデータを取得する
   */
  getBaseMasterPoints():Chart.Point2D []{
    var retAns = this.BasePointList.map(d=>d.MasterPoint);

    return retAns;
  }

  /**
   *
   * @param itemNumber
   * @param x
   * @param y
   */
  setBasePointMaster(itemNumber : number, x: number, y:number):void {

    // 基準値XYの更新
    this.BasePointList[itemNumber].MasterPoint.X = x;
    this.BasePointList[itemNumber].MasterPoint.Y = y;
  }


}


