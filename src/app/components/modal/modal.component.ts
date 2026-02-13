import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { ModalService } from '../../Services/modal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  isOpen$!: Observable<boolean>;
  @Output() close = new EventEmitter<void>();

  constructor(private modalService: ModalService) {
    this.isOpen$ = this.modalService.modalState$;
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.onClose();
  }

  onClose() {
    this.close.emit();
    this.modalService.close();
  }
}
