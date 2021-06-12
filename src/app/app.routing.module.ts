import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
