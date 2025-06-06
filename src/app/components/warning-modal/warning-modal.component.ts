import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-warning-modal',
  imports: [],
  templateUrl: './warning-modal.component.html',
  styleUrl: './warning-modal.component.css'
})
export class WarningModalComponent {
  @Input() h3: string = '';
  @Input() message: string = '';
  @Output() respond : EventEmitter<boolean> = new EventEmitter<boolean>();

  sendResponse(value: boolean) {
    this.respond.emit(value);
  }
}
