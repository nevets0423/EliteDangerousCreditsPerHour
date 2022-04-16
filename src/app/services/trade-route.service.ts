import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

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

  constructor() { }

  public Update(event: any){
    switch(event.event){
      case this._marketBuy:
        this.StartRoute(event);
        break;
      case this._marketSell:
        this.EndRoute(event);
        break;
      case this._market:
        this.UpdateSystemInfo(event);
        break;
    }

    if(!this._recordRoute){
      return;
    }

    if(event.event == this._fsdJump){
      this._currentRoute.Jumps.push(event.StarSystem);
    }
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
