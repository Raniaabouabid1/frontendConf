import {Component} from '@angular/core';
import {ErrorDivComponent} from "../error-div/error-div.component";
import {InputErrorsComponent} from "../input-errors/input-errors.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {WarningModalComponent} from "../warning-modal/warning-modal.component";
import {UserProfileService} from '../../services/user-profile.service';
import {AdminService} from '../../services/admin.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {JwtDecoderService} from '../../services/jwt-decoder.service';
import {UserBasicInfo} from '../../interfaces/user-basic-info.interface';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-edit-user',
  imports: [
    ErrorDivComponent,
    InputErrorsComponent,
    ReactiveFormsModule,
    WarningModalComponent
  ],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.css'
})
export class AddEditUserComponent {
  editForm: FormGroup;
  originalForm: FormGroup;

  errorMsg: string = '';
  src: string = '';
  color: string = '';
  entity: string = '';
  userId: string | null = null;
  h3: string = '';
  h1: string = '';
  message: string = '';

  userBasicInfo: UserBasicInfo = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthdate: "",
    address: "",
    accountStatus: ""
  };

  showAlert: boolean = false;
  isEdit: boolean = false;
  isDisabled: boolean = true;
  showModal: boolean = false;
  hideButton: boolean = false;
  showDeleteAccountWarningModal: boolean = false;

  constructor(
    private userProfileService: UserProfileService,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private authService: AuthService,
    private jwtDecoder: JwtDecoderService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.editForm = this.createFormGroup();
    this.originalForm = this.createFormGroup();

    if (!this.authService.isAdmin(this.router, this.jwtDecoder, '/admin/login')) {
      this.router.navigate(['/403']);
      return;
    }

    this.entity = this.router.url.slice(this.router.url.indexOf('manage')).split('/')[0].split('-')[1];
    this.userId = this.router.url.split('/')[this.router.url.split('/').length - 1];
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');

    this.isEdit = this.userId !== null;

    if (this.isEdit) {
      this.h1 = "Update account: "
      this.editForm.disable();
      this.adminService.getUserById(this.entity, this.userId ?? "").subscribe({
        next: userBasicInfo => {
          if (userBasicInfo.accountStatus === "Deleted")
            this.hideButton = true;

          console.log(userBasicInfo);
          this.userBasicInfo = userBasicInfo;
          this.userBasicInfo.birthdate = this.userBasicInfo.birthdate.split("T")[0];
          this.editForm.setValue(this.userBasicInfo);
          this.originalForm.setValue(this.userBasicInfo);
          this.h1 += `${this.userBasicInfo.firstName} ${this.userBasicInfo.lastName}`;
          this.h3 = `Editing user ${this.userBasicInfo.firstName} ${this.userBasicInfo.lastName}`;
          this.message = 'Are you sure you want to edit user?';
        },
        error: error => {
          console.log(error);
          if (error instanceof HttpErrorResponse) {
            let message = 'An unexpected error occurred. Please try again later.';
            if (error.status === 404)
              message = 'User Not Found';

            this.showAlertMessage(message, true);
          }
        }
      });
    } else {
      this.h1 = `Add ${this.entity.slice(0, this.entity.length - 1)}`;
    }
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [""],
      firstName: ["", [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
      lastName: ["", [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
      accountStatus: ["", Validators.required],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(255)]],
      phoneNumber: ["", [Validators.required, Validators.pattern(/^\+212[6-7]\d{8}$/)]],
      birthdate: ["", [Validators.required, this.userProfileService.minimumAgeValidator(18)]],
      address: ["", [Validators.maxLength(255)]]
    });
  }

  enableForm() {
    this.isDisabled = false;
    this.editForm.enable();
    this.editForm.get("email")?.disable();
  }

  sendEditRequest() {
    if (this.editForm.invalid) {
      this.showAlertMessage("Please fill all the fields correctly", true);
      return;
    }

    this.showModal = true;
  }

  showAlertMessage(msg: string, error: boolean) {
    this.showAlert = true;

    if (error) {
      this.src = '/danger.png';
      this.color = 'red';
    } else {
      this.src = '/checked.png';
      this.color = 'green';
    }

    this.errorMsg = msg;

    setTimeout(() => {
      this.showAlert = false;
    }, 7000);
  }

  addUpdateAdmin(add: boolean) {
    this.editForm.enable();
    let formData = {...this.editForm.value};

    if (add) {
      formData = {...formData, accountStatus: "Verified"};
    } else {
      this.editForm.disable();
      this.isDisabled = true;
    }

    this.adminService.addUpdateUser(formData, add).subscribe({
      next: (response) => {
        console.log(response);
        if (add) {
          if (response && "id" in response) {
            this.router.navigate([`/admin/manage-${this.entity}/edit/${response.id}`]);
          }

          return;
        }

        this.originalForm.setValue(formData);
        this.showAlertMessage("Account updated successfully", false);
      },
      error: (err) => {
        let message = `We were unable to ${add ? "create" : "update"} the account.
        Please try again. If this error persists, please contact our support team.`;

        if (err?.status === 409)
          message = err?.error?.message;

        if (!add)
          this.editForm.setValue(this.originalForm.value);

        this.showAlertMessage(message, true);
        console.log(err);
      }
    });
  }

  onReset() {
    this.editForm.reset(this.originalForm.value);
    this.showAlert = false;
  }

  cancelChanges() {
    this.editForm.reset(this.originalForm.value);
    this.isDisabled = true;
    this.showAlert = false;
    this.editForm.disable();
  }

  showDeleteAccountModal() {
    this.showDeleteAccountWarningModal = true;
  }

  deleteUser(remove: boolean) {
    this.showDeleteAccountWarningModal = false;
    if (!remove)
      return;

      this.adminService.deleteUser(this.entity, this.userId ?? "").subscribe({
        next: res => {
          this.router.navigateByUrl(`/admin/manage-${this.entity}`);
        }, error: error => {
          console.log(error);
          console.log(error.error.message);
        }
      });
  }

  modalResponse(resp: boolean) {
    this.showModal = false;
    this.isEdit = true;

    if (resp) {
      this.addUpdateAdmin(false);
      return;
    }

    this.editForm.setValue(this.originalForm.value);
    this.isDisabled = true;
    this.editForm.disable();
  }
}
