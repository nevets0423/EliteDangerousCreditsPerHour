import { FlightService } from './../../services/flight.service';
import { TradeRouteService } from './../../services/trade-route.service';
import { Component, OnInit } from '@angular/core';
import { MarketMonitorService } from 'src/app/services/market-monitor.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
  animations: [
    trigger('ArrowTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate("7s", keyframes([
          style({ opacity: 0, offset: 0}),
          style({ opacity: 0, offset: 0.5}),
          style({ opacity: 1, offset: 0.8}),
        ])),
      ])
    ]),
    trigger('FSDTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate("7s", keyframes([
          style({ opacity: 0, offset: 0}),
          style({ opacity: 0, offset: 0.5}),
          style({ opacity: 1, offset: 0.8}),
        ])),
      ]),
      transition(':leave', [
        animate('2s', style({ opacity: 0 }))
      ])
    ]),
    trigger('TextInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class TradeComponent implements OnInit {
  public Route1: any = null;
  public Route2: any = null;
  public ShowRightArrows = false;
  public ShowLeftArrows = false;

  constructor(private _marketMonitorService: MarketMonitorService, private _tradeRouteService: TradeRouteService,
    private _flightService: FlightService) { }

  public get IncomePerHour(){
    return this._marketMonitorService.IncomePerHour;
  }

  public get RoutesLoaded() {
    return this.Route1!=null && this.Route2!=null;
  }

  public get Jumps() {
    return this._flightService.JumpsRemaining;
  }

  public get NextSystemInRoute(){
    return this._flightService.NextSystemInRouteValue;
  }

  ngOnInit(): void {
    this.LoadRoutes(this._tradeRouteService.RoutesValue);
    if(this._flightService.DockedValue){
      this.UpdateArrows();
    }

    this._tradeRouteService.Routes.subscribe(routes => {
      this.LoadRoutes(routes);
    });

    this._flightService.Docked.pipe(filter(docked => docked)).subscribe(docked => {
      this.UpdateArrows();
    });
  }

  UpdateArrows(){
    if(this.Route1 == null || this.Route2 == null){
      return;
    }
    this.ShowRightArrows = this.Route1.startSystem == this._flightService.StarSystemValue.StarSystem &&
                           this.Route1.startStation == this._flightService.StationValue.StationName;
    this.ShowLeftArrows = this.Route2.startSystem == this._flightService.StarSystemValue.StarSystem &&
                          this.Route2.startStation == this._flightService.StationValue.StationName;
  }

  LoadRoutes(routes: any[]){
    if(routes == null || routes.length < 2){
      return;
    }

    for(var i = routes.length-1; i >= 0 ; i--){
      var routeA = routes[i]
      for(var j = i-1; j >= 0 ; j--){
        var routeB = routes[j];
        if(routeA.startSystem == routeB.endSystem && routeA.endSystem == routeB.startSystem &&
          routeA.startStation == routeB.endStation && routeA.endStation == routeB.startStation){
            this.Route1 = routeA;
            this.Route2 = routeB;
            return;
        }
      }
    }
  }
}
