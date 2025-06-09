import { Routes } from '@angular/router';
import{LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {EditComponent} from './components/profile/edit/edit.component';
import {ProfileComponent} from './components/profile/profile.component';
import {EventListComponent} from './components/event-list/event-list.component';
import {RequestEventComponent} from './components/request-event/request-event.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'edit', pathMatch: 'full' },
      { path: 'edit', component: EditComponent },
    ]
  },
  { path: 'events', component: EventListComponent },
  { path: 'request-event', component: RequestEventComponent },

  { path: '**', redirectTo: '' }
];
