import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../interfaces/event.interface';
import {environment} from '../environments/environment';
import { ChairmanSuggestion } from '../interfaces/chairman-suggestion.interface';   // <-- import

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth/events`;

  constructor(private http: HttpClient) {}

  setHeaders(): HttpHeaders {
    console.log("Secret Token: ", localStorage.getItem('jwt'));
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });
  }

  getEvents(): Observable<Event[]> {
    console.log('Sending request to:', this.apiUrl);
    const headers = this.setHeaders();
    return this.http.get<Event[]>(this.apiUrl, { headers });
  }

  uploadLogo(formData: FormData): Observable<{ path: string }> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    return this.http.post<{ path: string }>(`${this.apiUrl}/upload-logo`, formData, { headers });
  }

  submitEventRequest(eventDto: Event): Observable<any> {
    console.log(`Sending request to:${this.apiUrl}`);
    console.log(`ACCESS_TOKEN :`+ localStorage.getItem('jwt'));
    const headers = this.setHeaders();
    return this.http.post(`${this.apiUrl}`, eventDto,{headers});
  }
  getChairmen(term: string) {
    const headers = this.setHeaders();
    return this.http.get<ChairmanSuggestion[]>(`${environment.apiBaseUrl}/chairmen?q=${term}`, { headers });
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }
}


