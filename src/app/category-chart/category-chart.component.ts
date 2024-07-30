import {Component, OnInit, NgZone, Input, OnDestroy, Inject} from '@angular/core';
import {
  CategoryChartType,
  DataChartMouseButtonEventArgs, IgxChartMouseEventArgs,
  IgxDataChartMouseButtonEventArgs, IgxNumericYAxisComponent,
  IgxPlotAreaMouseButtonEventArgs,
  IgxRenderRequestedEventArgs,
  IgxScatterPolygonSeriesComponent,
  IgxScatterSeriesComponent
} from 'igniteui-angular-charts';
import {AfterViewInit, TemplateRef, ViewChild, ElementRef} from "@angular/core";
import {IgxStyleShapeEventArgs} from "igniteui-angular-charts";
import {IgxScatterPolylineSeriesComponent} from "igniteui-angular-charts";
import {
  IDialogCancellableEventArgs,
  IDialogEventArgs, IgxButtonModule,
  IgxDialogComponent,
  IgxOverlayService,
  IgxSimpleComboComponent, ISimpleComboSelectionChangingEventArgs
} from "@infragistics/igniteui-angular";
import {LineInfo, Point2D} from "../LineInfo";
import {BasePointService} from "../BasePoint.Service";
import {FileService} from "../file.service";
import {NGXLogger} from "ngx-logger";
import { ButtonGroupAlignment } from '@infragistics/igniteui-angular';
import {RobotInfoService} from "../robotInfo.service";
import {BasePoint, DxfChartDatas,  } from "../draw-point-data";
import {DrawLineDatas} from "../draw-line-datas";
import {CrossPointDatas} from "../cross-point-datas";
import {Point2D_Ts} from "../point2d_-ts";
import {DrawAreaPolygon} from "../draw-area-polygon";

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

  constructor(
    private basePS: BasePointService,
    private fileUploadService: FileService,
    private logger: NGXLogger,
    private _zone: NgZone,
    private robotInfo : RobotInfoService,
    @Inject(IgxOverlayService) public overlayService: IgxOverlayService) {
  }

  public chartType = CategoryChartType.Auto;


  private dummyData : DrawLineDatas;

  @ViewChild('alert', {static : true}) public alertDialog: IgxDialogComponent;
  @ViewChild('form') public form: IgxDialogComponent;

  @ViewChild('form_p_num_input') public form_p_num_input : IgxDialogComponent;  // P点数入力フォーム

  @ViewChild('drawDxfLineSeries', {static: true}) public drawDxfLineSeries: IgxScatterPolylineSeriesComponent;
  @ViewChild('airplaneSeatSeries', {static: true}) public airplaneSeatSeries: IgxScatterPolylineSeriesComponent;
  @ViewChild('seatTooltip', {static: true}) public seatTooltip: TemplateRef<object>;
  @ViewChild('combo', {read: IgxSimpleComboComponent, static: true}) public simpleCombo: IgxSimpleComboComponent;
  @ViewChild('scatterSeriesCross', {static: true}) public scatterSeriesCross: IgxScatterSeriesComponent;
  @ViewChild('scatterSeriesRobotPos', {static: true}) public scatterSeriesRobotPos: IgxScatterSeriesComponent;
  @ViewChild('drawAreaPolygon', {static: true}) public drawAreaSeries : IgxScatterPolygonSeriesComponent;
  @ViewChild('drawAreaPoint', {static: true}) public scatterDrawAreaPos: IgxScatterSeriesComponent; // 描画範囲ポリゴン表示
  @ViewChild('xAxis', {static : true}) public xAxis : IgxNumericYAxisComponent; // X軸
  @ViewChild('yAxis', {static: true}) public yAxis : IgxNumericYAxisComponent;  // Y軸
  @ViewChild('scatterMasterPoint', {static : true}) public scatterMasterPoint : IgxScatterSeriesComponent;  // 基準点表示用

  // グラフに関するデータ
  chartDatas : DxfChartDatas = new DxfChartDatas(this.logger);

  // ロボットの現在値を保持する
  public NowRobotPos =
    [
      {px:100, py:210},
    ]

  public selectedPointName: string;

  public selectedId: Number;
  public itemBasePointName: string;

  public alignment = ButtonGroupAlignment.horizontal;

  tmpX: number; // formのX入力値
  tmpY: number; // formのY入植地
  tmpOffsetX: number;  // formのOffsetX入力値
  tmpOffsetY: number;  // formのOffsetY入力値

  selected: string;
  drawAreaSelected: any;

  // 描画範囲設定用クラス
  public drawAreaPolygon : DrawAreaPolygon = new DrawAreaPolygon();

  /**
   * 起動時にサービスから描画データを取得する
   */
  public ngAfterViewInit() {

    this.drawAreaPolygon.polygonPointsList = new Array<Point2D_Ts>();
    this.tmpOffsetY = 0;
    this.tmpOffsetX = 0;

    this.setupInterval();

    // 描画エリアの表示

    console.log("polygonData");
    // console.log(polygonData);
    console.log(this.chartDatas.DrawPolygonPointData);
    this.onLoadDrawAreaShap(this.chartDatas.DrawPolygonPointData);
  }

  public ngOnDestroy(){
    this._interval = -1;
  }


  /**
   * 起動時の処理
   */
  public async ngOnInit() {
    const bPinit = this.chartDatas.getBasePointFromNumber(0); // 0番目の基準点データを取得する
    console.log(bPinit);
    this.selectedPointName = bPinit.Name;  // 初期ComboboxをP1とする
    this.selectedId = bPinit.ID;
    this.itemBasePointName = bPinit.Name;

    const getLines = this.fileUploadService.getLines(); // サーバからラインを取得する
    const getCross = this.fileUploadService.getCrossPoint();  // サーバから交点情報を取得する


    // ライン情報を取得する
    const getLinesCallbacks = {
      next: (x: DrawLineDatas) => {
        console.log(x);
        this.dummyData = x;

        // 画面の更新

        // const viewData = this.dummyData.map(d => {return {points: [d.Points]}})
        const viewData = this.dummyData.lineList.map(d=>d.points);
        const values = viewData.values();

        // DXFライン表示用のデータ形式に変換する
        let pointList :Array<{points: Array< Array<{x:number; y:number;}>>}> = [
            // {
            //   points: [
            //     [{x: 1020, y: 1000}, {x: 2000, y: 1000}, {x: 2000, y: 2000}, {x: 1000, y: 2000}, {x: 1020, y: 1000}],
            //     [{x: 5000, y: 5000}, {x: 6000, y: 6000}]
            //   ]
            // },
        ];

        // web経由で取得したデータを表示可能な形式に変換する
        for(const v of values){
          let pp ={points: [v.map(d=>({x:d.x,y:d.y}))]};
          pointList.push(pp);
        }

        // 描画対象ラインを表示
        this.onLoadedLineShape(pointList);
      },
      error: (err: Error) => {
        this.logger.debug("Error in getLines" + `${Error.name}`);

        // エラー表示
        // DXFが読み込まれていない
        this.dialogTitle = "Error in DXF";
        this.dialogMsg = "The DXF file is not loaded.";
        this.alertDialog.open();

      },
      complete: () => {
        // データ読み込み完了の表示
        this.dialogTitle = "DXF Data Read";
        this.dialogMsg = "DXF Data Read Complete.";
        this.alertDialog.open();
      }
    };

    // 交点情報を取得する
    const getCrossCallbacks = {
      next: (x: CrossPointDatas) => {
        console.log(x);
        let crossPoints = x;
        // 受信データの整形
        // this.chartDatas.BasePointsCrossPointData = crossPoints.map(d => {
        //   return { px: d.X, py: d.Y}
        // });
        // let cp = x.pointList.map(d=>  ({x:d.point.x, y:d.point.y}))
        let cp = x.pointList.map(d=> ({Point2D : ({X:d.point.x, Y:d.point.y}) }));
        this.chartDatas.BasePointsCrossPointData = cp;

        this.logger.debug("受信データ");

        this.logger.debug(this.chartDatas.BasePointsCrossPointData);
      },
      error: (err: Error) => {
        this.logger.debug("Error in getLines" + `${Error.name}`);

        // エラー表示
        // DXFが読み込まれていない
        this.dialogTitle = "Error in Cross Points";
        this.dialogMsg = "The Cross Points Data is not loaded.";
        this.alertDialog.open();
      },
      complete: () => {
        // データ読み込み完了の表示
        this.dialogTitle = "Cross Points Data Read";
        this.dialogMsg = "Cross Points Data Read Complete.";
        this.alertDialog.open();
      }
    };

    const getMasterPointsObc = {
      next : (x : any) =>{

      },
      error:(err:Error)=>{

      },
      complete : ()=>{

      }
    }

    await getLines.subscribe(getLinesCallbacks);  // 描画線の取得
    await getCross.subscribe(getCrossCallbacks);  // 交点情報の取得
  }

  /**
   *　描画ラインを表示
   * @param jsonData
   */
  public onLoadedLineShape(jsonData: Array<{points: Array< Array<{x:number; y:number;}>>}> ) {
    console.log(jsonData);
    this.logger.debug('onLoadedLineShape' + `${jsonData.length}`);
    this.logger.debug(jsonData);

    this.drawDxfLineSeries.dataSource = jsonData;
    this.drawDxfLineSeries.showDefaultTooltip = true;
    this.drawDxfLineSeries.tooltipTemplate = this.seatTooltip;
  }

  public onLoadDrawAreaShap(jsonData : any[]){
    this.drawAreaSeries.dataSource = jsonData;
    this.drawAreaSeries.showDefaultTooltip = true;
  }

  public onLoadedJsonSeats(jsonData: any[]) {
    this.airplaneSeatSeries.dataSource = jsonData;
    this.airplaneSeatSeries.showDefaultTooltip = true;
    this.airplaneSeatSeries.tooltipTemplate = this.seatTooltip;
  }

  public onLoadBasePoints(jsonData: any[]) {
    console.log("onLoadBasePoints");
    console.log(jsonData);

    this.scatterSeriesCross.dataSource = jsonData;
  }

  /**
   * 描画範囲ポリゴンを表示擦る
   * @param jsonData
   */
  public onLoadedAreaShap(jsonData : any[]){
    this.drawAreaSeries.dataSource = jsonData;
    this.drawAreaSeries.showDefaultTooltip = true;
  }

  /**
   * 描画エリアポリゴンを表示擦る
   * @param jsonData
   */
  public onLoadedAreaPoint(jsonData : any[]){
    this.scatterDrawAreaPos.dataSource = jsonData;
    this.scatterDrawAreaPos.showDefaultTooltip = true;
  }

  public onStylingShape(ev: { sender: any, args: IgxStyleShapeEventArgs }) {

    console.log(ev.args)
    ev.args.shapeOpacity = 1.0;
    ev.args.shapeStrokeThickness = 5.0;
    ev.args.shapeStroke = 'Black';

    const itemRecord = ev.args.item as any;

    console.log(itemRecord);


    if (itemRecord.class === 'Business') {
      ev.args.shapeStroke = 'LimeGreen';
    }
    else if (itemRecord.class === 'Premium') {
      ev.args.shapeStroke = 'Orange';
    }
    else if (itemRecord.class === 'Economy') {
      ev.args.shapeStroke = 'Red';
    }
    else if (itemRecord.status === 'Sold') {
      ev.args.shapeFill = 'Gray';
    }
  }

  public onStyleLine(ev: { sender: any; args: IgxStyleShapeEventArgs }) {
    console.log("onStyleLine");
    console.log(ev.args.item);
  }

  // onErrorInput() {
  //
  // }

  // onGetValue(sp: string) {
  //   // console.log("sp : "+sp);
  //   this.chartDatas.BasePointList.map(d => {
  //     if (d.name == sp) {
  //       // console.log(d);
  //       return d.masterPoint[0];
  //     } else return typeof d !== 'undefined'
  //   })
  // }

  /**
   * 基準点の設定　formの設定ボタンを押したときの処理
   */
  formUpdate() {
    console.log(this.selectedPointName + `${this.tmpX}, ${this.tmpY}`);

    // 選択されている基準点名称を取得する
    var bP = this.chartDatas.getBasePointFromName(this.selectedPointName);

    // 基準点値の更新
    bP.MasterPoint.X = this.tmpX;
    bP.MasterPoint.Y = this.tmpY;

    this.scatterMasterPoint.dataSource = this.chartDatas.getBaseMasterPoints();

    bP.Updated = true;
    const masterName:string = bP.MasterName;

    const obs = {
      next: (x: any) => {
        // 設定しましたDialogを表示する

        this.dialogTitle = `基準点設定`;
        this.dialogMsg = `基準点${masterName}を設定しました。`;
        this.alertDialog.open();

        // 設定されたポイント値を更新する
      },
      error: (err: Error) => {
        console.log("err : " + err);
        console.log(err.message);
        this.form.close();

        this.dialogTitle = "基準点設定エラー";
        this.dialogMsg = `基準点${masterName}設定時にエラーが発生しました。`;
        this.alertDialog.open();
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



  /**
   * 基準点情報を取得する
   * @param $event
   */
  onOpen($event: IDialogEventArgs) {
    console.log("onOpen");
    var selItem = this.simpleCombo.value;
    // var it = this.chartDatas.BasePointList.find(d => d.name == selItem);
  }

  /**
   * 基準点情報を更新する
   * @param $event
   */
  onComboChange($event: any) {
    console.log("change combo")

  }


  /**
   * マウス左ボタン処理
   * @param $event
   */
  seriesMouseLeftBtnDown($event: { sender: any; args: IgxDataChartMouseButtonEventArgs }) {
    let item = $event.args.item;
    console.log("seriesMouseLeftBtnDown")
    console.log(item);

    // 交点表示の場合
    if($event.args.series.name == "ScatterSeries1") {
      const clickX = item.px;
      const clickY = item.py;

      this.tmpX = clickX;
      this.tmpY = clickY;
      this.form.open(); // formをオープンする　交点をクリックした場合
    }
    else if($event.args.series.name == "ScatterSeries3"){
      // 描画エリアポイントをクリック
      // 移動先ポイントをクリックフォームを出す
    }
  }

  // プロットエリアでマウスの左クリックされた時の処理
  plorAreaMouseLeftBtnDown($event: { sender: any; args: IgxPlotAreaMouseButtonEventArgs })
  {
    var item = $event.args.chartPosition;

    var unscaleX = this.xAxis.unscaleValue(item.x);
    var unscaleY = this.yAxis.unscaleValue(item.y);
    this.logger.debug(`${unscaleX}, ${unscaleY}`);
    this.logger.debug(`${this.selected}`)

    if(this.selected == "basePointMode")
    {
      // 基準点を設定
      this.logger.debug(`selected : basePointSelected`);
      this.tmpX = unscaleX;
      this.tmpY = unscaleY;
      this.form.open();
    }
    else if(this.selected == "drawRangeMode")
    {
      // 描画範囲が選択された場合
      let px = unscaleX;  // クリックされたDXF上の座標値
      let py = unscaleX;  // クリックされたDXF上の座標値

      this.chartDatas.DrawPointData.push({Point2D : {X: unscaleX, Y: unscaleY}});
      console.log(`${this.chartDatas.DrawPointData}`);
      this.scatterDrawAreaPos.dataSource = this.chartDatas.DrawPointData;

      if(this.chartDatas.DrawPolygonPointData.length == 0){
        this.logger.debug("points is not exist");
        this.chartDatas.DrawPolygonPointData.push({points: [[]]});
      }

      // polylineの要素数を計算する
      var numOfPoints = this.chartDatas.DrawPolygonPointData[0].points[0].length;
      this.logger.debug(`numOfPoints : ${numOfPoints}`)

      if(numOfPoints > 1){
        // データの終点を一旦削除する
        var lastData = this.chartDatas.DrawPolygonPointData[0].points[0].pop();
        this.chartDatas.DrawPolygonPointData[0].points[0].push({x:unscaleX, y:unscaleY});
        this.chartDatas.DrawPolygonPointData[0].points[0].push(lastData);
        console.log(this.chartDatas.DrawPolygonPointData);
      }
      else if(numOfPoints == 0){
        this.chartDatas.DrawPolygonPointData[0].points[0].push({x:unscaleX, y:unscaleY});
        this.chartDatas.DrawPolygonPointData[0].points[0].push({x:unscaleX, y:unscaleY});
      }
      else {
        this.chartDatas.DrawPolygonPointData[0].points[0].push({x: unscaleX, y: unscaleY});
      }

      // this.chartDatas.DrawPolygonPointDataデータをサーバ送信用データに変換する


      // polylineを更新する
      // 描画エリアの表示
      this.onLoadDrawAreaShap(this.chartDatas.DrawPolygonPointData);

    }
  }

  private _interval: number = -1;
  private _refreshInterval: number = 10;
  private shouldTick: boolean = true;

  /**
   *
   * @private
   */
  private setupInterval(): void {
    if (this._interval >= 0) {
      this._zone.runOutsideAngular(() => {
        window.clearInterval(this._interval);
      });
      this._interval = -1;
    }

    this._zone.runOutsideAngular(() => {
      this._interval = window.setInterval(() => this.tick(),
        this._refreshInterval);
    });
  }

  /**
   *
   * @private
   */
  private tick(): void {

    if (this.shouldTick) {
      // ロボット現在値を取得する

    }
  }

  onsSriesMouseEnter($event: { sender: any; args: IgxChartMouseEventArgs }) {

  }

  // 描画範囲クリアボタンが押された時の処理
  drawAreaClear($event: any)
  {
    this.chartDatas.DrawPointData = [];
    this.chartDatas.DrawPolygonPointData = [];
    // console.log(`${this.chartDatas.DrawPolygonPointData}`)

    this.onLoadDrawAreaShap(this.chartDatas.DrawPolygonPointData);
  }

  /**
   * 描画範囲設定
   * @param $event
   */
  drawAreaSet($event: any) {
    this.logger.log("drawAreaSet function");

    const setAreaObs = {
      next: (x: any) => {

      },
      error: (err: Error) => {
        this.logger.debug("Error in drawAreaSet" + `${Error.name}`);

        // エラー表示
        // DXFが読み込まれていない
        this.dialogTitle = "Error in drawAreaSet";
        this.dialogMsg = "Failed to set DrawAreaPoints";
        this.alertDialog.open();
      },
      complete: () => {
        // データ読み込み完了の表示
        this.dialogTitle = "Draw Area Points";
        this.dialogMsg = "Set Draw Area Points are Successed.";
        this.alertDialog.open();
      }
    };

    // this.basePS.setDrawAreaPoints("all", this.chartDatas).subscribe(setAreaObs);

    // サーバ送信用でーたを作成する
    var tmpPolygon = new DrawAreaPolygon();

    for (var cnt=0;cnt<this.chartDatas.DrawPolygonPointData[0].points[0].length;cnt++){
      let tmpPoint = new Point2D_Ts();
      tmpPoint.x = this.chartDatas.DrawPolygonPointData[0].points[0][cnt].x;
      tmpPoint.y = this.chartDatas.DrawPolygonPointData[0].points[0][cnt].y;

      this.logger?.info(`write point : ${tmpPoint.x}, ${tmpPoint.y}`)

      this.drawAreaPolygon.polygonPointsList.push(tmpPoint);
    }

    // var a = this.chartDatas
    this.basePS.setDrawAreaPointsFromList(this.drawAreaPolygon).subscribe(setAreaObs);


  }

  comboSelectionChangeing($event: ISimpleComboSelectionChangingEventArgs) {

  }

  // P座標値の個数を設定するボタンを押した場合の処理
  buttonSetP_numbers($event: any) {
    this.logger.log("buttonSetP_numbers function start");

    // Pの個数を入力するフォームをOpenする
    this.form_p_num_input.open();
  }

  p_numbers: any; // P点の個数を入力
  // P点入力フォームが平板場合の処理

  onOpen_p_num_input($event: IDialogEventArgs) {
    this.logger.log("p number input form open");
  }


  /**
   * P点の数をCombo表示用データとして更新する
   */
  p_num_input_SetNumber() {

    // データにP点数を設定する
    this.chartDatas.clearBasePoint();

    for (var i=0;i<this.p_numbers;i++) {
      this.chartDatas.setBasePoint(`P${i+1}`, 0,0,i+1);
    }

    this.simpleCombo.data = this.chartDatas.BasePointList;

    // 使用するPの個数をPCに通知する
    const setPnumbersObs = {
      next:(x:any) =>{

      },
      error : (err:Error) =>{
        // エラー表示
        this.dialogTitle = "Error in Set P numbers";
        this.dialogMsg = "Failed to Set P numbers";
        this.alertDialog.open();
      },
      complete:() =>{
        this.dialogTitle = "Success in Set P numbers";
        this.dialogMsg = "Success to Set P numbers";
        this.alertDialog.open();
      }
    };

    this.basePS.setMasterPointNumbers(this.p_numbers).subscribe(setPnumbersObs);

    this.form_p_num_input.close();
  }
}
