import {Component} from '@angular/core';
import {ErrorDivComponent} from "../error-div/error-div.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputErrorsComponent} from "../input-errors/input-errors.component";
import {UserProfileService} from '../../services/user-profile.service';
import {JwtDecoderService} from '../../services/jwt-decoder.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AdminService} from '../../services/admin.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PasswordErrorsComponent} from '../profile/password-errors/password-errors.component';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-activate-account',
  imports: [
    ErrorDivComponent,
    FormsModule,
    InputErrorsComponent,
    ReactiveFormsModule,
    RouterLink,
    PasswordErrorsComponent
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css'
})
export class ActivateAccountComponent {
  confirmationForm: FormGroup;
  originalForm: FormGroup;
  showAlert: boolean = false;
  errorMsg: string = '';
  src: string = '';
  color: string = '';
  userId: string = '';
  confirmationToken = '';

  constructor(private formBuilder: FormBuilder,
              private userProfileService: UserProfileService,
              private router: Router,
              private route: ActivatedRoute,
              private adminService: AdminService,
              private authService: AuthService
  ) {
    this.userId = encodeURIComponent(this.route.snapshot.queryParamMap.get('userId') ?? '');
    this.confirmationToken = encodeURIComponent(this.route.snapshot.queryParamMap.get('token') ?? '');

    this.confirmationForm = this.createFormGroup();
    this.originalForm = this.createFormGroup();

    // console.log(this.confirmationToken);
    // console.log(this.userId);
    // console.log(this.email);
  }

  createFormGroup() {
    const passwordValidators = [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(255),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    ];

    return this.formBuilder.group({
      newPassword: ['', passwordValidators],
      confirmPassword: ['', passwordValidators]
    }, {
      validators: this.userProfileService.fieldsMatchValidator('newPassword', 'confirmPassword')
    });
  }

  onReset() {
    this.confirmationForm.reset(this.originalForm.value);
    this.showAlert = false;
  }

  activateAccount() {
    if (this.confirmationForm.invalid) {
      this.showAlert = true;
      this.src = '/danger.png';
      this.errorMsg = "Please fill out the form correctly before proceeding.";
      this.color = 'red';

      setTimeout(() => {
        this.showAlert = false;
      }, 8000);
      return;
    }

    this.authService.activateAccount(
      {
        Password: this.confirmationForm.get("newPassword")?.value,
        ConfirmPassword: this.confirmationForm.get("confirmPassword")?.value,
        Token: this.confirmationToken
      },
      this.userId,
    ).subscribe({
      next: (response) => {
        console.log(response);
        let route = "/";
        if ("message" in response && response.message === "Admin") {
          route = "/admin/login";
        }
        console.log(route)
        this.router.navigate([route]);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.showAlert = true;
        this.src = '/danger.png';
        this.errorMsg = "Unable to edit profile information";
        this.color = 'red';
        setTimeout(() => {
          this.showAlert = false;
        }, 8000);
      }
    })
  }
}
