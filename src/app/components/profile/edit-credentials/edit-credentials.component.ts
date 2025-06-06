import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputErrorComponent} from '../../input-error/input-error.component';
import {NgOptimizedImage} from '@angular/common';
import {ErrorDivComponent} from '../../error-div/error-div.component';
import {WarningModalComponent} from '../../warning-modal/warning-modal.component';
import {UserProfileService} from '../../../services/user-profile.service';
import {PasswordErrorsComponent} from '../password-errors/password-errors.component';
import {ChangePassword} from '../../../interfaces/change-password.interface';

@Component({
  selector: 'app-edit-credentials',
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
    NgOptimizedImage,
    ErrorDivComponent,
    WarningModalComponent,
    PasswordErrorsComponent
  ],
  templateUrl: './edit-credentials.component.html',
  styleUrl: './edit-credentials.component.css'
})
export class EditCredentialsComponent {
  editEmailForm: FormGroup;
  editPasswordForm: FormGroup;
  @Input() oldEmail!: string;
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  showAlert: boolean = false;
  passwordEditErr: string = '';
  passwordEditSrc: string = '';
  passwordEditColor: string = '';
  showChangePasswordModal: boolean = false;


  constructor(private fb: FormBuilder, private userProfileService: UserProfileService) {
    const passwordValidators = [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(255),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    ];

    const emailValidators = [
      Validators.required,
      Validators.email,
      Validators.maxLength(255)
    ];


    this.editEmailForm = this.fb.group({
      oldEmail: ['', emailValidators],
      newEmail: ['', emailValidators],
    });

    this.editPasswordForm = this.fb.group({
      oldPassword: ['', passwordValidators],
      newPassword: ['', passwordValidators],
      confirmPassword: ['', passwordValidators]
    }, {
      validators: this.userProfileService.fieldsMatchValidator('newPassword', 'confirmPassword')
    });

    this.editEmailForm.get('oldEmail')?.disable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['oldEmail']) {
      this.oldEmail = changes['oldEmail'].currentValue;
      this.editEmailForm.get('oldEmail')?.setValue(this.oldEmail);
    }
  }

  closeModal() {
    this.closeModalEvent.emit(false);
  }

  changePasswordResponse(change: boolean) {
    this.showChangePasswordModal = false;

    if (!change)
      return;

    const passwords : ChangePassword = {
      oldPassword: this.editPasswordForm.get("oldPassword")?.value,
      newPassword: this.editPasswordForm.get("newPassword")?.value
    }
    console.log(passwords.oldPassword);

    this.userProfileService.editAccountPassword(passwords).subscribe({
      next: () => {
        this.showAlert = true;
        this.passwordEditErr = "Your password has been updated successfully.";
        this.passwordEditSrc = "/checked.png"
        this.passwordEditColor = "green"

        setTimeout(() => {
          this.showAlert = false;
        }, 8000);
      },
      error: (err) => {
        let message = "We were unable to update your password. Please try again. If this error persists, please contact our support team.";
        if ('error' in err && 'message' in err.error)
          message = err.error.message;

        this.showAlert = true;
        this.passwordEditErr = message;
        this.passwordEditSrc = "/danger.png"
        this.passwordEditColor = "red"
        console.log(message);

        setTimeout(() => {
          this.showAlert = false;
        }, 8000);
      }
    })
  }

  sendChangePasswordRequest() {
    if (!this.editPasswordForm.valid) {
      this.showAlert = true;

      this.passwordEditErr = "Please fill the password form correctly before proceeding"
      this.passwordEditSrc = "/danger.png"
      this.passwordEditColor = "red"

      setTimeout(() => {
        this.showAlert = false;
      }, 5000);

      return;
    }

    this.showChangePasswordModal = true;
    // console.log(newPassword, confirmPassword);
  }
}
