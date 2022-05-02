import { CopyButtonCellRenderer } from './grid-render-components/clip-board-copy-cel-renderer.component';
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
import { FirstDiscoveredComponent } from './Pages/first-discovered/first-discovered.component';
import { CheckBoxCellRenderer } from './grid-render-components/checkBox-cel-renderer.component';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TradeComponent,
    SpinnerComponent,
    HomeComponent,
    TabsComponent,
    CombatComponent,
    ExplorationComponent,
    FirstDiscoveredComponent,
    CheckBoxCellRenderer,
    CopyButtonCellRenderer
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSlideToggleModule,
    FormsModule,
    AgGridModule.withComponents([
      CheckBoxCellRenderer,
      CopyButtonCellRenderer
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
