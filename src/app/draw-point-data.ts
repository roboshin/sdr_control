import {NGXLogger} from "ngx-logger";

export class DxfChartDatas
{
  // 計測基準点名のリスト
  public BasePointList = [
    {name: "P1", masterPoint: [100.0, 101.0], measurePoint: [200.0, 201.0], id: 1, masterName: "MASTER_P1", updated : false},
    {name: "P2", masterPoint: [101.0, 101.0], measurePoint: [200.0, 201.0], id: 2, masterName: "MASTER_P2", updated : false},
    {name: "P3", masterPoint: [102.0, 101.0], measurePoint: [200.0, 201.0], id: 3, masterName: "MASTER_P3", updated : false},
  ];

  // ベースポイントの候補値
  public BasePointsCrossPointData =
    [
      // {points: [{x: 0, y: 0}], px: 100, py: 100},
      // {points: [{x: 0, y: 0}], px: 200, py: 300},
      // {points: [{x: 0, y: 0}], px: 400, py: 500},
      {Point2D: {X: 100, Y: 100}},
      {Point2D: {X: 200, Y: 300}},
      {Point2D: {X: 400, Y: 500}},
    ]

  public BaseMasterPointData = [
    // {name : "P1", points: [{x: 0, y: 0}], px: 100, py: 100},
    // {name : "P2",points: [{x: 0, y: 0}], px: 200, py: 200},
    // {name : "P3",points: [{x: 0, y: 0}], px: 300, py: 300},
    {name : "P1", Point2D :{ X: 100, Y: 100}},
    {name : "P2", Point2D :{ X: 200, Y: 200}},
    {name : "P3", Point2D :{ X: 300, Y: 300}},
  ]

  // 描画範囲設定用
  public DrawPolygonPointData =
    [
      {points: [
          [{x: 1020, y: 1000},{x:2000, y:1000}, {x:2000,y:2000}, {x:1000, y:2000}, {x:1020,y:1000}],
          [{x:5000,y:5000},{x:6000,y:6000}]
        ]
      },
    ]

  // 描画範囲ポイント設定用
  //
  public DrawPointData = [
    {Point2D : {X:1020, Y:1000}},
    {Point2D : {X:2000, Y:1000}},
    {Point2D : {X:2000, Y:2000}},
    {Point2D : {X:1000, Y:2000}},
    {Point2D : {X:1020, Y:1000}}
  ]

  constructor(private logger : NGXLogger) {
  }


}


