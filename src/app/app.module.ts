import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {GameModule} from './game/game.module';
import {GameRoutingModule} from './game/game.routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, GameModule, GameRoutingModule, AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
