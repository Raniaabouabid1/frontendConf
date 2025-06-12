import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginPayload } from '../interfaces/login-payload.interface';
import { environment } from '../environments/environment';
import {LoginResponse} from '../interfaces/login-response.interface';
import {LoginError} from '../interfaces/login-error.interface';
import {Router} from '@angular/router';
import {AccountActivationPayload} from '../interfaces/account-activation-payload.interface';
import {JwtDecoderService} from './jwt-decoder.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  setHeaders() {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    return {headers: headers};
  }

  login(payload: LoginPayload) : Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + "/login", payload);
  }

  activateAccount(payload: AccountActivationPayload, userId: string) {
    return this.http.post(`${this.apiUrl}/activate-account/${userId}`, payload);
  }

  getRoles(router: Router, jwtDecoder: JwtDecoderService, route: string) {
    let roles = localStorage.getItem('roles');
    if (!roles) {
      const extracted = jwtDecoder.extractRoles();
      if (!extracted) {
        localStorage.removeItem('jwt');
        router.navigate([route]);
        return;
      }

      roles = localStorage.getItem('roles');
    }

    return roles;
  }

  isAdmin(router: Router, jwtDecoder: JwtDecoderService, route: string) {
    const roles = this.getRoles(router, jwtDecoder, route);

    if (!roles)
      return false;

    return roles.includes("Admin");
  }

  logout(router: Router) {
    const roles = localStorage.getItem('roles') ?? "";
    localStorage.removeItem('jwt');
    localStorage.removeItem('roles');

    if (roles.includes("Admin")) {
      router.navigate(['/admin/login']);
      return;
    }

    router.navigate(['/']);
  }
}
