import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserProfileService} from '../../../services/user-profile.service';
import {UserProfile} from '../../../interfaces/user-profile.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {JwtDecoderService} from "../../../services/jwt-decoder.service";
import {Router} from "@angular/router";
import {WarningModalComponent} from "../../warning-modal/warning-modal.component";
import {InputErrorComponent} from "../../input-error/input-error.component";
import {ErrorDivComponent} from "../../error-div/error-div.component";
import {EditCredentialsComponent} from '../../profile/edit-credentials/edit-credentials.component';
import {InputErrorsComponent} from '../../input-errors/input-errors.component';
import {AdminService} from '../../../services/admin.service';

@Component({
  selector: 'app-add-edit-admin',
  imports: [
    ReactiveFormsModule,
    WarningModalComponent,
    ErrorDivComponent,
    EditCredentialsComponent,
    InputErrorsComponent
  ],
  templateUrl: './add-edit-admin.component.html',
  styleUrl: './add-edit-admin.component.css'
})
export class AddEditAdminComponent {
  editForm: FormGroup;
  originalForm: FormGroup;
  isEdit: boolean = false;
  isDisabled: boolean = true;
  buttonLabel: string = "Edit information";
  @Input() isAuthor: boolean = false;
  h3: string = "Changing personal information";
  message: string = "Are you sure you want to persist the changes made to your profile? This action is irreversible!"
  showModal: boolean = false;
  editResponse: boolean = false;
  showAlert: boolean = false;
  showChangeCredentialsModal: boolean = false;
  errorMsg: string = "";
  src: string = '';
  color: string = '';
  email: string = '';
  showDeleteAccountWarningModal: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private userProfileService: UserProfileService,
              private jwtDecoder: JwtDecoderService,
              private router: Router,
              private adminService: AdminService,
  ) {
    // this.getRoles(this.router);
    this.editForm = this.createFormGroup();
    this.originalForm = this.createFormGroup();
    const action = this.router.url.split('/').pop();
    if (!action) {
      this.router.navigate(['/login']);
      return;
    }

    this.isEdit = action.toLowerCase() === 'edit';
    console.log(this.isEdit);

    if (this.isEdit) {
      this.editForm.disable();
    }

    // this.userProfileService.getUserProfileInformation().subscribe({
    //   next: (response: UserProfile) => {
    //     const userProfile: UserProfile = {
    //       ...response,
    //       description: response.description ? response.description : "",
    //       expertise: response.expertise ? response.expertise : "",
    //       birthdate: response.birthdate.split("T")[0]
    //     }
    //
    //     this.editForm.setValue(userProfile);
    //     this.originalForm.setValue(this.editForm.value);
    //     this.email = userProfile.email;
    //     console.log(this.email);
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     console.error(error);
    //   }
    // });
  }

  // getRoles(router: Router) {
  //   let roles = localStorage.getItem('roles');
  //   if (!roles) {
  //     const extracted = this.jwtDecoder.extractRoles();
  //
  //     if (!extracted) {
  //       router.navigate(['/']);
  //       return;
  //     }
  //
  //     roles = localStorage.getItem('roles');
  //   }
  //
  //   if (roles) {
  //     this.isAuthor = roles.includes('Author');
  //   }
  // }
  h1: string = "Create new admin";

  createFormGroup() {
    return this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
      lastName: ["", [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(255)]],
      phoneNumber: ["", [Validators.required, Validators.pattern(/^\+212[6-7]\d{8}$/)]],
      birthdate: ["", [Validators.required, this.userProfileService.minimumAgeValidator(18)]],
      address: ["", [Validators.maxLength(255)]]
    });
  }

  toggleDisabled() {
    if (!this.isDisabled) {
      if (!this.editForm.valid) {
        this.showAlert = true;
        this.src = '/danger.png';
        this.errorMsg = "Please fill out the form.";
        this.color = 'red';
        return;
      }
      this.showModal = true;
      this.editForm.disable();
    }

    this.isDisabled = !this.isDisabled;

    if (this.isDisabled) {

    } else {
      this.buttonLabel = "Confirm changes";
      this.editForm.enable();
    }

    this.editForm.get('email')?.disable();
  }

  cancelChanges() {
    this.editForm.reset(this.originalForm.value);
    this.isDisabled = true;
    this.showAlert = false;
    this.editForm.disable();
    this.buttonLabel = "Edit information";
  }

  onReset() {
    this.editForm.reset(this.originalForm.value);
    this.showAlert = false;
  }

  modalResponse(resp: boolean) {
    this.editResponse = resp;
    if (this.editResponse) {
      this.sendEditRequest();
      this.originalForm.setValue(this.editForm.value);
    }

    this.showModal = false;
    this.editForm.setValue(this.originalForm.value);
    this.buttonLabel = "Edit information";
  }

  sendEditRequest(): void {
    this.userProfileService.editUserProfileInformation(this.editForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.showAlert = true;
        this.src = '/checked.png';
        this.errorMsg = "Your profile has been updated successfully.";
        this.color = 'green';
        setTimeout(() => {
          this.showAlert = false;
        }, 4000);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.showAlert = true;
        this.src = '/danger.png';
        this.errorMsg = "Unable to edit profile information. Please try again later. If this problem persists, please contact our support team.";
        this.color = 'red';
        setTimeout(() => {
          this.showAlert = false;
        }, 4000);
      }
    });
  }

  showEditCredentialsModel(show: boolean) {
    this.showChangeCredentialsModal = show;
  }

  showDeleteAccountModal(show: boolean) {
    this.showDeleteAccountWarningModal = show;
  }

  navigateToForm() {
    this.router.navigate(['/admin/manage-admins/add'])
  }

  createAdmin() {
    if (!this.editForm.valid) {
      this.showAlert = true;
      this.errorMsg = "You must fill out the form correctly.";
      this.src = "/danger.png"
      this.color = "red"
      return;
    }

    this.adminService.createAdmin(this.editForm.value).subscribe({
      next: (response) => {
        this.showAlert = true;
        this.src = '/checked.png';
        this.errorMsg = "Admin created successfully.";
        this.color = 'green';

        setTimeout(() => {
          this.showAlert = false;
        }, 7000);

        console.log(response);
        this.isEdit = true;
        this.editForm.disable();
      },
      error: (err) => {
        let message = "We were unable to create an admin account. Please try again. If this error persists, please contact our support team.";
        if ('error' in err && 'message' in err.error)
          message = err.error.message;

        this.showAlert = true;
        this.errorMsg = message;
        this.src = "/danger.png"
        this.color = "red"

        setTimeout(() => {
          this.showAlert = false;
        }, 8000);
      }
    });
  }

}
