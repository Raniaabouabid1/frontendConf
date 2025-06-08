import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginPayload } from '../interfaces/login-payload.interface';
import { environment } from '../environments/environment';
import {LoginResponse} from '../interfaces/login-response.interface';
import {LoginError} from '../interfaces/login-error.interface';
import {Router} from '@angular/router';
import {AccountActivationPayload} from '../interfaces/account-activation-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginPayload) : Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + "/login", payload);
  }

  activateAccount(payload: AccountActivationPayload, userId: string) {
    return this.http.post(`${this.apiUrl}/activate-account/${userId}`, payload);
  }
}
