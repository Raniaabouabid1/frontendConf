import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../interfaces/event.interface';
import {DatePipe, NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { environment } from '../../environments/environment';
import {EventModalComponent} from '../event-modal/event-modal.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  imports: [
    NgClass,
    DatePipe,
    RouterLink,
    PaginationComponent,
    EventModalComponent,
  ],
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  pagedEvents: Event[][] = [];
  currentPage: number = 0;
  cardsPerPage = 6;
  selectedEvent: Event | null = null;

  constructor(private eventService: EventService) {}

  openModal(event: Event) {
    this.selectedEvent = event;
  }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        console.log('Fetched events:', data);

        this.events = data.map(event => {
          if (event.logo && !event.logo.startsWith('http')) {
            event.logo = `${environment.issuer}${event.logo}`;
          }
          return event;
        });

        this.pagedEvents = this.chunkEvents(this.events, this.cardsPerPage);
        console.log('Paged Events:', this.pagedEvents);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  chunkEvents(events: Event[], size: number): Event[][] {
    const chunks: Event[][] = [];
    for (let i = 0; i < events.length; i += size) {
      chunks.push(events.slice(i, i + size));
    }
    return chunks;
  }

  nextPage() {
    if (this.currentPage < this.pagedEvents.length - 1) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 0) this.currentPage--;
  }
}
