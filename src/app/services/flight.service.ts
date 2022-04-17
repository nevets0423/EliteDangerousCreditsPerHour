import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { JournalNotifierService } from './journal-notifier.service';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private _currentStarSystem = new BehaviorSubject<any>(null);
  public get StarSystem() {
    return this._currentStarSystem.asObservable();
  }
  public get StarSystemValue(){
    return this._currentStarSystem.value;
  }

  private _currentStation = new BehaviorSubject<any>(null);
  public get Station() {
    return this._currentStation.asObservable();
  }
  public get StationValue(){
    return this._currentStation.value;
  }

  private _currentlyDocked = new BehaviorSubject<boolean>(false);
  public get Docked() {
    return this._currentlyDocked.asObservable();
  }
  public get DockedValue() {
    return this._currentlyDocked.value;
  }

  private _dockingInProcess = new BehaviorSubject<boolean>(false);
  public get DockingInProcess() {
    return this._dockingInProcess.asObservable();
  }

  private _currentlyLanded = new BehaviorSubject<boolean>(false);
  public get Landed() {
    return this._currentlyLanded.asObservable();
  }

  private _fsdCharging = new BehaviorSubject<boolean>(false);
  public get FSDCharging(){
    return this._fsdCharging.asObservable();
  }

  private _jumpsRemaining = 0;
  public get JumpsRemaining() {
    return this._jumpsRemaining;
  }

  private _nextSystemInRoute = new BehaviorSubject<string | null>(null);
  public get NextSystemInRoute(){
    return this._nextSystemInRoute.asObservable();
  }
  public get NextSystemInRouteValue(){
    return this._nextSystemInRoute.value;
  }

  constructor(private _journalNotifierService: JournalNotifierService) { }

  public SubscribeToEvents(){
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Docked)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_Docked(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.DockingRequested)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_DockingInProgress(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.DockingGranted)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_DockingInProgress(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.DockingDenied)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_DockingCancled(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.DockingCanceled)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_DockingCancled(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.DockingTimeOut)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_DockingCancled(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Undocked)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_TakeOff(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Location)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_Location(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.FsdTarget)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_FSDTarget(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.StartJump)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_FSDCharging(event);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.FsdJump)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this.Update_FSDJump(event);
    });
  }

  private Update_Docked(event:any){
    this._currentStation.next(event);
    this._currentlyDocked.next(true);
    this._dockingInProcess.next(false);
  }

  private Update_TakeOff(event: any){
    this._currentlyDocked.next(false);
    this._currentStation.next(null);
  }

  private Update_DockingInProgress(event: any){
    this._dockingInProcess.next(true);
  }

  private Update_DockingCancled(event: any){
    this._dockingInProcess.next(false);
  }

  private Update_Location(event: any){
    this._currentStarSystem.next(event);
  }

  private Update_FSDTarget(event: any){
    this._jumpsRemaining = event.RemainingJumpsInRoute;
    this._nextSystemInRoute.next(event.Name);
  }

  private Update_FSDCharging(event: any){
    this._fsdCharging.next(true);
    this._jumpsRemaining--;
  }

  private Update_FSDJump(event: any){
    this._currentStarSystem.next(event);
    this._fsdCharging.next(false);
  }
}
