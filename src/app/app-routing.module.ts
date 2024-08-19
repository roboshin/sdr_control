import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { PageNotFoundComponent } from './error-routing/not-found/not-found.component';
import { UncaughtErrorComponent } from './error-routing/error/uncaught-error.component';
import { ErrorRoutingModule } from './error-routing/error-routing.module';
import { CategoryChartComponent } from './category-chart/category-chart.component';
import { SelectComponent } from './select/select.component';
import { DropDownComponent } from './drop-down/drop-down.component';
import {ManualMovesdrComponent} from "./manual-movesdr/manual-movesdr.component";
import {MeasureBaseComponent} from "./measure-base/measure-base.component";
import {KuinavyControlComponent} from "./kuinavy-control/kuinavy-control.component";
import {RobotInfoComponent} from "./robot-info/robot-info.component";
import {RobotSettingsComponent} from "./robot-settings/robot-settings.component";
import {CalibPrintPointComponent} from "./calib-print-point/calib-print-point.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { text: 'ホーム' } },
  { path: 'error', component: UncaughtErrorComponent },
  { path: 'kui-navy', component: KuinavyControlComponent, data:{text: '杭ナビ設定'}},
  // { path: 'robot-settings', component: RobotSettingsComponent, data:{text: 'ロボット設定'}},

  { path: 'category-chart', component: CategoryChartComponent, data: { text: '基準点設定' } },
  { path: 'measure-base', component: MeasureBaseComponent, data: { text: '基準点計測' } },
  { path: 'select', component: SelectComponent, data: { text: 'DXF設定' } },
  { path: 'drop-down', component: DropDownComponent, data: { text: 'コントロールボタン' } },
  { path: 'robot-info', component : RobotInfoComponent, data:{text: 'ロボット情報'}},
  { path: 'manual-Move', component: ManualMovesdrComponent, data: { text: 'マニュアル操作' } },
  { path: 'print-setup', component: CalibPrintPointComponent, data:{text: 'プリント位置調整'}},
  { path: '**', component: PageNotFoundComponent } // must always be last
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ErrorRoutingModule],
  exports: [RouterModule, ErrorRoutingModule]
})
export class AppRoutingModule {
}
