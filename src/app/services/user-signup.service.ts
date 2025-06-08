import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user.interface';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserSignupService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth/register`;

  constructor(private http: HttpClient) {
  }

  registerUser(data: User): Observable<any> {
    const formData = new FormData();

    data.Roles.forEach(role => {
      formData.append('Roles', role);
    });

    formData.append('FirstName', data.FirstName);
    formData.append('LastName', data.LastName);
    formData.append('Email', data.Email);
    formData.append('PhoneNumber', data.PhoneNumber);
    formData.append('Birthdate', data.Birthdate);
    formData.append('Address', data.Address);
    formData.append('Password', data.Password);
    if (data.Roles.includes("Chairman")) {
      formData.append('IsInternal', data.IsInternal ? "true" : "false");
    }

    if (data.Roles.includes("Author")) {
      formData.append('Expertise', data.Expertise);
    }

    if (data.Diplomas.length === 0) {
      formData.append('Diplomas', '[]');
    } else {
      data.Diplomas.forEach((diploma, index) => {
        formData.append(`Diplomas[${index}].Title`, diploma.Title);
        formData.append(`Diplomas[${index}].IssueDate`, diploma.IssueDate);
        formData.append(`Diplomas[${index}].DiplomaFile`, diploma.DiplomaFile);
      });
    }

    console.log("FormData content:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return this.http.post(this.apiUrl, formData);
  }
}
