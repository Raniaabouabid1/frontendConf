// import { Component } from '@angular/core';
// import {EditCredentialsComponent} from "../profile/edit-credentials/edit-credentials.component";
// import {ErrorDivComponent} from "../error-div/error-div.component";
// import {InputErrorsComponent} from "../input-errors/input-errors.component";
// import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
// import {WarningModalComponent} from "../warning-modal/warning-modal.component";
// import {UserProfileService} from '../../services/user-profile.service';
// import {AdminService} from '../../services/admin.service';
// import {Router} from '@angular/router';
//
// @Component({
//   selector: 'app-add-edit-user',
//     imports: [
//         EditCredentialsComponent,
//         ErrorDivComponent,
//         InputErrorsComponent,
//         ReactiveFormsModule,
//         WarningModalComponent
//     ],
//   templateUrl: './add-edit-user.component.html',
//   styleUrl: './add-edit-user.component.css'
// })
// export class AddEditUserComponent {
//   editForm: FormGroup;
//   originalForm: FormGroup;
//   errorMsg: string = '';
//   src: string = '';
//   color: string = '';
//   showAlert: boolean = false;
//   isEdit: boolean = false;
//   isDisabled: boolean = false;
//   showModal: boolean = false;
//
//   constructor(
//     private userProfileService: UserProfileService,
//     private formBuilder: FormBuilder,
//     private adminService: AdminService,
//     private router: Router,
//   ) {
//     this.editForm = this.createFormGroup();
//     this.originalForm = this.createFormGroup();
//   }
//
//   createFormGroup(): FormGroup {
//     return this.formBuilder.group({
//       id: [""],
//       firstName: ["", [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
//       lastName: ["", [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
//       accountStatus: ["", Validators.required],
//       email: ["", [Validators.required, Validators.email, Validators.maxLength(255)]],
//       phoneNumber: ["", [Validators.required, Validators.pattern(/^\+212[6-7]\d{8}$/)]],
//       birthdate: ["", [Validators.required, this.userProfileService.minimumAgeValidator(18)]],
//       address: ["", [Validators.maxLength(255)]]
//     });
//   }
//
//   enableForm() {
//     this.isDisabled = false;
//     this.editForm.enable();
//     this.editForm.get("email")?.disable();
//   }
//
//   sendEditRequest() {
//     if (this.editForm.invalid) {
//       this.showAlertMessage("Please fill all the fields correctly", true);
//       return;
//     }
//
//     this.showModal = true;
//   }
//
//   showAlertMessage(msg: string, error: boolean) {
//     this.showAlert = true;
//
//     if (error) {
//       this.src = '/danger.png';
//       this.color = 'red';
//     } else {
//       this.src = '/checked.png';
//       this.color = 'green';
//     }
//
//     this.errorMsg = msg;
//
//     setTimeout(() => {
//       this.showAlert = false;
//     }, 7000);
//   }
//
//   addUpdateAdmin(add: boolean) {
//     this.editForm.enable();
//     let formData = {...this.editForm.value};
//
//     if (add) {
//       formData = {...formData, accountStatus: "Verified"};
//     } else {
//       this.editForm.disable();
//       this.isDisabled = true;
//     }
//
//     this.adminService.addUpdateAdmin(formData, add).subscribe({
//       next: (response) => {
//         console.log(response);
//         if (add) {
//           if (response && "id" in response) {
//             this.router.navigate([`/admin/manage-${this.entity}/edit/${response.id}`], {
//               state: {
//                 show: true,
//                 success: true,
//                 message: "Admin account created successfully."
//               }
//             });
//           }
//           return;
//         }
//
//         this.originalForm.setValue(formData);
//         this.showAlertMessage("Successfully updated admin account", false);
//       },
//       error: (err) => {
//         let message = `We were unable to ${add ? "create" : "update"} the account.
//         Please try again. If this error persists, please contact our support team.`;
//
//         if (err?.status === 409)
//           message = err?.error?.message;
//
//         if (!add)
//           this.editForm.setValue(this.originalForm.value);
//
//         this.showAlertMessage(message, true);
//         console.log(err);
//       }
//     });
//   }
// }
