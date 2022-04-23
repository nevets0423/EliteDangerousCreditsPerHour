import { Injectable } from '@angular/core';
import { filter, BehaviorSubject } from 'rxjs';
import { JournalNotifierService } from './journal-notifier.service';

@Injectable({
  providedIn: 'root'
})
export class ExplorationService {
  constructor(private _journalNotifierService: JournalNotifierService) { }

  private _system = new BehaviorSubject<string|null>(null);
  public System(){
    return this._system.asObservable();
  }

  private _progress = new BehaviorSubject<number>(0);
  public Progress(){
    return this._progress.asObservable();
  }

  private _bodyCount = new BehaviorSubject<number>(0);
  public BodyCount(){
    return this._bodyCount.asObservable();
  }

  private _bodiesDiscovered = new BehaviorSubject<number>(0);
  public BodiesDiscovered(){
    return this._bodiesDiscovered.asObservable();
  }

  private _systemScanned = new BehaviorSubject<boolean>(false);
  public SystemScanned(){
    return this._systemScanned.asObservable();
  }

  public SystemDataSold:  any[] = [];

  private _totalFromExplorationData = new BehaviorSubject<number>(0);
  public TotalFromExplorationData() {
    return this._totalFromExplorationData.asObservable();
  }

  public SubscribeToEvents(){
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.FSSDiscoveryScan)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this._system.next(event.SystemName);
        this._bodyCount.next(event.BodyCount);
        this._progress.next(event.Progress);

        var totalBodies = this._bodyCount.value;
        var currentPercent = this._progress.value;
        this._bodiesDiscovered.next(Math.floor(totalBodies * currentPercent));

        this._systemScanned.next(true);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.FSSSignalDiscovered)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        if(this._bodyCount.value == 0){
          return;
        }
        this._bodiesDiscovered.next(this._bodiesDiscovered.value + 1);
        this._progress.next(this._bodiesDiscovered.value / this._bodyCount.value);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.FsdJump)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this._system.next(null);
        this._bodyCount.next(0);
        this._progress.next(0);
        this._bodiesDiscovered.next(0);
        this._systemScanned.next(false);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.SellExplorationData)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this._totalFromExplorationData.next(this._totalFromExplorationData.value + event.TotalEarnings);
        this.SystemDataSold.push(event.Discovered.map((system: any) => {
          return {
            SystemName: system.SystemName,
            PossibleFirstDiscovery: event.Bonus > 0
          }
        }));
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.SellMultipleExplorationData)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this._totalFromExplorationData.next(this._totalFromExplorationData.value + event.TotalEarnings);
        this.SystemDataSold.push(event.Systems.map((systemName: any) => {
          return {
            SystemName: systemName,
            PossibleFirstDiscovery: event.Bonus > 0
          }
        }));
    });
  }
}
