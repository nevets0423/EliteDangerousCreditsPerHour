import { JournalNotifierService } from './journal-notifier.service';
import { BehaviorSubject, filter } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  private readonly _voucherBountyType = "bounty";
  private readonly _voucherBoundType = "combatBond";
  private _updated = new BehaviorSubject(0);

  public get Updated () {
    return this._updated.asObservable();
  }
  public PotentialCreditsFromBounty : number = 0;
  public CreditsFromVouchersBounty : number = 0;
  public CreditsFromVouchersBond : number = 0;
  public CreditsFromMission : number = 0;
  public CreditsSpentAmmo : number = 0;
  public CreditsSpentDrones : number = 0;
  public CreditsSpentFuel : number = 0;
  public CreditsSpentRepair : number = 0;
  public CreditsSpentBounties : number = 0;
  public CreditsSpentFines : number = 0;
  public CreditsSpentRestockVehicle : number = 0;
  public get CreditsPerHour() : number {
    return this.PerHour(this.CreditsFromVouchersBounty + this.CreditsFromVouchersBond + this.CreditsFromMission -
      (this.CreditsSpentAmmo + this.CreditsSpentDrones + this.CreditsSpentFuel + this.CreditsSpentRepair +
      this.CreditsSpentBounties + this.CreditsSpentFines + this.CreditsSpentRestockVehicle));
  }

  private _hoursSpent : number = 1;
  private _startTimeStamp: Date | null = null;

  constructor(private _journalNotifierService: JournalNotifierService) { }

  public SubscribeToEvents(){
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.BuyAmmo)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentAmmo += event.Cost;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.BuyDrones)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentDrones += event.TotalCost;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.SellDrones)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentDrones -= event.TotalSale;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RefuelAll)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentFuel += event.Cost;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RefuelPartial)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentFuel += event.Cost;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RepairAll)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentRepair += event.Cost;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RepairPartial)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentRepair += event.Cost;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.MissionComplet)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsFromMission += event.Reward;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.PayBounties)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentBounties += event.Amount;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.PayFine)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentFines += event.Amount;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RestockVehicle)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.CreditsSpentRestockVehicle += event.Cost;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.RedeemVoucher)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.RedeemVoucher(event);
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Bounty)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.PotentialCreditsFromBounty += event.TotalReward;
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Reset)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Reset();
        this.Update(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Died)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.PotentialCreditsFromBounty = 0;
        this.Update(event);
    });
  }

  public PerHour(amount: number){
    return Math.floor(amount / this._hoursSpent);
  }

  private Update(event: any){
    if(this._startTimeStamp == null) {
      this._startTimeStamp = event.timestamp;
    }

    this._hoursSpent = Math.floor(Math.abs(new Date(event.timestamp).getTime() - new Date(this._startTimeStamp ?? 0).getTime()) / (60*60*1000)) + 1;
    this._updated.next(this._hoursSpent);
  };

  private Reset(){
    this.CreditsFromVouchersBounty = 0;
    this.CreditsFromVouchersBond = 0;
    this.CreditsFromMission = 0;
    this.CreditsSpentAmmo = 0;
    this.CreditsSpentDrones = 0;
    this.CreditsSpentFuel = 0;
    this.CreditsSpentRepair = 0;
    this.CreditsSpentBounties = 0;
    this.CreditsSpentFines = 0;
    this.CreditsSpentRestockVehicle = 0;
    this._startTimeStamp = null;
  }

  private RedeemVoucher(event: any){
    if(event.Type == this._voucherBoundType){
      this.CreditsFromVouchersBond += event.Amount
    }

    if(event.Type == this._voucherBountyType){
      this.PotentialCreditsFromBounty = 0;
      this.CreditsFromVouchersBounty += event.Amount
    }
  }
}
