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
  IgxSimpleComboComponent
} from "igniteui-angular";
import {LineInfo, Point2D} from "../LineInfo";
import {BasePointService} from "../BasePoint.Service";
import {FileService} from "../file.service";
import {NGXLogger} from "ngx-logger";
import { ButtonGroupAlignment } from 'igniteui-angular';
import {RobotInfoService} from "../robotInfo.service";
import {DxfChartDatas} from "../draw-point-data";
import {logger} from "codelyzer/util/logger";

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

  // ダミー表示用データ
  private dummyData: LineInfo[] = [
    new linfo(true, "00", "Line",
      [
        {X: 110, Y: 100, x: 110, y: 100},
        {X: 100, Y: 200, x: 100, y: 200}]
    ),
  ]

  @ViewChild('alert', {static : true}) public alertDialog: IgxDialogComponent;
  @ViewChild('form') public form: IgxDialogComponent;
  @ViewChild('airplaneShapeSeries', {static: true}) public airplaneShapeSeries: IgxScatterPolylineSeriesComponent;
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

    this.selectedPointName = this.chartDatas.BasePointList[0].name;  // 初期ComboboxをP1とする
    this.selectedId = this.chartDatas.BasePointList[0].id;
    this.itemBasePointName = this.chartDatas.BasePointList[0].name;

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
      next: (x: any) => {
        let crossPoints = x['Item1'];
        // 受信データの整形
        this.chartDatas.BasePointsCrossPointData = crossPoints.map(d => {
          return { px: d.X, py: d.Y}
        });

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

    await getLines.subscribe(getLinesCallbacks);  // 描画線の取得
    await getCross.subscribe(getCrossCallbacks);  // 交点情報の取得
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

    // 内部基準点データの更新
    this.chartDatas.BasePointList.find(d => d.name == this.selectedPointName).masterPoint[0] = this.tmpX;
    this.chartDatas.BasePointList.find(d => d.name == this.selectedPointName).masterPoint[1] = this.tmpY;

    // グラフ表示用データを更新する
    this.chartDatas.BaseMasterPointData.find(d=>d.name == this.selectedPointName).Point2D.X = this.tmpX;
    this.chartDatas.BaseMasterPointData.find(d=>d.name == this.selectedPointName).Point2D.Y = this.tmpY;

    this.scatterMasterPoint.dataSource = this.chartDatas.BaseMasterPointData;

    // 基準点の情報をロボットへ送信する
    const masterName: string = this.chartDatas.BasePointList.find(d => d.name == this.selectedPointName).masterName;
    this.chartDatas.BasePointList.find(d=>d.name == this.selectedPointName).updated = true;

    {
      // for debug
      this.chartDatas.BasePointList.forEach((value, index, array)=>{
        this.logger.debug(`updated flag ${index} : ${value.updated}`)
      })
    }

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

        let flags =this.chartDatas.BasePointList.map(d=>d.updated);

      }
    };

    // ロボットへマスター設定値を送信
    this.basePS.setMasterPoint(masterName, this.tmpX + this.tmpOffsetX, this.tmpY + this.tmpOffsetY).subscribe(obs);
  }

  // onOpening($event: IDialogCancellableEventArgs) {
  //
  // }

  /**
   * 基準点情報を取得する
   * @param $event
   */
  onOpen($event: IDialogEventArgs) {
    console.log("onOpen");
    var selItem = this.simpleCombo.value;
    var it = this.chartDatas.BasePointList.find(d => d.name == selItem);
  }

  /**
   * 基準点情報を更新する
   * @param $event
   */
  onComboChange($event: any) {
    console.log("change combo")
    // var selItem = this.simpleCombo.value;
    // var it = this.chartDatas.BasePointList.find(d => d.name == selItem);
    //
    // var masterName = it.masterName; // 送信用マスター値
    //
    // // // マスター値をファイルから読み出す
    // // var subObj = this.basePS.getMasterPoint(masterName).pipe(map((v, i) => {
    // //   this.tmpX = v['body']['X'];
    // //   this.tmpY = v['body']['Y'];
    // //   console.log(v);
    // //   console.log(this.tmpX);
    // // }));
    // //
    // // subObj.subscribe(x => {
    // // });
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
      // // ロボット現在値を取得する
      // const rinfo = this.robotInfo.getRobotInfo();
      //
      // const rinfoObs = {
      //   next: (x: any) => {
      //     // ロボット現在値
      //     var nowX = x["NowMeasurePoint3D"]['X'];
      //     var nowY = x["NowMeasurePoint3D"]['Y'];
      //     var nowZ = x["NowMeasurePoint3D"]['Z'];
      //
      //     this.NowRobotPos[0].px = nowX;
      //     this.NowRobotPos[0].py = nowY;
      //
      //     this.scatterSeriesRobotPos.dataSource = this.NowRobotPos;
      //
      //   },
      //   error: (err: Error) => {
      //
      //   },
      //   complete: () => {
      //
      //   },
      // }
      // rinfo.subscribe(rinfoObs);
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

    this.basePS.setDrawAreaPoints("all", this.chartDatas).subscribe(setAreaObs);
  }
}
