import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ErrorDivComponent} from '../../error-div/error-div.component';
import {AuthService} from '../../../services/auth.service';
import {JwtDecoderService} from '../../../services/jwt-decoder.service';
import {LoginResponse} from '../../../interfaces/login-response.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {LoginError} from '../../../interfaces/login-error.interface';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ErrorDivComponent
  ],
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  err: string = '';
  showAlert: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private jwtDecoderService : JwtDecoderService) {
    // if (this.jwtDecoderService.isValid()) {
    //   this.router.navigate(['/profile']);
    //   return;
    // }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (res : LoginResponse) => {
          console.log('Login success');
          localStorage.setItem("jwt", res.accessToken);
          this.router.navigate(['/profile']);
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
