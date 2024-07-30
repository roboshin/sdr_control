import {Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  IDialogCancellableEventArgs,
  IDialogEventArgs,
  IgxDialogComponent, IgxOverlayService,
  IgxSimpleComboComponent
} from "igniteui-angular";
import {CategoryChartType, IgxScatterPolylineSeriesComponent, IgxStyleShapeEventArgs} from "igniteui-angular-charts";
import {LineInfo, Point2D} from "../LineInfo";
import {BasePointService} from "../BasePoint.Service";
import {SharedDataService} from "../SharedData.Service";
import {FileService} from "../file.service";
import {map} from "rxjs/operators";
import {NGXLogger} from "ngx-logger";
import {any} from "codelyzer/util/function";

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
  selector: 'app-measure-base',
  templateUrl: './measure-base.component.html',
  styleUrls: ['./measure-base.component.scss']
})
export class MeasureBaseComponent implements OnInit {

  dialogTitle: string;  // dialog用タイトル
  dialogMsg : string    // dialog用メッセージ

  @ViewChild('alert', {static : true}) public alertDialg: IgxDialogComponent;
  @ViewChild('form') public form: IgxDialogComponent;

  @ViewChild('formResult') public formResult: IgxDialogComponent;   // 結果表示用フォーム

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
  // @ViewChild('seatTooltip', {static: true})  public seatTooltip: TemplateRef<object>;
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

  // Result用変数
  xResult : number;
  yResult : number;
  zResult : number;

  rxResult : number;
  ryResult : number;
  rzResult : number;
  xOffsetResult : number;
  yOffsetResult : number;

  p1Error : number;
  p2Error : number;
  p3Error : number;
  p4Error : number;

  constructor(
    private basePS : BasePointService,
    private shareDataService: SharedDataService,
    private fileUploadService:FileService,
    private logger: NGXLogger,) {
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


    // dialogの表示
    this.tmpOffsetY = 0;
    this.tmpOffsetX = 0;
    this.tmpX = 0;
    this.tmpY = 0;
    this.form.open();
  }

  public ngOnInit() {

    // 計測ポイント数を取得する
    const obs = {
      next: (x: any) => {

        // 取得回数を取得する
        this.BasePointList.splice(0); //配列を削除
        for(var i=0;i<x;i++){
          this.BasePointList.push({name: `P${i+1}`,  msterPoint:[100.0,101.0], measurePoint:[200.0, 201.0], id:1, masterName: `MASTER_P${i+1}`})
        }

        this.simpleCombo.data = this.BasePointList; // データの更新

        this.dialogTitle = `計測点数取得`;
        this.dialogMsg = `計測点を${x}回測定します`;
        this.alertDialg.open();
      },
      error: (err: Error) => {
        console.log("err : " + err);
        console.log(err.message)

        this.form.close();

      },
      complete: () => {
        // フォームを閉じる
        console.log("comp")

      }
    };

    this.basePS.getMeasurePointNumbers().subscribe(obs);

    // this.selectedPointName = this.BasePointList[0].name;
    this.selectedPointName = this.BasePointList[0].name;
    this.selectedId = this.BasePointList[0].id;

    this.itemBasePointName = this.BasePointList[0].name;

    console.log("dummy update")
    // this.shareDataService.sharedData$.subscribe(sData=> {
    //   this.dummyData = sData;
    //   console.log("subscribed")
    //   console.log(sData);
    // });
    // console.log("dummy updated")
    // console.log(this.dummyData);
    //
    // this.fileUploadService.getLines().subscribe(subData =>{
    //   this.dummyData = subData['Item1'];  // linedata
    //   console.log('Item1')
    //   // console.log(this.dummyData);
    //
    //   // 画面の更新
    //   var viewData = this.dummyData.map(d=>{return {points : [d.Points]}})
    //   this.onLoadedJsonShape(viewData);
    // })

  }

  public onLoadedJsonShape(jsonData: any[]) {
    console.log('airplane-shape.json ' + jsonData.length);
    console.log(jsonData);
    this.airplaneShapeSeries.dataSource = jsonData;

    console.log(this.airplaneShapeSeries.dataSource);

    this.airplaneShapeSeries.showDefaultTooltip = true;
    // this.airplaneShapeSeries.tooltipTemplate = this.seatTooltip;
  }

  public onLoadedJsonSeats(jsonData: any[]) {
    // console.log('airplane-seats.json ' + jsonData.length);
    this.airplaneSeatSeries.dataSource = jsonData;
    this.airplaneSeatSeries.showDefaultTooltip = true;
    // this.airplaneSeatSeries.tooltipTemplate = this.seatTooltip;
  }

  public onStylingShape(ev: { sender: any, args: IgxStyleShapeEventArgs }) {

    console.log(ev.args)
    ev.args.shapeOpacity = 1.0;
    ev.args.shapeStrokeThickness = 1.0;
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


/*  /!**
   * 計測点の設定
   *!/
  formUpdate() {
    this.logger.info(`${this.selectedPointName}, ${this.tmpX}. ${this.tmpY}`)

    this.BasePointList.find(d=>d.name == this.selectedPointName).msterPoint[0] = 0;
    this.BasePointList.find(d=>d.name == this.selectedPointName).msterPoint[1] = 0;

    // 基準点の情報をロボットへ送信する
    var masterName:string = this.BasePointList.find(d=>d.name==this.selectedPointName).name;

    const obs = {
      next:(x:any)=>{
        // console.log("next obs")
        this.dialogTitle = `基準点測定`;
        this.dialogMsg = `基準点${masterName}を測定しました。`;
        this.alertDialg.open();
      },
      error:(err:Error)=>{
        console.log("err : "+err);
        console.log(err.message)
        this.dialogTitle = `基準点測定`;
        this.dialogMsg = `基準点${masterName}を測定時にエラーは発生しました。`;
        this.alertDialg.open();
      },
      complete:()=>{
        // フォームを閉じる
        console.log("comp")
        // this.form.close();
      }
    };

    // ロボットへ測定値情報を送信する
    this.basePS.setMeasurePoint(masterName,this.tmpX+this.tmpOffsetX, this.tmpY+this.tmpOffsetY).subscribe(obs);
  }*/

  formMeasure(){

  }

  onOpening($event: IDialogCancellableEventArgs) {

  }

  /**
   * 計測点を取得する
   * @param $event
   */
  onOpen($event: IDialogEventArgs) {
    this.logger.debug(`OnOpen`)
    const selItem = this.simpleCombo.value;
    const it = this.BasePointList.find(d => d.name == selItem);

    const measureName = it.name; // 送信用マスター値

    var subObj = this.basePS.getMeasurePoint(measureName).pipe(map((v,i)=>{
      console.log(v);
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
   * 計測を開始する
   */
  onMeasure(){
    this.logger.debug(`onMeasure : ${this.simpleCombo.value}`)
    var selItem = this.simpleCombo.value;
    var it = this.BasePointList.find(d=>d.name == selItem);

    var measureName = it.name; // 送信用マスター値
/*    var subObj = this.basePS.getMeasurePoint(measureName).pipe(map((v,i)=>{
      console.log(v);
      this.tmpX = v['body']['X'];
      this.tmpY = v['body']['Y'];
      console.log(v);
      console.log(this.tmpX);
    }));*/

    const obs = {
      next:(x:any)=>{
        this.dialogTitle = `基準点測定`;
        this.dialogMsg = `基準点${measureName}を測定しました。`;
        this.alertDialg.open();
        this.tmpX = x['body']['X'];
        this.tmpY = x['body']['Y'];

        this.logger.debug(`計測値 : ${x}\n${x['body']['X']}, ${x['body']['Y']}`)
      },
      error:(err:Error)=>{
        console.log("err : "+err);
        console.log(err.message)

        this.form.close();
        this.dialogTitle = `基準点測定`;
        this.dialogMsg = `基準点${measureName}を測定時にエラーは発生しました。`;
        this.alertDialg.open();

        // if(measureName == `P3`){
        //   this.form.close();
        //   this.formResult.open();
        // }
      },
      complete:()=>{
        // フォームを閉じる
        console.log("comp")

        // if(measureName == `P3`){
        //   this.form.close();
        //   this.formResult.open();
        // }
        // this.form.close();
      }
    }

    this.basePS.getMeasurePoint(measureName).subscribe(obs);
  }

  onCalcMatrix(){
    const obs = {
      next: (x: any) => {

        console.log(x);
        this.xResult = x['body'][0];
        this.yResult = x['body'][1];
        this.zResult = x['body'][2];
        this.rxResult = x['body'][3];
        this.ryResult = x['body'][4];
        this.rzResult = x['body'][5];

        this.xOffsetResult = 0;
        this.yOffsetResult = 0;

        this.dialogTitle = `座標変換計算`;
        this.dialogMsg = `変換行列を計算しました。`;
        this.alertDialg.open();

      },
      error: (err: Error) => {
        this.dialogTitle = `座標変換計算エラー`;
        this.dialogMsg = `変換行列を計算中にエラーが発生しました.`;
        this.alertDialg.open();
      },
      complete: () => {
        this.formResult.open();

      }
    }

    this.basePS.getMeasurePoint("CALC").subscribe(obs);

    const saveFileObs = {
      next : (x:any) =>{
        this.dialogTitle = `ファイル保存`;
        this.dialogMsg = `ファイルに保存しました`;
        this.alertDialg.open();
      },
      error : (err :Error) =>{
        this.dialogTitle = `ファイル保存エラー`;
        this.dialogMsg = `ファイル保存に失敗しました`;
        this.alertDialg.open();
      },
      complete :() =>{

      }
    };

    this.basePS.saveOrgManager("dummy_file.xml").subscribe(saveFileObs);

  }

  /**
   * 計測点を更新する
   * @param $event
   */
  onComboChange($event: any) {
    console.log("change combo")
    var selItem = this.simpleCombo.value;
    var it = this.BasePointList.find(d=>d.name == selItem);

    var measureName = it.name; // 送信用マスター値

    var subObj = this.basePS.getMeasurePoint(measureName).pipe(map((v,i)=>{
      this.tmpX = v['body']['X'];
      this.tmpY = v['body']['Y'];
      console.log(v);
      console.log(this.tmpX);
    }));

    subObj.subscribe(x=>{});
  }


  // 変換係数の結果表示ダイアログ
  onResultFormOpen($event: IDialogEventArgs) {
    this.logger.debug(`Result form opend`);

    const obs = {
      next: (x: any) => {
        this.logger.debug(`Result form next`);
        this.logger.debug(`Result : ${x}`);
        console.log(x)

        this.xResult = x['body'][0];
        this.yResult = x['body'][1];
        this.zResult = x['body'][2];
        this.rxResult = x['body'][3];
        this.ryResult = x['body'][4];
        this.rzResult = x['body'][5];

        this.xOffsetResult = x['body'][6];
        this.yOffsetResult = x['body'][7];
      },
      error: (err: Error) => {
        this.logger.debug(`Result form error`);
      }
      ,
      complete: () => {
        this.logger.debug(`Result form complete`);
      }
    }

    let obsResult = this.basePS.getMatrixResult(`dummy`).subscribe(obs);

    const obsP1 = {
      next : (x : any) =>{
        let e1 = Math.sqrt(x['body'][0]*x['body'][0]+x['body'][1]*x['body'][1]);
        this.p1Error = e1;
      },
      error : (err : Error) => {
        this.logger.debug('Result P1 error')
      },
      complete : () =>{
        this.logger.debug('Result P1 Complete')
      }
    }

    const obsP2 = {
      next : (x : any) =>{
        let e1 = Math.sqrt(x['body'][0]*x['body'][0]+x['body'][1]*x['body'][1]);
        this.p2Error = e1;
      },
      error : (err : Error) => {
        this.logger.debug('Result P1 error')
      },
      complete : () =>{
        this.logger.debug('Result P1 Complete')
      }
    }
    const obsP3 = {
      next : (x : any) =>{
        let e1 = Math.sqrt(x['body'][0]*x['body'][0]+x['body'][1]*x['body'][1]);
        this.p3Error = e1;
      },
      error : (err : Error) => {
        this.logger.debug('Result P1 error')
      },
      complete : () =>{
        this.logger.debug('Result P1 Complete')
      }
    }

    const obsP4 = {
      next : (x : any) =>{
        let e1 = Math.sqrt(x['body'][0]*x['body'][0]+x['body'][1]*x['body'][1]);
        this.p4Error = e1;
      },
      error : (err : Error) => {
        this.logger.debug('Result P1 error')
      },
      complete : () =>{
        this.logger.debug('Result P1 Complete')
      }
    }

    let obsResultP1 = this.basePS.getP1Error('P1').subscribe(obsP1);
    let obsResultP2 = this.basePS.getP1Error('P2').subscribe(obsP2);
    let obsResultP3 = this.basePS.getP1Error('P3').subscribe(obsP3);
    let obsResultP4 = this.basePS.getP1Error('P4').subscribe(obsP4);
  }
}

