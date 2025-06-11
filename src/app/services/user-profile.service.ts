import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {UserProfile} from '../interfaces/user-profile.interface';
import {Observable} from 'rxjs';
import {LoginResponse} from '../interfaces/login-response.interface';
import {environment} from '../environments/environment';
import {ChangePassword} from '../interfaces/change-password.interface';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  readonly ROOT_URL = environment.apiBaseUrl + '/users/profile';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthdate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthdate.getFullYear();
      const isTooYoung = age < minAge || (age === minAge && today < new Date(birthdate.setFullYear(birthdate.getFullYear() + minAge)));
      return isTooYoung ? {tooYoung: true} : null;
    };
  }



  getUserProfileInformation() {
    let headers = this.authService.setHeaders();
    return this.http.get<UserProfile>(this.ROOT_URL, headers);
  }

  editUserProfileInformation(userProfile: UserProfile) {
    let headers = this.authService.setHeaders();
    console.log(userProfile);

    return this.http.put(this.ROOT_URL, userProfile, headers)
  }

  editAccountPassword(passwords: ChangePassword) {
    let headers = this.authService.setHeaders();
    return this.http.put(this.ROOT_URL + "/password", passwords, headers);
  }

  fieldsMatchValidator(field1: string, field2: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control1 = group.get(field1);
      const control2 = group.get(field2);

      if (!control1 || !control2) return null;

      if (control1.value === control2.value) {
        control2.setErrors(null);
        return null;
      }

      control2.setErrors({ fieldsMismatch: true });
      return null;
    };
  }

}
