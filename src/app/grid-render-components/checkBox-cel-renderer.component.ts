import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'check-box-cell-renderer',
  template: `
  <label class="checkbox">
    <input type="checkbox" [(ngModel)]="state" (ngModelChange)="onChange(state)">
  </label>
  `,
})
export class CheckBoxCellRenderer implements ICellRendererAngularComp {
  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}
  private params: any;
  public state: boolean = false;

  agInit(params: any): void {
    this.params = params;
    this.state = this.params.data[this.params.column.colId] || false;
  }

  onChange(value: any){
    if (this.params.onChange instanceof Function) {
      const params = {
        value: value,
        rowData: this.params.node.data
      }
      params.rowData[this.params.column.colId] = value;
      this.params.onChange(params);
    }
  }
}
