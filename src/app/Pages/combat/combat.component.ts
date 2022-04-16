import { CombatService } from './../../services/combat.service';
import { Component, OnInit } from '@angular/core';
import { GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.css']
})
export class CombatComponent implements OnInit {
  private _gridApi: any;
  public defaultColDef = {
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100
  };

  public rowData: any[] = [];
  public columnDefs = [
    {headerName: 'Event', field: 'event'},
    {headerName: 'Total', field: 'total'},
    {headerName: 'Per Hour', field: 'perHour'},
  ];

  public get CreditsPerHour() : number {
    return this._combatService.CreditsPerHour;
  }

  constructor(private _combatService: CombatService) { }

  ngOnInit(): void {
    this._combatService.Updated.subscribe(() => {
      this.rowData = [{
        event: "Bounties",
        total: this._combatService.CreditsFromVouchersBounty,
        perHour: this._combatService.PerHour(this._combatService.CreditsFromVouchersBounty)
      },{
        event: "Missions",
        total: this._combatService.CreditsFromMission,
        perHour: this._combatService.PerHour(this._combatService.CreditsFromMission)
      },{
        event: "Bonds",
        total: this._combatService.CreditsFromVouchersBond,
        perHour: this._combatService.PerHour(this._combatService.CreditsFromVouchersBond)
      },{
        event: "Ammo Cost",
        total: this._combatService.CreditsSpentAmmo,
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentAmmo)
      },{
        event: "Drone Cost",
        total: this._combatService.CreditsSpentDrones,
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentDrones)
      },{
        event: "Fule Cost",
        total: this._combatService.CreditsSpentFuel,
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentFuel)
      },{
        event: "Repair Cost",
        total: this._combatService.CreditsSpentRepair,
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentRepair)
      },{
        event: "Restock Vehicle",
        total: this._combatService.CreditsSpentRestockVehicle,
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentRestockVehicle)
      },{
        event: "Paid Bounties",
        total: this._combatService.CreditsSpentBounties,
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentBounties)
      },{
        event: "Paid Fines",
        total: this._combatService.CreditsSpentFines,
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentFines)
      }];
    });
  }

  onGridReady(params: GridReadyEvent) {
    this._gridApi = params.api;
    this._gridApi.setRowData(this.rowData);
  }
}
