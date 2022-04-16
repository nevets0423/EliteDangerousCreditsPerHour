import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommanderService {
  private readonly _commander = "Commander";

  private _commanderName = new BehaviorSubject<string>("Unknown Commander");
  public get Name() {
    return this._commanderName.asObservable();
  }

  constructor() { }

  public Update(event: any){
    switch(event.event){
      case this._commander:
        this._commanderName.next(event.Name[0].toUpperCase() + event.Name.substr(1).toLowerCase());
        break;
    }
  }
}
