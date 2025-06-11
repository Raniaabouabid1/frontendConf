import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ErrorDivComponent} from '../error-div/error-div.component';
import {LoginResponse} from '../../interfaces/login-response.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {LoginError} from '../../interfaces/login-error.interface';
import {UserProfileService} from '../../services/user-profile.service';
import {JwtDecoderService} from '../../services/jwt-decoder.service';
import {NgClass, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ErrorDivComponent,
    NgClass
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  err: string = '';
  showAlert: boolean = false;
  adminPortal: boolean = false;
  h2: string = '';


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private jwtDecoderService: JwtDecoderService, private activatedRoute: ActivatedRoute) {
    this.adminPortal = this.router.url === "/admin/login";

    if (this.jwtDecoderService.isValid()) {
      let roles = localStorage.getItem("roles");
      if (!roles) {
        this.jwtDecoderService.extractRoles();
        roles = localStorage.getItem("roles");
      }

      if (roles) {
        if (roles.includes("Admin")) {
          this.router.navigate(['/admin/manage-admins']);
          return;
        }
        this.router.navigate(['/profile']);
      }
    }
  }

  ngOnInit(): void {
    this.setH2();
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });
  }

  setH2(): void {
    this.h2 = this.adminPortal ? "Welcome to UPFCON's admin portal" : "Welcome Back to UPFCON!";
  }

  setBackgroundGradient() {
    return {adminBg: this.adminPortal, regularBg: !this.adminPortal};
  }

  setImageSize() {
    return {adminImgSize: this.adminPortal, regularImgSize: !this.adminPortal};
  }

  setImage() {
    return this.adminPortal ? "/admin.png" : "/loginIcon.jpeg";
  }

  showAlertMessage(msg: string) {
    this.showAlert = true;
    this.err = msg;

    setTimeout(() => {
      this.showAlert = false;
    }, 7000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  afterLogin(): void {
    this.jwtDecoderService.extractRoles();
    const roles = localStorage.getItem("roles");

    if (!roles) {
      localStorage.removeItem("jwt");
      return;
    }

    let message;
    if (this.adminPortal) {
      if (roles.includes("Admin")) {
        this.router.navigate(['/admin/manage-admins']);
        return;
      }

      message = "Only admins can access the platform";
    } else {
      if (!roles.includes("Admin")) {
        this.router.navigate(['/profile']);
        return;
      }

      message = "Please use the admin portal to login";
    }

    this.showAlertMessage(message);
    localStorage.removeItem("roles");
    localStorage.removeItem("jwt");
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (res: LoginResponse) => {
          console.log('Login success');
          localStorage.setItem("jwt", res.accessToken);
          console.log(res);

          this.afterLogin();
        },
        error: (err: HttpErrorResponse) => {
          if (err.error && typeof err.error === 'object') {
            const loginError = err.error as LoginError;
            console.error(`Login failed [${loginError.status}]: ${loginError.message}`);
            this.err = loginError.message;
          } else {
            console.error('Unexpected error:', err);
            this.err = "An unexpected error has occurred";
          }
          this.showAlert = true;

          setTimeout(() => {
            this.showAlert = false;
          }, 5000);
        }
      });
    }
  }
}
