import { BehaviorSubject, skip, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { JournalService } from './journal.service';

@Injectable({
  providedIn: 'root'
})
export class JournalNotifierService {
  //#region Events
  public readonly BuyAmmo = "BuyAmmo";
  public readonly BuyDrones = "BuyDrones";
  public readonly SellDrones = "SellDrones";
  public readonly RefuelAll = "RefuelAll";
  public readonly RefuelPartial = "RefuelPartial";
  public readonly RepairAll = "RepairAll";
  public readonly RepairPartial = "RepairPartial";
  public readonly MissionComplet = "MissionCompleted";
  public readonly PayBounties = "PayBounties";
  public readonly PayFine = "PayFines";
  public readonly RestockVehicle = "RestockVehicle";
  public readonly Bounty = "Bounty";
  public readonly RedeemVoucher = "RedeemVoucher";
  public readonly Reset = "Reset";
  public readonly Commander = "Commander";
  public readonly MarketBuy = "MarketBuy";
  public readonly MarketSell = "MarketSell";
  public readonly Docked = "Docked";
  public readonly Undocked = "Undocked";
  public readonly Location = "Location";
  public readonly FsdJump = "FSDJump";
  public readonly Market = "Market";
  public readonly DockingRequested = "DockingRequested";
  public readonly DockingGranted = "DockingGranted";
  public readonly DockingDenied = "DockingDenied";
  public readonly DockingCanceled = "DockingCancelled";
  public readonly DockingTimeOut = "DockingTimeout";
  public readonly FsdTarget = "FSDTarget";
  public readonly StartJump = "StartJump";
  public readonly Died = "Died";
  public readonly SellExplorationData = "SellExplorationData";
  public readonly SellMultipleExplorationData = "MultiSellExplorationData";
  public readonly FSSDiscoveryScan = "FSSDiscoveryScan";
  public readonly FSSSignalDiscovered = "FSSSignalDiscovered";
  public readonly FSSAllBodiesFound = "FSSAllBodiesFound";

  public readonly TradeVoucherType = "trade";
  public readonly VoucherBountyType = "bounty";
  public readonly VoucherBoundType = "combatBond";
  //#endregion

  private _journalEventSubjects: any[] = [];

  constructor(private _journalService: JournalService) {
    this._journalService.Event.pipe(skip(1)).subscribe(event => {
      var journalEventSubject = this._journalEventSubjects.find(j => j.event == event.event);
      if(journalEventSubject == undefined){
        console.log("No one subscribed to " + event.event);
        return;
      }
      journalEventSubject.behaviorSubject.next(event);
    });
  }

  GetSubscriptionFor(eventName: string): Observable<any>{
    var journalEventSubject = this._journalEventSubjects.find(j => j.event == eventName);

    if(journalEventSubject != undefined){
      return journalEventSubject.behaviorSubject.asObservable();
    }

    journalEventSubject = {
      event: eventName,
      behaviorSubject: new BehaviorSubject<any>(null)
    }

    this._journalEventSubjects.push(journalEventSubject);
    return journalEventSubject.behaviorSubject.asObservable();
  }
}
