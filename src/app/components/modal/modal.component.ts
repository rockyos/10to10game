import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isOpen) {
      this.onClose();
    }
  }

  onClose() {
    this.close.emit();
  }
}
