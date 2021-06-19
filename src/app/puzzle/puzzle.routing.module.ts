import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NumericPuzzleComponent} from './components/numeric-puzzle.component';

const ROUTES: Routes = [
  {path: 'puzzle/:type', component: NumericPuzzleComponent}

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PuzzleRoutingModule {
}
