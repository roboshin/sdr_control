import {Component, OnInit} from '@angular/core';
import {
  CategoryChartType,
  IgxDataChartMouseButtonEventArgs,
  IgxPlotAreaMouseButtonEventArgs
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
import {SharedDataService} from "../SharedData.Service";
import {FileService} from "../file.service";

class linfo implements LineInfo {
  Draw: boolean;
  LayerName: string;
  LineType: string;
  Points: Point2D[];

  constructor(draw:boolean, layerName:string, lineType:string, points:Point2D[]) {
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

  public chartType = CategoryChartType.Auto;

  // ダミー表示用データ
  private dummyData:LineInfo[] = [
    new linfo(true, "00", "Line",
      [
      {X:110,Y:100,x:110,y:100},
      {X:100,Y:200,x:100,y:200}]
    ),
  ]

  @ViewChild('airplaneShapeSeries', {static: true}) public airplaneShapeSeries: IgxScatterPolylineSeriesComponent;
  @ViewChild('airplaneSeatSeries', {static: true}) public airplaneSeatSeries: IgxScatterPolylineSeriesComponent;
  @ViewChild('seatTooltip', {static: true})  public seatTooltip: TemplateRef<object>;
  @ViewChild('combo', { read: IgxSimpleComboComponent, static: true })
  public simpleCombo: IgxSimpleComboComponent;

  // 計測基準点名のリスト
  BasePointList = [
    {name: "P1", msterPoint:[100.0,101.0], measurePoint:[200.0, 201.0], id:1, masterName: "MASTER_P1"},
    {name: "P2", msterPoint:[101.0,101.0], measurePoint:[200.0, 201.0], id:2, masterName: "MASTER_P2"},
    {name: "P3", msterPoint:[102.0,101.0], measurePoint:[200.0, 201.0], id:3, masterName: "MASTER_P3"},
  ];

  public selectedPointName : string;

  public selectedId : Number;
  public itemBasePointName: string;

  tmpX: number;
  tmpY: number;
  tmpOffsetX : number;
  tmpOffsetY : number;


  constructor(
    private basePS : BasePointService,
    private shareDataService: SharedDataService,
    private fileUploadService:FileService) {
  }

  /**
   * 起動時にサービスから描画データを取得する
   */
  public ngAfterViewInit() {

    // fetch('https://static.infragistics.com/xplatform/json/airplane-shape.json')
    //   .then((response) => response.json())
    //   .then((data) => this.onLoadedJsonShape(data));

    // this.onLoadedJsonShape(this.dummyData.map(d=>{return  {points :[ [{x:100,y:100},{x:200,y:200}]] } }));

    // this.shareDataService.sharedData$.subscribe(d=>this.shareDataService = d);
    // this.shareDataService.setData(this.dummyData);

    console.log(this.dummyData);
    var viewData = this.dummyData.map(d=>{return {points : [d.Points]}})
    this.onLoadedJsonShape(viewData);

    // //
    // fetch('https://static.infragistics.com/xplatform/json/airplane-seats.json')
    //   .then((response) => response.json())
    //   .then((data) => this.onLoadedJsonSeats(data));



    // Loadしたら、サービスからデータを取得する

    // for debug
    // dialogの表示
    this.tmpOffsetY = 0;
    this.tmpOffsetX = 0;
    this.form.open();
  }

  public ngOnInit() {
    // this.selectedPointName = this.BasePointList[0].name;
    this.selectedPointName = this.BasePointList[0].name;
    this.selectedId = this.BasePointList[0].id;

    this.itemBasePointName = this.BasePointList[0].name;

    console.log("dummy update")
    this.shareDataService.sharedData$.subscribe(sData=> {
      this.dummyData = sData;
      console.log("subscribed")
      console.log(sData);
    });
    console.log("dummy updated")
    console.log(this.dummyData);

    this.fileUploadService.getLines().subscribe(subData =>{
      this.dummyData = subData['Item1'];  // linedata
      console.log('Item1')
      console.log(this.dummyData);

      // 画面の更新
      var viewData = this.dummyData.map(d=>{return {points : [d.Points]}})
      this.onLoadedJsonShape(viewData);
    })

  }

  /**
   *
   * @param jsonData
   */
  public onLoadedJsonShape(jsonData: any[]) {
    console.log('airplane-shape.json ' + jsonData.length);
    console.log(jsonData);
    this.airplaneShapeSeries.dataSource = jsonData;

    console.log(this.airplaneShapeSeries.dataSource);

    this.airplaneShapeSeries.showDefaultTooltip = true;
    this.airplaneShapeSeries.tooltipTemplate = this.seatTooltip;
  }

  public onLoadedJsonSeats(jsonData: any[]) {
    // console.log('airplane-seats.json ' + jsonData.length);
    this.airplaneSeatSeries.dataSource = jsonData;
    this.airplaneSeatSeries.showDefaultTooltip = true;
    this.airplaneSeatSeries.tooltipTemplate = this.seatTooltip;
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
    console.log( ev.args.item);
  }

  onErrorInput() {

  }

  onGetValue(sp: string) {
    // console.log("sp : "+sp);
    this.BasePointList.map(d=>{
      if(d.name == sp){
        // console.log(d);
        return d.msterPoint[0];
      }
      else return typeof d !== 'undefined'
    })
  }


  /**
   * 基準点の設定
   */
  formUpdate() {
    console.log(this.selectedPointName);
    console.log(this.tmpX);
    console.log(this.tmpY);

    this.BasePointList.find(d=>d.name == this.selectedPointName).msterPoint[0] = this.tmpX;
    this.BasePointList.find(d=>d.name == this.selectedPointName).msterPoint[1] = this.tmpY;

    // 基準点の情報をロボットへ送信する
    var masterName:string = this.BasePointList.find(d=>d.name==this.selectedPointName).masterName;

    // ロボットへマスター設定値を送信
    this.basePS.setMasterPoint(masterName,this.tmpX+this.tmpOffsetX, this.tmpY+this.tmpOffsetY).subscribe();
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
    var it = this.BasePointList.find(d=>d.name == selItem);

    var masterName = it.masterName; // 送信用マスター値

    var subObj = this.basePS.getMasterPoint(masterName).pipe(map((v,i)=>{
      this.tmpX = v['body']['X'];
      this.tmpY = v['body']['Y'];
      console.log(v);
      console.log(this.tmpX);
    }));

    subObj.subscribe(x=>{});

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
    var it = this.BasePointList.find(d=>d.name == selItem);

    var masterName = it.masterName; // 送信用マスター値

    var subObj = this.basePS.getMasterPoint(masterName).pipe(map((v,i)=>{
      this.tmpX = v['body']['X'];
      this.tmpY = v['body']['Y'];
      console.log(v);
      console.log(this.tmpX);
    }));

    subObj.subscribe(x=>{});
  }

  seriesMouseLeftBtnDown($event: { sender: any; args: IgxDataChartMouseButtonEventArgs }) {
    let item = $event.args.item;
    console.log("seriesMouseLeftBtnDown")
    console.log(item);
  }

  plorAreaMouseLeftBtnDown($event: { sender: any; args: IgxPlotAreaMouseButtonEventArgs }) {
    let item = $event.args;
    console.log("plorAreaMouseLeftBtnDown")
    console.log(item);
  }
}
