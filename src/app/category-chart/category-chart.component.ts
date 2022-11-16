import { Component } from '@angular/core';
import { CategoryChartType } from 'igniteui-angular-charts';
import { AfterViewInit, TemplateRef, ViewChild, ElementRef } from "@angular/core";
import { IgxStyleShapeEventArgs } from "igniteui-angular-charts";
import { IgxScatterPolylineSeriesComponent } from "igniteui-angular-charts";

@Component({
  selector: 'app-category-chart',
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.scss']
})
export class CategoryChartComponent implements AfterViewInit{

  public chartType = CategoryChartType.Auto;

  data = [
    { CountryName: 'China', Pop1995: 1216, Pop2005: 1297, },
    { CountryName: 'India', Pop1995: 920, Pop2005: 1090, },
    { CountryName: 'United States', Pop1995: 266, Pop2005: 295, },
    { CountryName: 'Indonesia', Pop1995: 197, Pop2005: 229, },
    { CountryName: 'Brazil', Pop1995: 161, Pop2005: 186, }
  ];


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

  public ngAfterViewInit() {

    fetch('https://static.infragistics.com/xplatform/json/airplane-shape.json')
      .then((response) => response.json())
      .then((data) => this.onLoadedJsonShape(data));

    fetch('https://static.infragistics.com/xplatform/json/airplane-seats.json')
      .then((response) => response.json())
      .then((data) => this.onLoadedJsonSeats(data));
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

  public clickEvemt(event){
    console.log(event)
  }

  public onStyleLine(ev: { sender: any; args: IgxStyleShapeEventArgs }) {

  }
}
