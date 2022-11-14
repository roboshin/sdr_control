import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxButtonGroupModule,IgxLayoutModule, IgxNavbarModule, IgxNavigationDrawerModule, IgxRippleModule, IgxSelectModule, IgxButtonModule, IgxToggleModule, IgxDropDownModule } from 'igniteui-angular';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CategoryChartComponent,
    SelectComponent,
    RadialGaugeComponent,
    DropDownComponent
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
    IgxButtonGroupModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [],
  schemas: []
})
export class AppModule {
}
