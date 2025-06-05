import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterface } from '../interfaces/UserInterface';
import{environment} from '../envirements/envirement';

@Injectable({
  providedIn: 'root'
})
export class UserSignupService {
  private readonly apiUrl = `${environment.apiBaseUrl}/signup`;

  constructor(private http: HttpClient) {}
  registerUser(data: UserInterface): Observable<any> {
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
