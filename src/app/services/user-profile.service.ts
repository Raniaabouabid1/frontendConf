import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {UserProfile} from '../interfaces/user-profile.interface';
import {Observable} from 'rxjs';
import {LoginResponse} from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  readonly ROOT_URL = 'http://localhost:5280/api/v1';

  // private userProfileObservable: Observable<UserProfile> = new Observable<UserProfile>();
  //
  // private userProfile: UserProfile = {
  //   description: "",
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phoneNumber: "",
  //   birthdate: "",
  //   address: "",
  //   expertise: ""
  // };

  constructor(private http: HttpClient) {}

  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthdate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthdate.getFullYear();
      const isTooYoung = age < minAge || (age === minAge && today < new Date(birthdate.setFullYear(birthdate.getFullYear() + minAge)));
      return isTooYoung ? {tooYoung: true} : null;
    };
  }

  setHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });
  }

  getUserProfileInformation(){
    let headers: HttpHeaders = this.setHeaders();
    return this.http.get<UserProfile>(this.ROOT_URL + '/users/profile', {headers: headers});
  }
}
