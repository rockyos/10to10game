import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CellStatus } from '../../enums/cell-status.enum';
import { GameStatus } from '../../interfaces/game-status';
import { CellCoordinates } from '../../interfaces/cell-coordinates';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  readonly CellStatus = CellStatus;
  
  @Input() tableGridData: CellStatus[][] = [];
  @Output() cellClicked = new EventEmitter<CellCoordinates>();


  trackByRow(index: number, row: any[]) {
    return index;
  }

  trackByCell(index: number, cell: any) {
    return index;
  }

  onCellClick(row: number, col: number) {
    this.cellClicked.emit({ row, col });
  }
}
