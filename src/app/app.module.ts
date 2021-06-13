import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {GameModule} from './game/game.module';
import {GameRoutingModule} from './game/game.routing.module';
import {SharedModule} from './shared/shared.module';
import {StatsModule} from './stats/stats.module';
import {StatsRoutingModule} from './stats/stats.routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, SharedModule,
    GameModule, GameRoutingModule,
    StatsModule, StatsRoutingModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
