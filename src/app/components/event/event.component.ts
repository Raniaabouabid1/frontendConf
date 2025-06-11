import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../interfaces/event.interface';
import {DatePipe, NgClass} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { environment } from '../../environments/environment';
import {PaginationComponent} from '../pagination/pagination.component';
import {JwtDecoderService} from '../../services/jwt-decoder.service';
import {EventModalComponent} from './event-modal/event-modal.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  imports: [
    NgClass,
    DatePipe,
    RouterLink,
    PaginationComponent,
    EventModalComponent,
  ],
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  pagedEvents: Event[][] = [];
  currentPage: number = 0;
  cardsPerPage = 6;
  selectedEvent: Event | null = null;
  isAuthor : boolean = false;
  isChairman : boolean = false;
  isAttendee : boolean = true;
  isBoardDirector: boolean = false;

  constructor(private eventService: EventService, private router: Router, private jwtDecoder: JwtDecoderService) {
    if (!this.jwtDecoder.extractRoles()) {
      this.router.navigate(['/']);
      return;
    }

    const roles = localStorage.getItem('roles');
    if (roles) {
      this.isAuthor = roles.includes('Author');
      this.isChairman = roles.includes('Chairman');
      this.isBoardDirector = roles.includes('BoardDirector');
    }
  }

  openModal(event: Event) {
    this.selectedEvent = event;
  }


  private toLogoUrl(raw: string | null): string {
    if (!raw) return 'assets/event-default.jpg';
    const cleaned = raw.trim();

    if (cleaned.startsWith('/')) {
      return `${environment.issuer.replace(/\/+$/, '')}${cleaned}`;
    }
    return cleaned;
  }

  ngOnInit() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events.map(ev => ({ ...ev, logo: this.toLogoUrl(ev.logo) }));
      this.pagedEvents = this.chunkEvents(this.events, this.cardsPerPage);
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
