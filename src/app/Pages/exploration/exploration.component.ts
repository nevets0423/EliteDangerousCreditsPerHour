import { FlightService } from './../../services/flight.service';
import { Component, OnInit } from '@angular/core';
import { ExplorationService } from 'src/app/services/exploration.service';

@Component({
  selector: 'app-exploration',
  templateUrl: './exploration.component.html',
  styleUrls: ['./exploration.component.css']
})
export class ExplorationComponent implements OnInit {
  public HasBeenScanned(){
    return this._explorationService.SystemScanned();
  }

  public SystemName(){
    return this._explorationService.System();
  }

  public Progress(){
    return this._explorationService.Progress();
  }

  public BodyCount() {
    return this._explorationService.BodyCount();
  }

  public JumpsRemaining(){
    return this._flightService.JumpsRemaining;
  }

  constructor(private _explorationService: ExplorationService, private _flightService: FlightService) { }

  ngOnInit(): void {}

}
