import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Event } from '../../interfaces/event.interface';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  imports: [
    DatePipe
  ],
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent {
  @Input() event!: Event;
  @Output() close = new EventEmitter<void>();
}
