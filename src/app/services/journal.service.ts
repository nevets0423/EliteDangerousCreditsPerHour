import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private readonly _loadingEvent:string = "__loading__";
  private _loading = new BehaviorSubject<boolean>(false);
  private _error = new BehaviorSubject<boolean>(false);
  private _errorMessage = new BehaviorSubject<string | null>(null);
  private _nextEvent = new BehaviorSubject<any>(null);
  private _lastEvent = {timestamp: "", event: this._loadingEvent};

  constructor(private _electronService: ElectronService) {}

  public get NoDataLoad() {
    return this._nextEvent.value == null;
  }
  public get Event() {
    return this._nextEvent.asObservable();
  }
  public get Loading() {
    return this._loading.asObservable();
  }
  public get Error() {
    return this._error.value;
  }
  public get ErrorMessage() {
    return this._errorMessage.asObservable();
  }

  public ReadInJournal(){
    if(this._loading.value){
      return;
    }
    this._loading.next(true);
    if(!this._electronService.isElectronApp) {
      this._errorMessage.next("Application was not launched with Electron");
      this._error.next(true);
      this._loading.next(false);
      return;
    }

    this._electronService.ipcRenderer.send('GetJournalFilePath');
    this._electronService.ipcRenderer.on("GetJournalFilePath-reply", (event, arg:any) => {
      if(arg.errorOccured){
        this._errorMessage.next(arg.errorMessage);
        this._error.next(true);
        this._loading.next(false);
        return;
      }
      if(arg.journal == null){
        this._loading.next(false);
        return;
      }

      try{
        var journalEvent = arg.journal.trimEnd().split('\n').map((line:string) => JSON.parse(line)) as  any[];
      }
      catch{
        console.error("Failed to read Json File.")
        this._loading.next(false);
        return;
      }
      var lastJournalEvent = journalEvent[journalEvent.length - 1];
      if(this._lastEvent.timestamp == lastJournalEvent.timestamp && this._lastEvent.event == lastJournalEvent.event){
        this._loading.next(false);
        return;
      }

      var loadEvent = arg.currentJournalPath != arg.lastJournalPath || this._lastEvent.event == this._loadingEvent;
      journalEvent.forEach((event:any) => {
        var isLastEvent = this._lastEvent.timestamp == event.timestamp && this._lastEvent.event == event.event;
        loadEvent = loadEvent || isLastEvent;

        if(!loadEvent || isLastEvent){
          return;
        }

        this._nextEvent.next(event);
      });

      this._lastEvent = lastJournalEvent;
      this._loading.next(false);
    });
  }
}
