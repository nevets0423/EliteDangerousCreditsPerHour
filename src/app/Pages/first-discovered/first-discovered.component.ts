import { CopyButtonCellRenderer } from './../../grid-render-components/clip-board-copy-cel-renderer.component';
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
  public hideNewSystems: boolean = true;
  public newSystemsDefaultColDef = {
    sortable: true,
    filter: false,
  };
  public systemsDefaultColDef = {
    sortable: true,
    filter: true,
  };

  public frameworkComponents = {
    checkBoxCellRenderer: CheckBoxCellRenderer,
    copyButtonCellRenderer: CopyButtonCellRenderer
  };

  public paginationPageSize = 10;
  public newSystemsRowData: any[] = [];
  public systemsRowData: any[] = [];
  public systemsColumnDefs = [
    {
      headerName: '',
      field: 'SystemName',
      cellRenderer: 'copyButtonCellRenderer',
      width: 50
    },
    {headerName: 'SystemName', field: 'SystemName'},
    {headerName: 'Light Years', field: 'dist'}
  ];
  public newSystemsColumnDefs = [
    {headerName: 'FirstDiscovered',
      field: 'PossibleFirstDiscovery',
      cellRenderer: 'checkBoxCellRenderer',
      width: 50,
      cellRendererParams: {
        onChange: this.onCellChanged.bind(this)
      }
    },
    {headerName: 'New SystemName', field: 'SystemName'}
  ];

  constructor(private _explorationService: ExplorationService) { }
  private api: any;

  ngOnInit(): void {
    this._explorationService.SystemDataSold.subscribe(value => {
      this.newSystemsRowData = [...this.newSystemsRowData, ...value.filter(r => r.PossibleFirstDiscovery)];
      this.hideNewSystems = false;
    });

    this._explorationService.FirstDiscoveredSystems().subscribe(value =>{
      this.systemsRowData = value;
    });
  }

  public SaveClicked(){
    var systemsToSave = this.newSystemsRowData
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

  onMainGridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.api.sizeColumnsToFit();
    this.api.setRowData(this.systemsRowData);
  }
}
