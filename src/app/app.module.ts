import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, BrMaskerModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileOpener
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
