import { Component } from '@angular/core';
import { CategoryChartType } from 'igniteui-angular-charts';
import { AfterViewInit, TemplateRef, ViewChild, ElementRef } from "@angular/core";
import { IgxStyleShapeEventArgs } from "igniteui-angular-charts";
import { IgxScatterPolylineSeriesComponent } from "igniteui-angular-charts";
import {IgxDialogComponent} from "igniteui-angular";

@Component({
  selector: 'app-category-chart',
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.scss']
})
export class CategoryChartComponent implements AfterViewInit{

  @ViewChild('form') public form:IgxDialogComponent;
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

  // data = [
  //   { CountryName: 'China', Pop1995: 1216, Pop2005: 1297, },
  //   { CountryName: 'India', Pop1995: 920, Pop2005: 1090, },
  //   { CountryName: 'United States', Pop1995: 266, Pop2005: 295, },
  //   { CountryName: 'Indonesia', Pop1995: 197, Pop2005: 229, },
  //   { CountryName: 'Brazil', Pop1995: 161, Pop2005: 186, }
  // ];

  @ViewChild('airplaneShapeSeries', {static: true})
  public airplaneShapeSeries: IgxScatterPolylineSeriesComponent;
  //
  @ViewChild('airplaneSeatSeries', { static: true })
  public airplaneSeatSeries: IgxScatterPolylineSeriesComponent;
  //
  @ViewChild('seatTooltip', { static: true })
  public seatTooltip: TemplateRef<object>;

  constructor() {
  }

  /**
   * 起動時にサービスから描画データを取得する
   */
  public ngAfterViewInit() {

    fetch('https://static.infragistics.com/xplatform/json/airplane-shape.json')
      .then((response) => response.json())
      .then((data) => this.onLoadedJsonShape(data));

    fetch('https://static.infragistics.com/xplatform/json/airplane-seats.json')
      .then((response) => response.json())
      .then((data) => this.onLoadedJsonSeats(data));

    // Loadしたら、サービスからデータを取得する

    // for debug
    // dialogの表示
    this.form.open();
  }

  public onLoadedJsonShape(jsonData: any[]) {
    // console.log('airplane-shape.json ' + jsonData.length);
    this.airplaneShapeSeries.dataSource = jsonData;
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

  }
}
