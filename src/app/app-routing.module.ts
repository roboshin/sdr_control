import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { PageNotFoundComponent } from './error-routing/not-found/not-found.component';
import { UncaughtErrorComponent } from './error-routing/error/uncaught-error.component';
import { ErrorRoutingModule } from './error-routing/error-routing.module';
import { CategoryChartComponent } from './category-chart/category-chart.component';
import { SelectComponent } from './select/select.component';
import { RadialGaugeComponent } from './radial-gauge/radial-gauge.component';
import { DropDownComponent } from './drop-down/drop-down.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { text: 'ホーム' } },
  { path: 'error', component: UncaughtErrorComponent },
  { path: 'select', component: SelectComponent, data: { text: 'ロボット設定' } },
  { path: 'category-chart', component: CategoryChartComponent, data: { text: '描画表示' } },
  { path: 'drop-down', component: DropDownComponent, data: { text: 'コントロールボタン' } },
  { path: 'radial-gauge', component: RadialGaugeComponent, data: { text: 'マニュアル操作' } },
  { path: '**', component: PageNotFoundComponent } // must always be last
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ErrorRoutingModule],
  exports: [RouterModule, ErrorRoutingModule]
})
export class AppRoutingModule {
}
