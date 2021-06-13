import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StatsComponent} from './components/stats.component';
const ROUTES: Routes = [
  {
    path: 'stats',
    component: StatsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class StatsRoutingModule{}
