import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserProfile} from '../interfaces/user-profile.interface';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  URL : string = environment.apiBaseUrl + '/admins';
  constructor(private http: HttpClient) { }

  createAdmin(admin: UserProfile) {
    return this.http.post(this.URL, admin);
  }
}
