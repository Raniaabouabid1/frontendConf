import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserProfile} from '../interfaces/user-profile.interface';
import {environment} from '../environments/environment';
import {Admin} from '../interfaces/admin.interface';
import {AdminResponse} from '../interfaces/admin-response.interface';
import {AuthService} from './auth.service';
import {UserBasicInfoResponse} from '../interfaces/user-basic-info-response.interface';

interface queryParam {
  key: string;
  value: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  URL : string = environment.apiBaseUrl + '/admins';
  constructor(private http: HttpClient, private authService: AuthService) { }

  createQueryParams(queryParams: queryParam[]) {
    let params = new HttpParams();

    for (const queryParam of queryParams)
      params = params.set(queryParam.key, queryParam.value);

    return {params: params};
  }

  addUpdateAdmin(admin: Admin, add: boolean) {
    const headers = this.authService.setHeaders();
    if (add)
      return this.http.post(this.URL, admin, headers);

    return this.http.put(`${this.URL}/${admin.id}`, admin, headers);
  }

  deleteAdmin(id: string) {
    const headers = this.authService.setHeaders();
    return this.http.delete(`${this.URL}/${id}`, headers);
  }

  getUsers(entity: string, page: number, pageSize: number = 8) {
    const queryParams = this.createQueryParams([
      {key: "page", value: page},
      {key: "pageSize", value: pageSize},
    ]);
    const headers = this.authService.setHeaders();
    const endpoint = `${environment.apiBaseUrl}/${entity}`;

    return this.http.get<UserBasicInfoResponse>(endpoint, {...queryParams, ...headers});
  }

  getAdminById(id: string) {
    const headers = this.authService.setHeaders();
    return this.http.get<Admin>(`${this.URL}/${id}`, headers);
  }
}
