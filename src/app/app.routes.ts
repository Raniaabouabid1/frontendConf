import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {EditComponent} from './components/profile/edit/edit.component';
import {ProfileComponent} from './components/profile/profile.component';
import {AdminComponent} from './components/admin/admin.component';
import {ManageAdminsComponent} from './components/admin/manage-admins/manage-admins.component';
import {AddEditAdminComponent} from './components/admin/add-edit-admin/add-edit-admin.component';
import {ActivateAccountComponent} from './components/activate-account/activate-account.component';
import {ForbiddenComponent} from './components/error-pages/forbidden/forbidden.component';

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
      {path: 'manage-admins', component: ManageAdminsComponent},
      {path: 'manage-admins/add', component: AddEditAdminComponent},
      {path: 'manage-admins/edit/:adminId', component: AddEditAdminComponent},
    ]
  },
  {path: 'admin/login', component: LoginComponent},
  {path: '**', redirectTo: ''}
];
