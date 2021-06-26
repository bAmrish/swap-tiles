import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {HomeComponent} from './home/home.component';
import {PuzzleModule} from './puzzle/puzzle.module';
import {PuzzleRoutingModule} from './puzzle/puzzle.routing.module';
import {SharedModule} from './shared/shared.module';
import {StatsModule} from './stats/stats.module';
import {StatsRoutingModule} from './stats/stats.routing.module';

@NgModule({
  declarations: [
    AppComponent, HomeComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, SharedModule,
    PuzzleModule, PuzzleRoutingModule,
    StatsModule, StatsRoutingModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
