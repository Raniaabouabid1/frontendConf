import { Routes } from '@angular/router';
import{LoginComponent} from './components/login/login';
import {SignupComponent} from './components/signup/signup';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];
