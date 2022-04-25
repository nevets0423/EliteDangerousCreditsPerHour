import { Component, OnInit } from '@angular/core';
import { ExplorationService } from 'src/app/services/exploration.service';
import { CheckBoxCellRenderer } from 'src/app/grid-render-components/checkBox-cel-renderer.component';
import { GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-first-discovered',
  templateUrl: './first-discovered.component.html',
  styleUrls: ['./first-discovered.component.css']
})
export class FirstDiscoveredComponent implements OnInit {
  public defaultColDef = {
    sortable: true,
    filter: false,
  };
  public frameworkComponents = {
    checkBoxCellRenderer: CheckBoxCellRenderer
  };
  public paginationPageSize = 10;
  public rowData: any[] = [];
  public columnDefs = [
    {headerName: 'FirstDiscovered',
      field: 'PossibleFirstDiscovery',
      cellRenderer: 'checkBoxCellRenderer',
      width: 50,
      cellRendererParams: {
        onChange: this.onCellChanged.bind(this)
      }
    },
    {headerName: 'SystemName', field: 'SystemName'}
  ];

  constructor(private _explorationService: ExplorationService) { }

  ngOnInit(): void {
    this._explorationService.SystemDataSold.subscribe(value => {
      this.rowData = value.filter(r => r.PossibleFirstDiscovery);
    });
  }

  public SaveClicked(){
    var systemsToSave = this.rowData
      .filter(r => r.PossibleFirstDiscovery)
      .map(r => {
        return {
          SystemName: r.SystemName,
          FirstDiscovery: true
        }
      });
    this._explorationService.SaveSystemData(systemsToSave);
    this._explorationService.ClearSystemSavedData();
  }

  onCellChanged(event: any){}

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }
}
