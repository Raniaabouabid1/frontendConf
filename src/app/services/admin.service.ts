import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {AuthService} from './auth.service';
import {UserBasicInfoResponse} from '../interfaces/user-basic-info-response.interface';
import {UserBasicInfo} from '../interfaces/user-basic-info.interface';

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

  addUpdateUser(user: UserBasicInfo, add: boolean) {
    const headers = this.authService.setHeaders();

    if (add)
      return this.http.post(this.URL, user, headers);

    return this.http.put(`${this.URL}/${user.id}`, user, headers);
  }

  deleteUser(entity: string, id: string) {
    const headers = this.authService.setHeaders();
    const endpoint = `${environment.apiBaseUrl}/${entity}/${id}`;

    return this.http.delete(endpoint, headers);
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

  getUserById(entity: string, id: string) {
    const headers = this.authService.setHeaders();
    const endpoint = `${environment.apiBaseUrl}/${entity}/${id}`;

    return this.http.get<UserBasicInfo>(endpoint, headers);
  }
}
