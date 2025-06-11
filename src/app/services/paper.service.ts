import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Paper } from '../interfaces/paper.interface';

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  private readonly apiUrl = `${environment.apiBaseUrl}/events`;

  constructor(private http: HttpClient) {}

  private setHeaders(): HttpHeaders {
    console.log('JWT Token:', localStorage.getItem('jwt'));
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });
  }

  getPapersByEventId(eventId: string): Observable<Paper[]> {
    const headers = this.setHeaders();
    const url = `${this.apiUrl}/${eventId}/papers`;
    console.log('Fetching papers from:', url);
    return this.http.get<Paper[]>(url, { headers });
  }

  getPaperById(eventId: string, paperId: string): Observable<Paper> {
    const headers = this.setHeaders();
    const url = `${this.apiUrl}/${eventId}/papers/${paperId}`;
    return this.http.get<Paper>(url, { headers });
  }
}
