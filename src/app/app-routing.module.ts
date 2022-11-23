import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryChartComponent } from './category-chart/category-chart.component';
import { DropDownComponent } from './drop-down/drop-down.component';
import { ErrorRoutingModule } from './error-routing/error-routing.module';
import { UncaughtErrorComponent } from './error-routing/error/uncaught-error.component';
import { PageNotFoundComponent } from './error-routing/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { ManualMovesdrComponent } from './manual-movesdr/manual-movesdr.component';
import { RadialGaugeComponent } from './radial-gauge/radial-gauge.component';
import {
    ReferencepointMeasureComponent
} from './referencepoint-measure/referencepoint-measure.component';
import { SelectComponent } from './select/select.component';
import { SvgViewComponent } from './svg-view/svg-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { text: 'Home' } },
  { path: 'error', component: UncaughtErrorComponent },
  { path: 'select', component: SelectComponent, data: { text: 'ロボット設定' } },
  { path: 'category-chart', component: CategoryChartComponent, data: { text: '描画表示' } },
  { path: 'drop-down', component: DropDownComponent, data: { text: 'コントロールボタン' } },
  { path: 'radial-gauge', component: RadialGaugeComponent, data: { text: 'マニュアル操作' } },
  { path: 'svg-display', component: SvgViewComponent, data: { text: '図面表示等テスト' } },
  { path: 'mgr-refpointy', component: ReferencepointMeasureComponent, data: { text: '基準点測定テスト' } },
  { path: 'manual-move', component: ManualMovesdrComponent, data: { text: '手動操作テスト' } },
  { path: '**', component: PageNotFoundComponent } // must always be last
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ErrorRoutingModule],
  exports: [RouterModule, ErrorRoutingModule]
})
export class AppRoutingModule {
}
