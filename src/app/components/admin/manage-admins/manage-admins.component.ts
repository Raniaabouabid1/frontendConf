import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TableComponent} from '../../table/table.component';

@Component({
  selector: 'app-manage-admins',
  imports: [
    ReactiveFormsModule,
    TableComponent,
  ],
  templateUrl: './manage-admins.component.html',
  styleUrl: './manage-admins.component.css'
})
export class ManageAdminsComponent {
  entity: string = 'admins';
  formRoute: string = '/admin/manage-admins/add';
  viewUserRoute: string = '/admin/manage-admins/edit';
}
