import { CombatService } from './services/combat.service';
import { TradeRouteService } from './services/trade-route.service';
import { FlightService } from './services/flight.service';
import { CommanderService } from './services/commander.service';
import { MarketMonitorService } from './services/market-monitor.service';
import { JournalService } from './services/journal.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { timer, skip } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(
    private _journalService: JournalService,
    private _marketMonitorService: MarketMonitorService,
    private _commanderInfo: CommanderService,
    private _flightService: FlightService,
    private _tradeRouteService: TradeRouteService,
    private _combatService: CombatService,
    private _electronService: ElectronService) {}

  public get CommanderName(){
    return this._commanderInfo.Name;
  }

  public get LoadingJournal() : boolean{
    return this._journalService.NoDataLoad;
  }

  public get Message() : string {
    if(this._journalService.Error){
      return "Failed to load Journal. Make sure Elite is Started."
    }
    return "Loading Latest Journal"
  }

  ngOnInit(): void {
    this._journalService.Event.pipe(skip(1)).subscribe(event => {
      this._marketMonitorService.Update(event);
      this._commanderInfo.Update(event);
      this._flightService.Update(event);
      this._tradeRouteService.Update(event);
      this._combatService.Update(event);
      console.log("Event",event);
    });

    timer(0, 1000).subscribe(x => {
      this._journalService.ReadInJournal();
    });
  }

  zeroOutRecords(){
    console.log("calling AddResetEntryToLog")
    this._electronService.ipcRenderer.send('AddResetEntryToLog');
  }

  title = 'eliteDangerousCreditPerHour';
}
