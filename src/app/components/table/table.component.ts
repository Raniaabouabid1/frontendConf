import {Component, Input, SimpleChanges} from '@angular/core';
import {UserBasicInfo} from '../../interfaces/user-basic-info.interface';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {JwtDecoderService} from '../../services/jwt-decoder.service';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-table',
  imports: [
    NgClass
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  entity: string = "";
  formRoute: string = "";
  viewUserRoute: string = "";

  users: UserBasicInfo[] = [];

  page: number = 1;
  pageSize: number = 8;
  totalUsers: number = 1;
  totalPages: number = 1;
  pagination: number[] = [1];

  constructor(private router: Router, private authService: AuthService, private jwtDecoder: JwtDecoderService, private adminService: AdminService) {
    if (!this.authService.isAdmin(this.router, this.jwtDecoder, '/admin/login')) {
      this.router.navigate(['/403']);
      return;
    }

    this.entity = this.router.url.slice(this.router.url.indexOf('manage')).split('-')[1];
    this.formRoute = `/admin/manage-${this.entity}/add`;
    this.viewUserRoute = `/admin/manage-${this.entity}/edit`;

    this.getUsers();
  }

  getUsers(): void {
    console.log(this.entity);
    console.log(this.formRoute);
    console.log(this.viewUserRoute);
    this.adminService.getUsers(this.entity, this.page, this.pageSize).subscribe({
      next: data => {
        console.log(data);
        this.users = data.users;
        this.totalUsers = data.count;
        this.totalPages = Math.ceil(data.count / this.pageSize);
        this.pagination = Array.from({length: this.totalPages}, (_, i) => i + 1);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  badgeColor(accountStatus: string) {
    return {
      'badge-green': accountStatus === 'Verified',
      'badge-yellow': accountStatus === 'PendingVerification',
      'badge-red': accountStatus === 'Rejected',
      'badge-gray': accountStatus === 'Deleted'
    }
  }

  view(id: string) {
    this.router.navigate([this.viewUserRoute, id]); // ✅ correct
  }

  prev() {
    this.page = this.page - 1;
    this.getUsers();
  }

  next() {
    this.page = this.page + 1;
    this.getUsers();
  }

  navigateToForm() {
    this.router.navigate([this.formRoute]);
  }
}
