import { BehaviorSubject, filter } from 'rxjs';
import { Injectable } from '@angular/core';
import { JournalNotifierService } from './journal-notifier.service';

@Injectable({
  providedIn: 'root'
})
export class TradeRouteService {
  private readonly _fsdJump = "FSDJump";
  private readonly _marketBuy = "MarketBuy";
  private readonly _marketSell = "MarketSell";
  private readonly _market = "Market";
  private _recordRoute = false;
  private _NA = "N/A";
  private _currentSystem = this._NA;
  private _currentStation = this._NA;
  public DefaultRoute = {
    startSystem: this._NA,
    endSystem: this._NA,
    startStation: this._NA,
    endStation: this._NA,
    ItemName: this._NA,
    Jumps: [] as string[]
  };
  private _currentRoute = this.DefaultRoute;

  private _routes = new BehaviorSubject<any[]>([]);
  public get Routes(){
    return this._routes.asObservable();
  }
  public get RoutesValue(){
    return this._routes.value;
  }

  constructor(private _journalNotifierService: JournalNotifierService) { }

  public SubscribeToEvents(){
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.MarketBuy)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.StartRoute(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.MarketSell)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.EndRoute(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Market)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.UpdateSystemInfo(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.FsdJump)
      .pipe(filter(event => event != null && this._recordRoute))
      .subscribe(event => {
        this._currentRoute.Jumps.push(event.StarSystem);
    });
  }

  private EndRoute(event: any){
    if(this._currentRoute.startSystem == this._NA){
      return;
    }

    this._currentRoute.endSystem = this._currentSystem;
    this._currentRoute.endStation = this._currentStation;

    if(!this._routes.value.some(r => this._currentRoute.startSystem == r.startSystem &&
      this._currentRoute.startStation == r.startStation &&
      this._currentRoute.endSystem == r.endSystem &&
      this._currentRoute.endStation == r.endStation)){
        this._routes.next([...this._routes.value, this._currentRoute]);
    }

    this._currentRoute = this.DefaultRoute;
    this._recordRoute = false;
  }

  private StartRoute(event: any){
    this._currentRoute = {
      startSystem: this._currentSystem,
      endSystem: this._NA,
      startStation: this._currentStation,
      endStation: this._NA,
      ItemName: event.Type,
      Jumps: []
    };
    this._recordRoute = true;
  }

  private UpdateSystemInfo(event: any){
    this._currentSystem = event.StarSystem;
    this._currentStation = event.StationName;
  }
}
