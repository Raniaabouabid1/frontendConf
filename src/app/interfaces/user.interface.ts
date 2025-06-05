import {Diploma} from './diploma.interface';

export interface User {
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
  Diplomas: Diploma[];
}
