import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {GameModule} from './game/game.module';
import {GameRoutingModule} from './game/game.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, GameModule, GameRoutingModule, AppRoutingModule, BrowserAnimationsModule, SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
