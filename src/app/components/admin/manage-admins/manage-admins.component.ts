import {ChangeDetectorRef, Component, Input, SimpleChanges} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {UserProfileService} from '../../../services/user-profile.service';
import {JwtDecoderService} from "../../../services/jwt-decoder.service";
import {Router} from "@angular/router";
import {AdminService} from '../../../services/admin.service';
import {Admin} from '../../../interfaces/admin.interface';
import {NgClass} from '@angular/common';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-manage-admins',
  imports: [
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './manage-admins.component.html',
  styleUrl: './manage-admins.component.css'
})
export class ManageAdminsComponent {
  @Input() isAuthor: boolean = false;
  message: string = "Are you sure you want to persist the changes made to your profile? This action is irreversible!"
  showAlert: boolean = false;
  errorMsg: string = "";
  src: string = '';
  color: string = '';
  email: string = '';
  admins: Admin[] = [];
  page: number = 1;
  totalPages: number = 1;
  pagination: number[] = [1];
  pageSize: number = 6;
  totalAdmins: number = 8;

  constructor(
    private jwtDecoder: JwtDecoderService,
    private router: Router,
    private adminService: AdminService,
    private authService: AuthService,
  ) {
    if (!this.authService.isAdmin(this.router, this.jwtDecoder, '/admin/login')) {
      this.router.navigate(['/403']);
      return;
    }

    this.getAdmins();
  }

  badgeColor(accountStatus: string) {
    return {
      'badge-green': accountStatus === 'Verified',
      'badge-yellow': accountStatus === 'PendingVerification',
      'badge-red': accountStatus === 'Rejected',
      'badge-gray': accountStatus === 'Deleted'
    }
  }

  getAdmins(): void {
    this.adminService.getAdmins(this.page, this.pageSize).subscribe({
      next: data => {
        console.log(data);
        this.admins = data.admins;
        this.totalAdmins = data.count;
        this.totalPages = Math.ceil(data.count / this.pageSize);
        this.pagination = Array.from({length: this.totalPages}, (_, i) => i + 1);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  navigateToForm() {
    this.router.navigate(['/admin/manage-admins/add'])
  }

  prev() {
    this.page = this.page - 1;
    this.getAdmins();
  }

  next() {
    this.page = this.page + 1;
    this.getAdmins();
  }

  view(id: string) {
    this.router.navigate([`/admin/manage-admins/edit`, id]); // ✅ correct
  }
}
