import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PuzzleComponent} from './components/puzzle.component';

const ROUTES: Routes = [
  {path: 'puzzle/:type', component: PuzzleComponent}

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PuzzleRoutingModule {
}
