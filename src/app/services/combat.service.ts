import { TradeRouteService } from './../../../EliteCreditPerHour-win32-x64/resources/app/src/app/services/trade-route.service';
import { Observable, Subscriber, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  private readonly _factionKillBond = "FactionKillBond";
  private readonly _buyAmmo = "BuyAmmo";
  private readonly _buyDrones = "BuyDrones";
  private readonly _sellDrones = "SellDrones";
  private readonly _refuelAll = "RefuelAll";
  private readonly _refuelPartial = "RefuelPartial";
  private readonly _repairAll = "RepairAll";
  private readonly _repairPartial = "RepairPartial";
  private readonly _missionComplet = "MissionCompleted";
  private readonly _payBounties = "PayBounties";
  private readonly _payFine = "PayFines";
  private readonly _restockVehicle = "RestockVehicle";
  private readonly _redeemVoucher = "RedeemVoucher";
  private readonly _voucherBountyType = "bounty";
  private readonly _voucherBoundType = "combatBond";
  private readonly _reset = "Reset";
  private _updated = new BehaviorSubject(0);

  public get Updated () {
    return this._updated.asObservable();
  }
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

  constructor() { }

  public PerHour(amount: number){
    return Math.floor(amount / this._hoursSpent);
  }

  public Update(event: any){
    switch(event.event){
      case this._buyAmmo:
        this.CreditsSpentAmmo += event.Cost;
        break;
      case this._buyDrones:
        this.CreditsSpentDrones += event.TotalCost;
        break;
      case this._sellDrones:
        this.CreditsSpentDrones -= event.TotalSale;
        break;
      case this._refuelAll:
      case this._refuelPartial:
        this.CreditsSpentFuel += event.Cost;
        break;
      case this._repairAll:
      case this._repairPartial:
        this.CreditsSpentRepair += event.Cost;
        break;
      case this._missionComplet:
        this.CreditsFromMission += event.Reward;
        break;
      case this._payBounties:
        this.CreditsSpentBounties += event.Amount;
        break;
      case this._payFine:
        this.CreditsSpentFines += event.Amount;
        break;
      case this._restockVehicle:
        this.CreditsSpentRestockVehicle += event.Cost;
        break;
      case this._redeemVoucher:
        this.RedeemVoucher(event);
        break;
      case this._reset:
        this.Reset();
        break;
    }

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
    if(event.type == this._voucherBoundType){
      this.CreditsFromVouchersBond == event.Amount
    }

    if(event.type == this._voucherBountyType){
      this.CreditsFromVouchersBounty == event.Amount
    }
  }
}
