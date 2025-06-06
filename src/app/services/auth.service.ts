import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginPayload } from '../interfaces/login-payload.interface';
import { environment } from '../environments/environment';
import {LoginResponse} from '../interfaces/login-response.interface';
import {LoginError} from '../interfaces/login-error.interface';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth/login`;

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginPayload) : void {
    const loginResponseObservable  : Observable<LoginResponse> = this.http.post<LoginResponse>(
      this.apiUrl, payload
    );

    console.log("Logging in...")
    loginResponseObservable.subscribe({
      next: (res : LoginResponse) => {
        console.log('Login success');
        localStorage.setItem("jwt", res.accessToken);
        this.router.navigate(['/profile']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.error && typeof err.error === 'object') {
          const loginError = err.error as LoginError;
          console.error(`Login failed [${loginError.status}]: ${loginError.message}`);
        } else {
          console.error('Unexpected error:', err);
        }
      }
    });
  }
}
