import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketMonitorService {
  private readonly _marketBuy = "MarketBuy";
  private readonly _marketSell = "MarketSell";
  private readonly _docked = "Docked";
  private readonly _undocked = "Undocked";
  private readonly _location = "Location";
  private readonly _refuelAll = "RefuelAll";
  private readonly _refuelPartial = "RefuelPartial";
  private readonly _repairAll = "RepairAll";
  private readonly _repairPartial = "RepairPartial";
  private readonly _redeemVoucher = "RedeemVoucher";
  private readonly _tradeVoucherType = "trade";
  private readonly _notDockedMessage = "Not docked at station."
  private readonly _reset = "Reset";
  private _stationName = this._notDockedMessage;
  private _systemName = "N/a"
  private _refuelCosts: number = 0;
  private _repairCosts: number = 0;
  private _redeemedVoucherAmount: number = 0;
  private _currentTimeStamp: string = "";

  private _marketSellEvents = new BehaviorSubject<any[]>([]);
  public get SellEvents() {
    return this._marketSellEvents.asObservable();
  }

  private _marketBuyEvents = new BehaviorSubject<any[]>([]);
  public get BuyEvents() {
    return this._marketBuyEvents.asObservable();
  }

  private _incomePerHour = new BehaviorSubject<Number>(0);
  public get IncomePerHour() {
    return this._incomePerHour.asObservable();
  }

  constructor() {}

  public Update(event: any){
    switch(event.event){
      case this._docked:
        this.Docked(event);
        break;
      case this._undocked:
        this.UnDocked(event);
        break;
      case this._location:
        this.Location(event);
        break;
      case this._marketSell:
        this.MarketSell(event);
        break;
      case this._marketBuy:
        this.MarketBuy(event);
        break;
      case this._refuelAll:
      case this._refuelPartial:
        this.Refuel(event);
        break;
      case this._repairAll:
      case this._repairPartial:
        this.Repair(event);
        break;
      case this._redeemVoucher:
        this.RedeemVoucher(event);
        break;
      case this._reset:
        this.ZeroOutCreditsPerHour();
        break;
    }
    this._currentTimeStamp = event.timestamp;
    this.CalculateCreditsPerHour();
  }

  private ZeroOutCreditsPerHour(){
    this._refuelCosts = 0;
    this._repairCosts = 0;
    this._redeemedVoucherAmount = 0;
    this._marketSellEvents.next([]);
    this._marketBuyEvents.next([]);
    this._incomePerHour.next(0);
  }

  private RedeemVoucher(event: any){
    if(event.Type != this._tradeVoucherType){
      return;
    }

    this._redeemedVoucherAmount += event.Amount;
  }

  private Docked(event: any){
    this._stationName = event.StationName
  }

  private UnDocked(event: any){
    this._stationName = this._notDockedMessage;
  }

  private Location(event: any){
    this._systemName = event.StarSystem;
    if(event.Docked){
      this._stationName = event.StationName;
    }
  }

  private MarketSell(event: any){
    event.StarSystem = this._systemName;
    event.StationName = this._stationName;
    this._marketSellEvents.next([...this._marketSellEvents.value, event]);
  }

  private MarketBuy(event: any){
    event.StarSystem = this._systemName;
    event.StationName = this._stationName;
    this._marketBuyEvents.next([...this._marketBuyEvents.value, event]);
  }

  private Refuel(event: any){
    this._refuelCosts + event.cost;
  }

  private Repair(event: any){
    this._repairCosts + event.cost;
  }

  private CalculateCreditsPerHour(){
    var totalPaid = this._marketBuyEvents.value.reduce((acc, cur) => acc + cur.TotalCost, 0);
    var totalMaded = this._marketSellEvents.value.reduce((acc, cur) => acc + cur.TotalSale, 0);

    if(totalMaded == 0){
      return;
    }

    try{
      var startTimeStamp = this._marketBuyEvents.value[0].timestamp;

      var hours = Math.floor(Math.abs(new Date(this._currentTimeStamp).getTime() - new Date(startTimeStamp).getTime()) / (60*60*1000)) + 1;
      var incomePerHour = Math.floor((totalMaded - totalPaid) + this.SumOfAdditionalCosts() / hours);
      if(incomePerHour == this._incomePerHour.value){
        return;
      }
      this._incomePerHour.next(incomePerHour);
    }
    catch{
      console.log("error");
    }
  }

  private SumOfAdditionalCosts() : number{
    return (-(this._refuelCosts + this._repairCosts)) + this._redeemedVoucherAmount;
  }
}
