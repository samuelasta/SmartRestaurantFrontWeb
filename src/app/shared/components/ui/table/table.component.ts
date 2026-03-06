import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Output() rowClicked = new EventEmitter<any>();

  onRowClick(row: any): void {
    this.rowClicked.emit(row);
  }
}
