import { Injectable } from '@angular/core';
import { Author, Author2 } from '../interfaces/author.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private readonly apiUrl = `${environment.apiBaseUrl}/authors`;
  

  constructor(private http: HttpClient) {}


  setHeaders(): HttpHeaders {
    console.log("Secret Token: ", localStorage.getItem('jwt'));
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });
  }

  setHeaders2(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });
  }

  getAvailableAuthors(): Observable<Author[]> {
    const headers = this.setHeaders();
    return this.http.get<Author[]>(`${this.apiUrl}`, { headers });
  }

  createAuthors(authors: Author2[]): Observable<Author[]> {
    const headers = this.setHeaders();
    return this.http.post<Author[]>(`${this.apiUrl}`, authors, { headers });
  }
  
}
