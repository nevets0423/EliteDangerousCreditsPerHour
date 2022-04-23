import { FlightService } from './../../services/flight.service';
import { Component, OnInit } from '@angular/core';
import { ExplorationService } from 'src/app/services/exploration.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-exploration',
  templateUrl: './exploration.component.html',
  styleUrls: ['./exploration.component.css'],
  animations: [
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
    ])
  ]
})
export class ExplorationComponent implements OnInit {
  public get HasBeenScanned(){
    return this._explorationService.SystemScanned;
  }

  public get SystemName(){
    return this._explorationService.System();
  }

  public get Progress(){
    return this._explorationService.Progress();
  }

  public get BodyCount() {
    return this._explorationService.BodyCount();
  }

  public get JumpsRemaining(){
    return this._flightService.JumpsRemaining;
  }

  constructor(private _explorationService: ExplorationService, private _flightService: FlightService) { }

  ngOnInit(): void {}

}
