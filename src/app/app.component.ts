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
  public UpdateMessage: string = "";
  public ShowUpdateNotification: boolean = false;
  public ShowRestartButton: boolean = false;

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
    this._electronService.ipcRenderer.on('update_message', (event, arg:any) => {
      console.error("message", arg)
    });
    this._electronService.ipcRenderer.on('update_available', () => {
      this._electronService.ipcRenderer.removeAllListeners('update_available');
      this.UpdateMessage = 'A new update is available. Downloading now...';
      this.ShowUpdateNotification = true;
    });
    this._electronService.ipcRenderer.on('update_downloaded', () => {
      this._electronService.ipcRenderer.removeAllListeners('update_downloaded');
      this.UpdateMessage = 'Update Downloaded. It will be installed on restart. Restart now?';
      this.ShowRestartButton = true;
      this.ShowUpdateNotification = true;
    });

    this._combatService.SubscribeToEvents();
    this._commanderInfo.SubscribeToEvents();
    this._flightService.SubscribeToEvents();
    this._marketMonitorService.SubscribeToEvents();
    this._tradeRouteService.SubscribeToEvents();

    this._journalService.Event.pipe(skip(1)).subscribe(event => {
      console.log("Event",event);
    });

    timer(0, 5000).subscribe(x => {
      this._journalService.ReadInJournal();
    });
  }

  CloseNotification() {
    this.ShowUpdateNotification = false;
  }

  RestartApp() {
    this._electronService.ipcRenderer.send('restart_app');
  }

  ZeroOutRecords(){
    this._electronService.ipcRenderer.send('AddResetEntryToLog');
  }

  title = 'eliteDangerousCreditPerHour';
}
