// import {Component} from '@angular/core';
// import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
// import {UserProfileService} from '../../../services/user-profile.service';
// import {JwtDecoderService} from "../../../services/jwt-decoder.service";
// import {ActivatedRoute, Router} from "@angular/router";
// import {WarningModalComponent} from "../../warning-modal/warning-modal.component";
// import {ErrorDivComponent} from "../../error-div/error-div.component";
// import {EditCredentialsComponent} from '../../profile/edit-credentials/edit-credentials.component';
// import {InputErrorsComponent} from '../../input-errors/input-errors.component';
// import {AdminService} from '../../../services/admin.service';
// import {Admin} from '../../../interfaces/admin.interface';
// import {AuthService} from '../../../services/auth.service';
//
// interface ErrorResponse {
//   status: number;
//   message: string;
// }
//
// @Component({
//   selector: 'app-add-edit-admin',
//   imports: [
//     ReactiveFormsModule,
//     WarningModalComponent,
//     ErrorDivComponent,
//     EditCredentialsComponent,
//     InputErrorsComponent
//   ],
//   templateUrl: './add-edit-admin.component.html',
//   styleUrl: './add-edit-admin.component.css'
// })
// export class AddEditAdminComponent {
//   adminId: string | null = null;
//   admin: Admin = {
//     id: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     birthdate: "",
//     address: "",
//     accountStatus: ""
//   };
//
//   editForm: FormGroup;
//   originalForm: FormGroup;
//
//   isEdit: boolean = false;
//   isDisabled: boolean = true;
//   h3: string = "Changing personal information";
//   message: string = "Are you sure you want to save the changes made? This action is irreversible!"
//   showModal: boolean = false;
//   showAlert: boolean = false;
//   showChangeCredentialsModal: boolean = false;
//   errorMsg: string = "";
//   src: string = '';
//   color: string = '';
//   email: string = '';
//   showDeleteAccountWarningModal: boolean = false;
//   h1: string = "Create new admin";
//   hideButton: boolean = false;
//
//   constructor(private formBuilder: FormBuilder,
//               private userProfileService: UserProfileService,
//               private jwtDecoder: JwtDecoderService,
//               private router: Router,
//               private adminService: AdminService,
//               private activatedRoute: ActivatedRoute,
//               private authService: AuthService,
//   ) {
//     this.editForm = this.createFormGroup();
//     this.originalForm = this.createFormGroup();
//
//     if (!this.authService.isAdmin(this.router, this.jwtDecoder, '/admin/login')) {
//       this.router.navigate(['/403']);
//       return;
//     }
//
//     this.adminId = this.activatedRoute.snapshot.paramMap.get("adminId");
//     this.isEdit = this.adminId !== null;
//
//     if (this.isEdit) {
//       this.editForm.disable();
//       this.adminService.getAdminById(this.adminId ?? "").subscribe({
//         next: admin => {
//           if (admin.accountStatus === "Deleted")
//             this.hideButton = true;
//
//           console.log(admin);
//           this.admin = admin;
//           this.admin.birthdate = this.admin.birthdate.split("T")[0];
//           this.editForm.setValue(this.admin);
//           this.originalForm.setValue(this.admin);
//           this.h1 = `Update account: ${this.admin.firstName} ${this.admin.lastName}`;
//         },
//         error: error => {
//           console.log(error);
//         }
//       });
//     }
//   }
//
//   ngOnInit(): void {
//     const navigation = this.router.getCurrentNavigation();
//     console.log(navigation);
//     const state = navigation?.extras?.state;
//     console.log(state);
//
//     if (state?.['show']) {
//       this.showAlertMessage(state?.['message'], state?.['success']);
//       this.isEdit = true;
//       this.editForm.disable();
//     }
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
//   modalResponse(resp: boolean) {
//     this.showModal = false;
//     this.isEdit = true;
//
//     if (resp) {
//       this.addUpdateAdmin(false);
//       return;
//     }
//
//     this.editForm.setValue(this.originalForm.value);
//   }
//
//   cancelChanges() {
//     this.editForm.reset(this.originalForm.value);
//     this.isDisabled = true;
//     this.showAlert = false;
//     this.editForm.disable();
//   }
//
//   onReset() {
//     this.editForm.reset(this.originalForm.value);
//     this.showAlert = false;
//   }
//
//   showEditCredentialsModel(show: boolean) {
//     this.showChangeCredentialsModal = show;
//   }
//
//   showDeleteAccountModal() {
//     this.showDeleteAccountWarningModal = true;
//   }
//
//   deleteAdmin(remove: boolean) {
//     if (remove) {
//       this.adminService.deleteAdmin(this.adminId ?? "").subscribe({
//         next : res => {
//           this.router.navigateByUrl("/admin/manage-admins");
//         }, error: error => {
//           console.log(error);
//           this.showDeleteAccountWarningModal = false;
//           console.log(error.error.message);
//         }
//       })
//     }
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
//             this.router.navigate([`/admin/manage-admins/edit/${response.id}`], {
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
//
//
// }
