import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TableComponent } from './components/table/table.component';
import { ControlsComponent } from './components/controls/controls.component';
import { GameStatus } from './interfaces/game-status';
import { Score } from './interfaces/score';
import { CellCoordinates } from './interfaces/cell-coordinates';
import { CellStatus } from './enums/cell-status.enum';
import { ModalComponent } from './components/modal/modal.component';
import { Winner } from './enums/winner.enum';
import { SoundService } from './Services/sound.service';
import { CommonModule } from '@angular/common';
import { ModalService } from './Services/modal.service';

@Component({
  selector: 'app-root',
  imports: [TableComponent, ControlsComponent, ModalComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly tableSize = 10;
  private readonly winScore = 10;
  currentScore: Score = { player: 0, computer: 0 };
  gameStatus: GameStatus = { isActive: false };
  private currentActiveCell: CellCoordinates | null = null;
  winner: Winner | null = null;
  readonly Winner = Winner;
  private timeoutId: any;
  tableGridData: CellStatus[][] = [];
  @ViewChild('controls') controlsComponent!: ControlsComponent;

  constructor(private soundService: SoundService, private modalService: ModalService, private cdr: ChangeDetectorRef) {
    this.initTableCells();
  }

  private initTableCells() {
    this.tableGridData = Array.from({ length: this.tableSize }, () =>
      Array(this.tableSize).fill(CellStatus.NotSelected)
    );
  }

  private resetScore() {
    this.currentScore = { player: 0, computer: 0 };
    this.winner = null;
  }

  gameStatusChanged(event: GameStatus) {
    this.gameStatus = event;
    this.resetScore();
    this.initTableCells();
    if (this.gameStatus.isActive) {
      this.soundService.LetsGo();
      this.nextTry();
    }
  }

  private nextTry() {
    if (this.currentActiveCell) {
      const { row, col } = this.currentActiveCell;
      if (this.tableGridData[row][col] === CellStatus.Active) {
        this.immutableUpdateTableCell(row, col, CellStatus.Failed);
        this.currentScore.computer += 1;
      }
    }

    if (this.checkIsGameOver()) return;

    const { row, col } = this.createUniqueRandomCell();

    this.timeoutId = setTimeout(() => {
      if (this.tableGridData[row][col] === CellStatus.Active) {
        this.immutableUpdateTableCell(row, col, CellStatus.Failed);
        this.currentScore.computer += 1;
        this.nextTry();
      }
    }, this.gameStatus.delay);
  }

  private checkIsGameOver() {
    if (this.currentScore.player >= this.winScore || this.currentScore.computer >= this.winScore) {
      this.gameStatus.isActive = false;
      this.winner = this.currentScore.player >= this.winScore ? Winner.Player : Winner.Computer;
      this.openModal();
      this.winner === Winner.Player ? this.soundService.Success() : this.soundService.Failed();
      return true;
    }
    return false;
  }

  private getRandomNumber() {
    return Math.floor(Math.random() * this.tableSize);
  }

  createUniqueRandomCell() {
    while (true) {
      const { row, col } = {
        row: this.getRandomNumber(),
        col: this.getRandomNumber()
      };
      if (this.tableGridData[row][col] === CellStatus.NotSelected) {
        this.immutableUpdateTableCell(row, col, CellStatus.Active);
        this.currentActiveCell = { row, col };
        return this.currentActiveCell;
      }
    }
  }

  handleCellClick(coords: CellCoordinates) {
    if (this.gameStatus.isActive) {
      const { row, col } = coords;
      if (this.tableGridData[row][col] === CellStatus.Active) {
        this.immutableUpdateTableCell(row, col, CellStatus.Success);
        this.currentScore.player += 1;
        clearTimeout(this.timeoutId);
        this.nextTry();
      }
    }
  }

  private immutableUpdateTableCell(row: number, col: number, status: CellStatus) {
    this.tableGridData = this.tableGridData.map((rowTable, rowIndex) =>
      rowIndex === row
        ? rowTable.map((cell, cellIndex) => (cellIndex === col ? status : cell))
        : rowTable
    );
    this.cdr.markForCheck();
  }

  private openModal() {
    this.modalService.open();
  }

  closeModal() {
    this.controlsComponent.onStartSkip()
  }
}
