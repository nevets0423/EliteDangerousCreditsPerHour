import { FlightService } from './flight.service';
import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { filter, BehaviorSubject, take } from 'rxjs';
import { JournalNotifierService } from './journal-notifier.service';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExplorationService {
  private readonly _saveFile = 'firstVisited.log';

  constructor(
    private _journalNotifierService: JournalNotifierService,
    private _electronService: ElectronService,
    private http: HttpClient,
    private _flightService: FlightService) {
    this._electronService.ipcRenderer.send('LoadData', this._saveFile);
    this._electronService.ipcRenderer.on("LoadData-reply", (event, arg:any) => {
      if(!arg.loaded){
        return;
      }
      try{
        var firstDiscoveredSystems = arg.data.trimEnd().split('\n').map((line:string) => JSON.parse(line)) as  any[];
        this.AddAllToFirstDiscovered(firstDiscoveredSystems);
      }
      catch{
        console.error("Failed to read Save File.")
        return;
      }
    });

    this._flightService.StarSystem.pipe(filter(s => s != null)).subscribe(system => {
      this.CalculateDistanceToSystems(system);
    });
  }

  private _firstDiscoveredSystems = new BehaviorSubject<any[]>([]);
  public FirstDiscoveredSystems() {
    return this._firstDiscoveredSystems.asObservable();
  }

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

  private _systemScanned = false;
  public get SystemScanned(){
    return this._systemScanned;
  }

  private _systemDataSold = new BehaviorSubject<any[]>([]);
  public get SystemDataSold(){
    return this._systemDataSold.asObservable();
  }

  public ClearSystemSavedData(){
    this._systemDataSold.next([]);
  }

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

        this._systemScanned = true;
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.FSSSignalDiscovered)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        if(this._bodyCount.value == 0 || this._progress.value == 1){
          return;
        }
        this._bodiesDiscovered.next(this._bodiesDiscovered.value + 1);
        this._progress.next(this._bodiesDiscovered.value / this._bodyCount.value);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.FSSAllBodiesFound)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this._bodiesDiscovered.next(this._bodyCount.value);
        this._progress.next(1);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.FsdJump)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this._system.next(null);
        this._bodyCount.next(0);
        this._progress.next(0);
        this._bodiesDiscovered.next(0);
        this._systemScanned = false;
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.SellMultipleExplorationData)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this._totalFromExplorationData.next(this._totalFromExplorationData.value + event.TotalEarnings);
        var newSystemData = event.Discovered.filter((system: any) => this._firstDiscoveredSystems.value.findIndex(v => v.SystemName == system.SystemName) == -1)
        .map((system: any) => {
          return {
            SystemName: system.SystemName,
            PossibleFirstDiscovery: event.Bonus > 0
          }
        });
        this.AppendSystemData(newSystemData);
    });
    this._journalNotifierService.GetSubscriptionFor(this._journalNotifierService.SellExplorationData)
      .pipe(filter(event => event != null))
      .subscribe(event => {
        this._totalFromExplorationData.next(this._totalFromExplorationData.value + event.TotalEarnings);
        var newSystemData = event.Systems.filter((systemName: string) => this._firstDiscoveredSystems.value.findIndex(v => v.SystemName == systemName) == -1)
        .map((systemName: any) => {
          return {
            SystemName: systemName,
            PossibleFirstDiscovery: event.Bonus > 0
          }
        });
        this.AppendSystemData(newSystemData);
    });
  }

  private AppendSystemData(newSystemData: any){
    var systemData = this._systemDataSold.value;
    this._systemDataSold.next([...systemData, ...newSystemData]);
  }

  public SaveSystemData(systemData: any[]){
    var dataToSave = systemData.map(data => JSON.stringify(data));
    this._electronService.ipcRenderer.send('SaveData', [this._saveFile, ...dataToSave]);
    this.AddAllToFirstDiscovered(systemData);
  }

  private GetSystemCord(systemName: string){
    var options = {
      params: {
        systemName: systemName,
        showCoordinates: 1
      }
    };

    return this.http.get('https://www.edsm.net/api-v1/system', options);
  }

  private AddAllToFirstDiscovered(systemData: any[]){
    for(var i=0; i < systemData.length; i++){
      this.AddToFirstDiscrovered(systemData[i])
    }
  }

  private AddToFirstDiscrovered(system: any){
    this.GetSystemCord(system.SystemName).pipe(take(1)).subscribe({
      next: (value:any) => {
        try{
          var cords = value.coords;
          system.cords = cords;
          var coreSystem = this._flightService.StarSystemValue;
          system.dist = 'N/A';
          if(coreSystem != null){
            system.dist = this.CalculateDistanceBewteenSystems(system.cords, {
              x: coreSystem.StarPos[0],
              y: coreSystem.StarPos[1],
              z: coreSystem.StarPos[2]
            });
          }
          this.AddSystemToFirstDiscovered(system);
        }
        catch(error){
          console.error('failed to get system cords', error);
        }
      },
      error: value => {
        system.cords = null;
        system.dist = 'N/A';
        this.AddSystemToFirstDiscovered(system);
      }
    });
  }

  private AddSystemToFirstDiscovered(system: any){
    var firstDiscoveredSystems = this._firstDiscoveredSystems.value;
    this._firstDiscoveredSystems.next([...firstDiscoveredSystems, system]);

    var index = this._systemDataSold.value.findIndex(s => s.SystemName == system.SystemName);
    if(index >= 0){
      var systemDataSold = this._systemDataSold.value;
      systemDataSold = systemDataSold.filter(item => item.SystemName != system.SystemName);
      this._systemDataSold.next(systemDataSold);
    }
  }

  private CalculateDistanceToSystems(coreSystem: any){
    var systems = this._firstDiscoveredSystems.value;
    var newSystemValues = [];

    for(var i =0; i < systems.length; i++){
      var system = systems[i];
      system.dist = this.CalculateDistanceBewteenSystems(system.cords, {
        x: coreSystem.StarPos[0],
        y: coreSystem.StarPos[1],
        z: coreSystem.StarPos[2]
      });
      newSystemValues.push(system);
    }

    this._firstDiscoveredSystems.next(newSystemValues);
  }

  private CalculateDistanceBewteenSystems(cordA: any, cordB: any){
    if(cordA == undefined || cordA == null || cordB == undefined || cordB == null){
      return 'N/A';
    }
    return Math.sqrt(Math.pow(cordA.x - (cordB.x),2) + Math.pow(cordA.y - (cordB.y),2) + Math.pow(cordA.z - (cordB.z),2)).toFixed(2);
  }
}
