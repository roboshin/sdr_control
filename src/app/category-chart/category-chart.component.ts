import {Component, OnInit, NgZone, Input, OnDestroy, Inject} from '@angular/core';
import {
  CategoryChartType,
  DataChartMouseButtonEventArgs, IgxChartMouseEventArgs,
  IgxDataChartMouseButtonEventArgs,
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
  IDialogEventArgs,
  IgxDialogComponent,
  IgxOverlayService,
  IgxSimpleComboComponent
} from "igniteui-angular";
import {LineInfo, Point2D} from "../LineInfo";
import {BasePointService} from "../BasePoint.Service";
import {map} from "rxjs/operators";
import {FileService} from "../file.service";
import {NGXLogger} from "ngx-logger";
import {logger} from "codelyzer/util/logger";
import {keyframes} from "@angular/animations";

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


  constructor(
    private basePS: BasePointService,
    private fileUploadService: FileService,
    private logger: NGXLogger,
    private _zone: NgZone,
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

  @ViewChild('airplaneShapeSeries', {static: true}) public airplaneShapeSeries: IgxScatterPolylineSeriesComponent;
  @ViewChild('airplaneSeatSeries', {static: true}) public airplaneSeatSeries: IgxScatterPolylineSeriesComponent;
  @ViewChild('seatTooltip', {static: true}) public seatTooltip: TemplateRef<object>;
  @ViewChild('combo', {read: IgxSimpleComboComponent, static: true}) public simpleCombo: IgxSimpleComboComponent;
  @ViewChild('scatterSeriesCross', {static: true}) public scatterSeriesCross: IgxScatterSeriesComponent;
  @ViewChild('scatterSeriesRobotPos', {static: true}) public scatterSeriesRobotPos: IgxScatterSeriesComponent;
  @ViewChild('drawAreaPolygon', {static: true}) public drawAreaSeries : IgxScatterPolygonSeriesComponent;
  @ViewChild('drawAreaPoint', {static: true}) public scatterDrawAreaPos: IgxScatterSeriesComponent; // 描画範囲ポリゴン表示

  // 計測基準点名のリスト
  BasePointList = [
    {name: "P1", masterPoint: [100.0, 101.0], measurePoint: [200.0, 201.0], id: 1, masterName: "MASTER_P1", updated : false},
    {name: "P2", masterPoint: [101.0, 101.0], measurePoint: [200.0, 201.0], id: 2, masterName: "MASTER_P2", updated : false},
    {name: "P3", masterPoint: [102.0, 101.0], measurePoint: [200.0, 201.0], id: 3, masterName: "MASTER_P3", updated : false},
  ];

  // ベースポイントの候補値
  BasePointsCrossPointData =
    [
      {points: [{x: 0, y: 0}], px: 100, py: 100},
      {points: [{x: 0, y: 0}], px: 200, py: 300},
      {points: [{x: 0, y: 0}], px: 400, py: 500},
    ]

  // 描画範囲設定用
  DrawPolygonPointData =
    [
      {points: [{x: 1020, y: 1000},{x:2000, y:1000}, {x:2000,y:2000}, {x:1000, y:2000}, {x:1020,y:1000}]},
    ]

  DrawPointData = [
    {x: 1020, y: 1000},{x:2000, y:1000}, {x:2000,y:2000}, {x:1000, y:2000}, {x:1020,y:1000}
  ]

  // ロボットの現在値を保持する
  public NowRobotPos =
    [
      {px:100, py:210},
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

    this.setupInterval();

    // 描画エリアの表示
    let polygonData = this.DrawPolygonPointData.map(d=>{return {points : [d.points]}})
    this.onLoadDrawAreaShap(polygonData);

    // let polygonPointData = this.DrawPolygonPointData.map(d=>d.points.slice());
    // this.onLoadedAreaPoint(polygonPointData);

    // console.log(polygonPointData);
    console.log(polygonData);
  }

  public ngOnDestroy(){
    this._interval = -1;
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

  public onLoadDrawAreaShap(jsonData : any[]){
    this.drawAreaSeries.dataSource = jsonData;
    this.drawAreaSeries.showDefaultTooltip = true;
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
    console.log("onStyleLine");
    console.log(ev.args.item);

  }

  onErrorInput() {

  }

  onGetValue(sp: string) {
    // console.log("sp : "+sp);
    this.BasePointList.map(d => {
      if (d.name == sp) {
        // console.log(d);
        return d.masterPoint[0];
      } else return typeof d !== 'undefined'
    })
  }

  /**
   * 基準点の設定　formの設定ボタンを押したときの処理
   */
  formUpdate() {
    console.log(this.selectedPointName + `${this.tmpX}, ${this.tmpY}`);

    // 内部基準点データの更新
    this.BasePointList.find(d => d.name == this.selectedPointName).masterPoint[0] = this.tmpX;
    this.BasePointList.find(d => d.name == this.selectedPointName).masterPoint[1] = this.tmpY;

    // 基準点の情報をロボットへ送信する
    const masterName: string = this.BasePointList.find(d => d.name == this.selectedPointName).masterName;
    this.BasePointList.find(d=>d.name == this.selectedPointName).updated = true;

    {
      // for debug
      this.BasePointList.forEach((value, index, array)=>{
        this.logger.debug(`updated flag ${index} : ${value.updated}`)
      })
    }

    const obs = {
      next: (x: any) => {
        // 設定しましたDialogを表示する

        this.dialogTitle = `基準点設定`;
        this.dialogMsg = `基準点${masterName}を設定しました。`;
        this.alertDialg.open();
      },
      error: (err: Error) => {
        console.log("err : " + err);
        console.log(err.message);
        this.form.close();

        this.dialogTitle = "基準点設定エラー";
        this.dialogMsg = `基準点${masterName}設定時にエラーが発生しました。`;
        this.alertDialg.open();
      },
      complete: () => {
        // フォームを閉じる
        console.log("comp")
        this.form.close();

        let flags =this.BasePointList.map(d=>d.updated);

      }
    };

    // ロボットへマスター設定値を送信
    this.basePS.setMasterPoint(masterName, this.tmpX + this.tmpOffsetX, this.tmpY + this.tmpOffsetY).subscribe(obs);

    // テスト
    console.log("test");
    this.BasePointsCrossPointData[0].px = 1000;
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

    // // マスター値をファイルから読み出す
    // var subObj = this.basePS.getMasterPoint(masterName).pipe(map((v, i) => {
    //   this.tmpX = v['body']['X'];
    //   this.tmpY = v['body']['Y'];
    //   console.log(v);
    //   console.log(this.tmpX);
    // }));
    //
    // subObj.subscribe(x => {
    // });
  }


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
      this.form.open(); // formをオープンする
    }
    else if($event.args.series.name == "ScatterSeries3"){
      // 描画エリアポイントをクリック
      // 移動先ポイントをクリックフォームを出す
    }
  }

  plorAreaMouseLeftBtnDown($event: { sender: any; args: IgxPlotAreaMouseButtonEventArgs }) {
    let item = $event.args;
    console.log("plorAreaMouseLeftBtnDown")
    console.log($event.args);
  }

  /**
   * データの再描画
   * @param $event
   */
  onRenderRequest($event:{sender: any; args: IgxRenderRequestedEventArgs}) {
    console.log("Render");
    //this.BasePointsCrossPointData[0].px = 1000;

    //this.NowRobotPos[0].px += 10;
    // this.scatterSeriesRobotPos.dataSource = this.scatterSeriesRobotPos;

  }

  onRenderNowPointRequest($event: { sender: any; args: IgxRenderRequestedEventArgs }) {

    //this.scatterSeriesRobotPos.dataSource = this.scatterSeriesRobotPos;
    // this.scatterSeriesRobotPos.dataSource = this.NowRobotPos;
/*    this.scatterSeriesRobotPos.renderSeries(true);*/
/*    this.scatterSeriesRobotPos.styleUpdated();*/

  }

  private _interval: number = -1;
  private _refreshInterval: number = 10;
  private shouldTick: boolean = true;
  // private _refreshInterval: number = 10;

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
      //console.log("tick")
      const newVal = {px:100+200, py:210};
      this.NowRobotPos.push(newVal)

      //console.log(this.NowRobotPos.length);
      this.NowRobotPos.pop()

      this.NowRobotPos[0].px += 10; // 現在地の更新
      this.scatterSeriesRobotPos.dataSource = this.NowRobotPos;


/*
      this.currValue += Math.random() * 4.0 - 2.0;
      this.currIndex++;
      const newVal = { Label: this.currIndex.toString(), Value: this.currValue };

      const oldVal = this.data[0];
      this.data.push(newVal);
      this.chart.notifyInsertItem(this.data, this.data.length - 1, newVal);
      this.data.shift();
      this.chart.notifyRemoveItem(this.data, 0, oldVal);

      this._frames++;
      const currTime = new Date();
      const elapsed = (currTime.getTime() - this._time.getTime());
      if (elapsed > 5000) {
        const fps = this._frames / (elapsed / 1000.0);
        this._time = currTime;
        this._frames = 0;
      }*/
    }
  }

  onsSriesMouseEnter($event: { sender: any; args: IgxChartMouseEventArgs }) {

    var item = $event.args.getPosition(null);
    var vscale = $event.args.chart.getActualWindowScaleVertical();
    var hscale = $event.args.chart.getActualWindowScaleHorizontal();
    var viewport = $event.args.chart.effectiveViewport;
    var pp = $event.args.series.fromWorldPosition(item);

    this.logger.debug(item);
    this.logger.debug(`${vscale} ${hscale} ${pp.x} ${pp.y}` );
    this.logger.debug(`${viewport.top} ${viewport.left} ${viewport.height} ${viewport.width}`);
  }
}
