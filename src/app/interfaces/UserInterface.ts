import {DiplomaInterface} from './DiplomaInterface';

export interface UserInterface {
  Roles: string[];
  Expertise: string;
  IsInternal: boolean;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Birthdate: string;
  Address: string;
  Password: string;
  Diplomas: DiplomaInterface[];
}
