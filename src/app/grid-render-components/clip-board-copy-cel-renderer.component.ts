import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'copy-button-cell-renderer',
  template: `
  <button (click)="Clicked()" class="center">Copy</button>
  `,
})
export class CopyButtonCellRenderer implements ICellRendererAngularComp {
  constructor(private _clipboard: Clipboard) {}

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  Clicked(){
    this._clipboard.copy(this.params.data[this.params.column.colId])
  }
}
