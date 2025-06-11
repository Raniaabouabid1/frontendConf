import { Routes } from "../../node_modules/@angular/router/router_module.d-mlGavL8F";
import { PaperCreationComponent } from "./components/Paper/paper-creation/paper-creation.component";
import { PaperDetailsComponent } from "./components/Paper/paper-details/paper-details.component";
import { PaperListComponent } from "./components/Paper/paper-list/paper-list.component";
import { ActivateAccountComponent } from "./components/activate-account/activate-account.component";
import { AddEditAdminComponent } from "./components/admin/add-edit-admin/add-edit-admin.component";
import { AdminLoginComponent } from "./components/admin/admin-login/admin-login.component";
import { AdminComponent } from "./components/admin/admin.component";
import { ManageAdminsComponent } from "./components/admin/manage-admins/manage-admins.component";
import { LoginComponent } from "./components/login/login.component";
import { EditComponent } from "./components/profile/edit/edit.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { SignupComponent } from "./components/signup/signup.component";

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'edit', pathMatch: 'full' },
      { path: 'edit', component: EditComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'manage-admins', component: ManageAdminsComponent },
      { path: 'manage-admins/add', component: AddEditAdminComponent },
    ]
  },
  { path: 'admin/login', component: AdminLoginComponent },

  { path: 'event/:eventId/paper-list', component: PaperListComponent },
  { path: 'event/:eventId/papers/:paperId', component: PaperDetailsComponent },
  { path: 'event/papers/create', component: PaperCreationComponent },

  
  { path: '**', redirectTo: '' }
];
