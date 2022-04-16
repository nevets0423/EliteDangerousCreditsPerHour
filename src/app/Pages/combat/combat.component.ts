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
        total: this._combatService.CreditsFromVouchersBounty.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsFromVouchersBounty).toLocaleString()
      },{
        event: "Bounties (unclaimed)",
        total: this._combatService.PotentialCreditsFromBounty.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.PotentialCreditsFromBounty).toLocaleString()
      },{
        event: "Missions",
        total: this._combatService.CreditsFromMission.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsFromMission).toLocaleString()
      },{
        event: "Bonds",
        total: this._combatService.CreditsFromVouchersBond.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsFromVouchersBond).toLocaleString()
      },{
        event: "Ammo Cost",
        total: this._combatService.CreditsSpentAmmo.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentAmmo).toLocaleString()
      },{
        event: "Drone Cost",
        total: this._combatService.CreditsSpentDrones.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentDrones).toLocaleString()
      },{
        event: "Fule Cost",
        total: this._combatService.CreditsSpentFuel.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentFuel).toLocaleString()
      },{
        event: "Repair Cost",
        total: this._combatService.CreditsSpentRepair.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentRepair).toLocaleString()
      },{
        event: "Restock Vehicle",
        total: this._combatService.CreditsSpentRestockVehicle.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentRestockVehicle).toLocaleString()
      },{
        event: "Paid Bounties",
        total: this._combatService.CreditsSpentBounties.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentBounties).toLocaleString()
      },{
        event: "Paid Fines",
        total: this._combatService.CreditsSpentFines.toLocaleString(),
        perHour: this._combatService.PerHour(this._combatService.CreditsSpentFines).toLocaleString()
      }];
    });
  }

  onGridReady(params: GridReadyEvent) {
    this._gridApi = params.api;
    this._gridApi.setRowData(this.rowData);
  }
}
