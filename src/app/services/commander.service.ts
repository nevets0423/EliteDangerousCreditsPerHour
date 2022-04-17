import { BehaviorSubject, filter } from 'rxjs';
import { Injectable } from '@angular/core';
import { JournalNotifierService } from './journal-notifier.service';

@Injectable({
  providedIn: 'root'
})
export class CommanderService {
  private _commanderName = new BehaviorSubject<string>("Unknown Commander");
  public get Name() {
    return this._commanderName.asObservable();
  }

  constructor(private _journalNotifierService: JournalNotifierService) { }

  public SubscribeToEvents(){
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.Commander)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this._commanderName.next(event.Name[0].toUpperCase() + event.Name.substr(1).toLowerCase());
    });
  }
}
