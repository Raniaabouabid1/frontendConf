import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Event } from '../../../interfaces/event.interface';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

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
  @Output() Id = new EventEmitter<string>();

  constructor(private router: Router) {
  }

  viewPapers(id: string) {
    this.router.navigate([`events/${id}/paper-list`]);
  }
}
