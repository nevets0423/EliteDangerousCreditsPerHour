import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly _docked = "Docked";
  private readonly _dockingRequested = "DockingRequested";
  private readonly _dockingGranted = "DockingGranted";
  private readonly _dockingDenied = "DockingDenied";
  private readonly _dockingCanceled = "DockingCancelled";
  private readonly _dockingTimeOut = "DockingTimeout";
  private readonly _undocked = "Undocked";
  private readonly _location = "Location";
  private readonly _fsdTarget = "FSDTarget";
  private readonly _startJump = "StartJump";
  private readonly _fsdJump = "FSDJump";

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

  constructor() { }

  public Update(event: any){
    switch(event.event){
      case this._docked:
        this.Update_Docked(event);
        break;
      case this._dockingRequested:
      case this._dockingGranted:
        this.Update_DockingInProgress(event);
        break;
      case this._dockingDenied:
      case this._dockingCanceled:
      case this._dockingTimeOut:
        this.Update_DockingCancled(event);
        break;
      case this._undocked:
        this.Update_TakeOff(event);
        break;
      case this._location:
        this.Update_Location(event);
        break;
      case this._fsdTarget:
        this.Update_FSDTarget(event);
        break;
      case this._startJump:
        this.Update_FSDCharging(event);
        break;
      case this._fsdJump:
        this.Update_FSDJump(event);
        break;
    }
  }

  private Update_Docked(event:any){
    this._currentlyDocked.next(true);
    this._currentStation.next(event);
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
    console.log(event);
  }

  private Update_FSDCharging(event: any){
    this._fsdCharging.next(true);
  }

  private Update_FSDJump(event: any){
    this._currentStarSystem.next(event);
    this._fsdCharging.next(false);
    this._jumpsRemaining--;
  }
}
