import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameStatus } from '../../interfaces/game-status';
import { SoundService } from '../../Services/sound.service';

@Component({
  selector: 'app-controls',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {
  isGameStarted = false;
  minDelayValue = 500;
  maxDelayValue = 5000;
  form: FormGroup;
  @Output() gameStatusChanged = new EventEmitter<GameStatus>();

  constructor(private fb: FormBuilder, private soundService: SoundService) {
    this.form = this.fb.group({
      delayControl: [
        this.minDelayValue,
        [
          Validators.required,
          Validators.min(this.minDelayValue),
          Validators.max(this.maxDelayValue)
        ]
      ]
    });
  }

  get btnLabel() {
    return this.isGameStarted ? 'Skip Game' : 'Start Game';
  }

  get delayControl() {
    return this.form.get('delayControl');
  }

  allowDigits(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const char = event.key;
    if (!/[0-9]/.test(char)) {
      this.soundService.Incorrect();
      event.preventDefault();
    }
    input.value = input.value.replace(/^0+/, '');
  }

  onStartSkip() {
    this.isGameStarted = !this.isGameStarted;
    const payload: GameStatus = { isActive: this.isGameStarted };
    if (this.isGameStarted) {
      payload.delay = Number(this.delayControl?.value);
      this.delayControl?.disable();
    } else {
      this.delayControl?.enable();
    }
    this.gameStatusChanged.emit(payload);
  }

}
