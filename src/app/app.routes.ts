import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {EditComponent} from './components/profile/edit/edit.component';
import {ProfileComponent} from './components/profile/profile.component';
import {AdminComponent} from './components/admin/admin.component';
import {ActivateAccountComponent} from './components/activate-account/activate-account.component';
import {EventComponent} from './components/event/event.component';
import {RequestEventComponent} from './components/event/request-event/request-event.component';
import {ForbiddenComponent} from './components/error-pages/forbidden/forbidden.component';
import {TableComponent} from './components/table/table.component';
import {AddEditUserComponent} from './components/add-edit-user/add-edit-user.component';

export const routes: Routes = [
  {path: '', component: LoginComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: '403', component: ForbiddenComponent},
  {path: 'activate-account', component: ActivateAccountComponent},
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {path: '', redirectTo: 'edit', pathMatch: 'full'},
      {path: 'edit', component: EditComponent}
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: 'manage-admins', component: TableComponent},
      {path: 'manage-admins/add', component: AddEditUserComponent},
      {path: 'manage-admins/edit/:userId', component: AddEditUserComponent},
      {path: 'manage-users', component: TableComponent},
      {path: 'manage-users/add', component: AddEditUserComponent},
      {path: 'manage-users/edit/:userId', component: AddEditUserComponent},
    ]
  },
  {path: 'events', component: EventComponent},
  {path: 'request-event', component: RequestEventComponent},
  {path: 'admin/login', component: LoginComponent},
  {path: '**', redirectTo: ''}
];
