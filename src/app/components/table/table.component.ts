import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CellStatus } from '../../enums/cell-status.enum';
import { CellCoordinates } from '../../interfaces/cell-coordinates';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  readonly CellStatus = CellStatus;
  
  @Input() tableGridData: CellStatus[][] = [];
  @Output() cellClicked = new EventEmitter<CellCoordinates>();


  trackByRow(index: number, row: any[]) {
    return index + '-' + row.join(',');
  }

  trackByCell(index: number, cell: CellStatus) {
    return index + '-' + cell ;
  }

  onCellClick(row: number, col: number) {
    this.cellClicked.emit({ row, col });
  }
}
