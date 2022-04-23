import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TradeComponent } from './Pages/trade/trade.component';
import { SpinnerComponent } from './Componets/spinner/spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import { HomeComponent } from './Pages/home/home.component';
import { TabsComponent } from './Componets/tabs/tabs.component';
import { CombatComponent } from './Pages/combat/combat.component';
import { AgGridModule } from 'ag-grid-angular';
import { ExplorationComponent } from './Pages/exploration/exploration.component';

@NgModule({
  declarations: [
    AppComponent,
    TradeComponent,
    SpinnerComponent,
    HomeComponent,
    TabsComponent,
    CombatComponent,
    ExplorationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    BrowserAnimationsModule,
    MatTabsModule,
    AgGridModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
