import {Component, OnInit} from '@angular/core';
import {
  CategoryChartType,
  IgxDataChartMouseButtonEventArgs,
  IgxPlotAreaMouseButtonEventArgs, IgxScatterPolygonSeriesComponent, IgxScatterSeriesComponent
} from 'igniteui-angular-charts';
import {AfterViewInit, TemplateRef, ViewChild, ElementRef} from "@angular/core";
import {IgxStyleShapeEventArgs} from "igniteui-angular-charts";
import {IgxScatterPolylineSeriesComponent} from "igniteui-angular-charts";
import {
  IDialogCancellableEventArgs,
  IDialogEventArgs,
  IgxDialogComponent,
  IgxSimpleComboComponent
} from "igniteui-angular";
import {LineInfo, Point2D} from "../LineInfo";
import {any} from "codelyzer/util/function";
import {BasePointService} from "../BasePoint.Service";
import {map} from "rxjs/operators";
import {FileService} from "../file.service";
import {NGXLogger} from "ngx-logger";

class linfo implements LineInfo {
  Draw: boolean;
  LayerName: string;
  LineType: string;
  Points: Point2D[];

  constructor(draw: boolean, layerName: string, lineType: string, points: Point2D[]) {
    this.Draw = draw;
    this.LayerName = layerName;
    this.LineType = lineType;
    this.Points = points;
  }
}

@Component({
  selector: 'app-category-chart',
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.scss']
})
export class CategoryChartComponent implements AfterViewInit, OnInit {

  dialogTitle: string;  // dialog用タイトル
  dialogMsg : string    // dialog用メッセージ
  @ViewChild('alert', {static : true}) public alertDialg: IgxDialogComponent;

  @ViewChild('form') public form: IgxDialogComponent;

  /**
   * TODO:
   * クリックポイント周辺の交点を見つける
   * 交点からのXYを基準点のXYとする
   * 基準点はポップアップウィンドウを表示し、ウィンドウ内でオフセットを設定できるようにする
   * 基準点は、基準点としてグラフに表示する
   *
   * 単なるロボットの現在位置表示なのか、基準点設定なのかを選択するボタンを設ける
   * ロボットの現在位置を常に表示する
   * ロボットの形状（姿勢）も含めて表示できればベスト
   */

  /**
   * TODO:
   * Notificationを各ステップごとに表示
   * ロボットの姿勢計算部が終了
   * 計測完了など
   */

  constructor(
    private basePS: BasePointService,
    private fileUploadService: FileService,
    private logger: NGXLogger) {
  }

  public chartType = CategoryChartType.Auto;

  // ダミー表示用データ
  private dummyData: LineInfo[] = [
    new linfo(true, "00", "Line",
      [
        {X: 110, Y: 100, x: 110, y: 100},
        {X: 100, Y: 200, x: 100, y: 200}]
    ),
  ]

  @ViewChild('airplaneShapeSeries', {static: true}) public airplaneShapeSeries: IgxScatterPolylineSeriesComponent;
  @ViewChild('airplaneSeatSeries', {static: true}) public airplaneSeatSeries: IgxScatterPolylineSeriesComponent;
  @ViewChild('seatTooltip', {static: true}) public seatTooltip: TemplateRef<object>;
  @ViewChild('combo', {read: IgxSimpleComboComponent, static: true}) public simpleCombo: IgxSimpleComboComponent;

  @ViewChild('scatterSeriesCross', {static: true}) public scatterSeriesCross: IgxScatterSeriesComponent;
  @ViewChild('scatterSeriesRobotPos', {static: true}) public scatterSeriesRobotPos: IgxScatterSeriesComponent;

  @ViewChild('drawAreaSeries', {static: true}) public drawAreaSeries;
  IgxScatterPolygonSeriesComponent


  // 計測基準点名のリスト
  BasePointList = [
    {name: "P1", msterPoint: [100.0, 101.0], measurePoint: [200.0, 201.0], id: 1, masterName: "MASTER_P1"},
    {name: "P2", msterPoint: [101.0, 101.0], measurePoint: [200.0, 201.0], id: 2, masterName: "MASTER_P2"},
    {name: "P3", msterPoint: [102.0, 101.0], measurePoint: [200.0, 201.0], id: 3, masterName: "MASTER_P3"},
  ];


  // ベースポイントの候補値
  BasePointsCrossPointData =
    [
      {points: [{x: 0, y: 0}], px: 100, py: 100},
      {points: [{x: 0, y: 0}], px: 200, py: 300},
      {points: [{x: 0, y: 0}], px: 400, py: 500},
    ]

  public selectedPointName: string;

  public selectedId: Number;
  public itemBasePointName: string;

  tmpX: number; // formのX入力値
  tmpY: number; // formのY入植地
  tmpOffsetX: number;  // formのOffsetX入力値
  tmpOffsetY: number;  // formのOffsetY入力値


  /**
   * 起動時にサービスから描画データを取得する
   */
  public ngAfterViewInit() {

    let viewData = this.dummyData.map(d => {
      return {points: [d.Points]}
    })

    this.onLoadedLineShape(viewData);

    this.tmpOffsetY = 0;
    this.tmpOffsetX = 0;

  }


  /**
   * 起動時の処理
   */
  public ngOnInit() {

    this.selectedPointName = this.BasePointList[0].name;
    this.selectedId = this.BasePointList[0].id;
    this.itemBasePointName = this.BasePointList[0].name;

    const getLines = this.fileUploadService.getLines();
    const getCross = this.fileUploadService.getCrossPoint();

    // ライン情報を取得する
    const getLinesCallbacks = {
      next: (x: any) => {
        this.dummyData = x['Item1'];
        // 画面の更新
        const viewData = this.dummyData.map(d => {
          return {points: [d.Points]}
        })
        this.onLoadedLineShape(viewData);

      },
      error: (err: Error) => {
        this.logger.debug("Error in getLines" + `${Error.name}`);

        // エラー表示
        // DXFが読み込まれていない
        this.dialogTitle = "Error in DXF";
        this.dialogMsg = "The DXF file is not loaded.";
        this.alertDialg.open();

      },
      complete: () => {
        // データ読み込み完了の表示
        this.dialogTitle ="DXF Data Read";
        this.dialogMsg = "DXF Data Read Complete.";
        this.alertDialg.open();
      }
    };

    // 交点情報を取得する
    const getCrossCallbacks = {
      next: (x: any) => {
        let crossPoints = x['Item1'];
        // 受信データの整形
        this.BasePointsCrossPointData = crossPoints.map(d => {
          return {points: [{x: 0, y: 0}], px: d.X, py: d.Y}
        });

        this.logger.debug("受信データ");
        this.logger.debug(this.BasePointsCrossPointData);
      },
      error: (err: Error) => {
        this.logger.debug("Error in getLines" + `${Error.name}`);

        // エラー表示
        // DXFが読み込まれていない
        this.dialogTitle = "Error in Cross Points";
        this.dialogMsg = "The Cross Points Data is not loaded.";
        this.alertDialg.open();
      },
      complete: () => {
        // データ読み込み完了の表示
        this.dialogTitle ="Cross Points Data Read";
        this.dialogMsg = "Cross Points Data Read Complete.";
        this.alertDialg.open();
      }
    };

    getLines.subscribe(getLinesCallbacks);
    getCross.subscribe(getCrossCallbacks);


  }

  /**
   *　描画ラインを表示
   * @param jsonData
   */
  public onLoadedLineShape(jsonData: any[]) {
    this.logger.debug('onLoadedLineShape' + `${jsonData.length}`);
    this.logger.debug(jsonData);

    this.airplaneShapeSeries.dataSource = jsonData;
    this.airplaneShapeSeries.showDefaultTooltip = true;
    this.airplaneShapeSeries.tooltipTemplate = this.seatTooltip;
  }

  public onLoadedJsonSeats(jsonData: any[]) {
    // console.log('airplane-seats.json ' + jsonData.length);
    this.airplaneSeatSeries.dataSource = jsonData;
    this.airplaneSeatSeries.showDefaultTooltip = true;
    this.airplaneSeatSeries.tooltipTemplate = this.seatTooltip;
  }

  public onLoadBasePoints(jsonData: any[]) {
    console.log("onLoadBasePoints");
    console.log(jsonData);

    this.scatterSeriesCross.dataSource = jsonData;
  }

  public onStylingShape(ev: { sender: any, args: IgxStyleShapeEventArgs }) {

    console.log(ev.args)
    ev.args.shapeOpacity = 1.0;
    ev.args.shapeStrokeThickness = 5.0;
    ev.args.shapeStroke = 'Black';

    const itemRecord = ev.args.item as any;
    if (itemRecord.class === 'First') {
      ev.args.shapeStroke = 'DodgerBlue';
    }
    if (itemRecord.class === 'Business') {
      ev.args.shapeStroke = 'LimeGreen';
    }
    if (itemRecord.class === 'Premium') {
      ev.args.shapeStroke = 'Orange';
    }
    if (itemRecord.class === 'Economy') {
      ev.args.shapeStroke = 'Red';
    }

    if (itemRecord.status === 'Sold') {
      ev.args.shapeFill = 'Gray';
    }
  }

  public onStyleLine(ev: { sender: any; args: IgxStyleShapeEventArgs }) {
    console.log(ev.args.item);
  }

  onErrorInput() {

  }

  onGetValue(sp: string) {
    // console.log("sp : "+sp);
    this.BasePointList.map(d => {
      if (d.name == sp) {
        // console.log(d);
        return d.msterPoint[0];
      } else return typeof d !== 'undefined'
    })
  }


  /**
   * 基準点の設定　formの設定ボタンを押したときの処理
   */
  formUpdate() {
    console.log(this.selectedPointName + `${this.tmpX}, ${this.tmpY}`);
    // console.log(this.tmpX);
    // console.log(this.tmpY);

    // 内部基準点データの更新
    this.BasePointList.find(d => d.name == this.selectedPointName).msterPoint[0] = this.tmpX;
    this.BasePointList.find(d => d.name == this.selectedPointName).msterPoint[1] = this.tmpY;

    // 基準点の情報をロボットへ送信する
    const masterName: string = this.BasePointList.find(d => d.name == this.selectedPointName).masterName;

    const obs = {
      next: (x: any) => {
        // 設定しましたDialogを表示する
      },
      error: (err: Error) => {
        console.log("err : " + err);
        console.log(err.message)
      },
      complete: () => {
        // フォームを閉じる
        console.log("comp")
        this.form.close();
      }
    };

    // ロボットへマスター設定値を送信
    this.basePS.setMasterPoint(masterName, this.tmpX + this.tmpOffsetX, this.tmpY + this.tmpOffsetY).subscribe(obs);
  }

  onOpening($event: IDialogCancellableEventArgs) {

  }

  /**
   * 基準点情報を取得する
   * @param $event
   */
  onOpen($event: IDialogEventArgs) {
    console.log("onOpen");
    var selItem = this.simpleCombo.value;
    var it = this.BasePointList.find(d => d.name == selItem);

    // var masterName = it.masterName; // 送信用マスター値
    //
    // var subObj = this.basePS.getMasterPoint(masterName).pipe(map((v,i)=>{
    //   this.tmpX = v['body']['X'];
    //   this.tmpY = v['body']['Y'];
    //   console.log(v);
    //   console.log(this.tmpX);
    // }));
    //
    // subObj.subscribe(x=>{});

    // this.tmpX = it.msterPoint[0];
    // this.tmpY = it.msterPoint[1];
  }

  /**
   * 基準点情報を更新する
   * @param $event
   */
  onComboChange($event: any) {
    console.log("change combo")
    var selItem = this.simpleCombo.value;
    var it = this.BasePointList.find(d => d.name == selItem);

    var masterName = it.masterName; // 送信用マスター値

    var subObj = this.basePS.getMasterPoint(masterName).pipe(map((v, i) => {
      this.tmpX = v['body']['X'];
      this.tmpY = v['body']['Y'];
      console.log(v);
      console.log(this.tmpX);
    }));

    subObj.subscribe(x => {
    });
  }

  // 交点をクリック

  seriesMouseLeftBtnDown($event: { sender: any; args: IgxDataChartMouseButtonEventArgs }) {
    let item = $event.args.item;
    console.log("seriesMouseLeftBtnDown")
    console.log(item);

    const clickX = item.px;
    const clickY = item.py;

    this.tmpX = clickX;
    this.tmpY = clickY;
    this.form.open(); // formをオープンする
  }

  plorAreaMouseLeftBtnDown($event: { sender: any; args: IgxPlotAreaMouseButtonEventArgs }) {
    let item = $event.args;
    console.log("plorAreaMouseLeftBtnDown")
    console.log($event.args);
  }
}
