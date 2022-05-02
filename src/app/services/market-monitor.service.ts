import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, timer} from 'rxjs';
import { JournalNotifierService } from './journal-notifier.service';

@Injectable({
  providedIn: 'root'
})
export class MarketMonitorService {
  private readonly _tradeVoucherType = "trade";
  private readonly _notDockedMessage = "Not docked at station."
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

  constructor(private _journalNotifierService: JournalNotifierService) {}

  public SubscribeToEvents(){
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Docked)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Docked(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Undocked)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.UnDocked(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Location)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Location(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.MarketSell)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.MarketSell(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.MarketBuy)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.MarketBuy(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RefuelAll)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Refuel(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RefuelPartial)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Refuel(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RepairAll)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Repair(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RepairPartial)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Repair(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RedeemVoucher)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.RedeemVoucher(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Reset)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.ZeroOutCreditsPerHour();
        this.Update(event);
    });

    timer(0, 900000).subscribe(x => { //every 15 mins we update. In case nothing else has forces an update.
      this.CalculateCreditsPerHour();
    });
  }

  private Update(event: any){
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
      console.log("Hours", startTimeStamp, this._currentTimeStamp, hours);
      var incomePerHour = Math.floor(((totalMaded - totalPaid) + this.SumOfAdditionalCosts()) / hours);
      if(incomePerHour == this._incomePerHour.value){
        return;
      }
      console.log("Total made", totalMaded - totalPaid)
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
