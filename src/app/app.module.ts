import 'hammerjs';

import {
    IgxButtonGroupModule, IgxButtonModule, IgxDragDropModule, IgxDropDownModule, IgxLayoutModule,
    IgxNavbarModule, IgxNavigationDrawerModule, IgxRippleModule, IgxSelectModule, IgxSliderModule,
    IgxToggleModule
} from 'igniteui-angular';
import {
    IgxCategoryChartModule, IgxDataChartCoreModule, IgxDataChartInteractivityModule,
    IgxDataChartScatterModule, IgxDataChartShapeCoreModule, IgxDataChartShapeModule, IgxLegendModule
} from 'igniteui-angular-charts';
import { IgxRadialGaugeModule } from 'igniteui-angular-gauges';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CategoryChartComponent } from './category-chart/category-chart.component';
import { IgxCategoryChartModule } from 'igniteui-angular-charts';
import { SelectComponent } from './select/select.component';
import { IgxDataChartCoreModule, IgxDataChartShapeModule, IgxDataChartShapeCoreModule, IgxLegendModule, IgxDataChartInteractivityModule, IgxDataChartScatterModule } from "igniteui-angular-charts";
import { CommonModule } from "@angular/common";
import { RadialGaugeComponent } from './radial-gauge/radial-gauge.component';
import { IgxRadialGaugeModule } from 'igniteui-angular-gauges';
import { FileService } from "./file.service";
import { HttpClientModule } from '@angular/common/http';
import { DropDownComponent } from './drop-down/drop-down.component';
import { FileService } from './file.service';
import { HomeComponent } from './home/home.component';
import { ManualMovesdrComponent } from './manual-movesdr/manual-movesdr.component';
import { RadialGaugeComponent } from './radial-gauge/radial-gauge.component';
import {
    ReferencepointMeasureComponent
} from './referencepoint-measure/referencepoint-measure.component';
import { SelectComponent } from './select/select.component';
import { SvgViewComponent } from './svg-view/svg-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CategoryChartComponent,
    SelectComponent,
    RadialGaugeComponent,
    DropDownComponent,
    SvgViewComponent,
    ReferencepointMeasureComponent,
    ManualMovesdrComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    AppRoutingModule,
    IgxLayoutModule,
    IgxNavbarModule,
    IgxNavigationDrawerModule,
    IgxRippleModule,
    IgxCategoryChartModule,
    IgxSelectModule,
    IgxButtonModule,
    IgxToggleModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    IgxDataChartCoreModule,
    IgxDataChartShapeModule,
    IgxDataChartShapeCoreModule,
    IgxLegendModule,
    IgxDataChartInteractivityModule,
    IgxDataChartScatterModule,
    IgxRadialGaugeModule,
    HttpClientModule,
    IgxDropDownModule,
    IgxButtonGroupModule,
    IgxDragDropModule,
    IgxSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [],
  schemas: []
})
export class AppModule {
}
