import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserSignupService } from '../../services/user-signup.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormArray,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {NgForOf} from '@angular/common';
import {ErrorDivComponent} from '../error-div/error-div.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, NgForOf, ErrorDivComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  step = 1;
  signupForm: FormGroup;
  showAlert = false;
  maxBirthdate!: string;
  selectedRoles: string[] = [];

  constructor(private fb: FormBuilder, private userSignupService: UserSignupService) {
    this.signupForm = this.fb.group({
      Roles: this.fb.group({
        Author: [false],
        Chairman: [false],
        Attendee: [false]
      }),
      isInternal: [null],
      expertise: [''],
      FirstName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
      LastName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
      Email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(/^[6-7]\d{8}$/)]],
      Birthdate: ['', [Validators.required, this.minimumAgeValidator(18)]],
      Address: ['', [Validators.required, Validators.maxLength(255)]],
      Password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ]],
      confirmPwd: ['', Validators.required],
      Diplomas: this.fb.array([this.createDiplomaFormGroup()]),
    });
  }

  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthdate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthdate.getFullYear();
      const isTooYoung = age < minAge || (age === minAge && today < new Date(birthdate.setFullYear(birthdate.getFullYear() + minAge)));
      return isTooYoung ? { tooYoung: true } : null;
    };
  }

  createDiplomaFormGroup(): FormGroup {
    return this.fb.group({
      Title: ['', Validators.required],
      IssueDate: ['', Validators.required],
      diplomaFile: [null, Validators.required]
    });
  }

  get diplomaForms(): FormArray {
    return this.signupForm.get('Diplomas') as FormArray;
  }

  addDiploma(): void {
    this.diplomaForms.push(this.createDiplomaFormGroup());
  }

  removeDiploma(index: number): void {
    this.diplomaForms.removeAt(index);
  }

  onDiplomaUpload(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.diplomaForms.at(index).get('diplomaFile')?.setValue(file);
    }
  }

  passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('Password')?.value;
    const confirmPassword = formGroup.get('confirmPwd')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  calculateProgress(): number {
    const keys = [
      'FirstName', 'LastName', 'Email', 'PhoneNumber',
      'Birthdate', 'Address', 'Password', 'confirmPwd'
    ];
    const filled = keys.filter(key => this.signupForm.get(key)?.valid).length;
    return Math.round((filled / keys.length) * 100);
  }

  onRoleChange(role: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    const rolesGroup = this.signupForm.get('Roles');

    if (checked && !this.selectedRoles.includes(role)) {
      this.selectedRoles.push(role);
      rolesGroup?.get(role)?.setValue(true);
    } else if (!checked) {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
      rolesGroup?.get(role)?.setValue(false);
      if (role === 'Author') this.signupForm.get('expertise')?.reset();
      if (role === 'Chairman') this.signupForm.get('isInternal')?.reset();
    }
  }

  ngOnInit(): void {
    this.signupForm.setValidators(this.passwordMatchValidator);
    const today = new Date();
    const year = today.getFullYear() - 18;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.maxBirthdate = `${year}-${month}-${day}`;
  }

  isDiplomaStepRequired(): boolean {
    return this.selectedRoles.includes('Author') || this.selectedRoles.includes('Chairman');
  }

  previousStep(): void {
    if (this.step === 3 && !this.isDiplomaStepRequired()) {
      this.step = 1;
    } else {
      this.step--;
    }
  }
  displayStep(): number {
    return this.isDiplomaStepRequired() ? this.step : (this.step === 3 ? 2 : this.step);
  }

  totalSteps(): number {
    return this.isDiplomaStepRequired() ? 3 : 2;
  }


  nextStep(): void {
    this.showAlert = false;

    if (this.step === 1) {
      const requiredFields = ['FirstName', 'LastName', 'Email', 'Birthdate', 'Address'];
      const allValid = requiredFields.every(field => this.signupForm.get(field)?.valid);
      const phoneValid = this.signupForm.get('PhoneNumber')?.valid;

      const rolesGroup = this.signupForm.get('Roles')?.value;
      const hasAtLeastOneRole = Object.values(rolesGroup).some(val => val === true);

      const chairmanSelected = rolesGroup?.Chairman;
      const isInternalValid = chairmanSelected ? this.signupForm.get('isInternal')?.value !== null : true;

      const authorSelected = rolesGroup?.Author;
      const expertiseValid = authorSelected ? this.signupForm.get('expertise')?.value.trim() !== '' : true;

      if (allValid && phoneValid && hasAtLeastOneRole && isInternalValid && expertiseValid) {
        this.step = this.isDiplomaStepRequired() ? 2 : 3;
      } else {
        this.showAlert = true;
      }
    } else if (this.step === 2) {
      const allDiplomasValid = this.diplomaForms.controls.every(d => d.valid);
      if (allDiplomasValid) {
        this.step++;
      } else {
        this.showAlert = true;
      }
    }
  }


  submitForm(): void {
    console.log('im inside submitForm');

    if (!this.isDiplomaStepRequired()) {
      this.signupForm.setControl('Diplomas', this.fb.array([]));
    }

    console.log('is my Form valid  ?', this.signupForm.valid);
    console.log('Form values:', this.signupForm.value);

    if (this.signupForm.valid) {
      const fullPhone = '+212' + this.signupForm.get('PhoneNumber')?.value;

      const Diplomas = this.isDiplomaStepRequired()
        ? this.diplomaForms.controls.map(d => ({
          Title: d.get('Title')?.value,
          IssueDate: d.get('IssueDate')?.value,
          DiplomaFile: d.get('diplomaFile')?.value
        }))
        : [];

      const roles: string[] = [];
      if (this.signupForm.get('Roles.Author')?.value) roles.push('Author');
      if (this.signupForm.get('Roles.Chairman')?.value) roles.push('Chairman');
      if (this.signupForm.get('Roles.Attendee')?.value) roles.push('Attendee');
      console.log("Selected roles:", roles);
      const payload: User = {
        Roles: roles,
        IsInternal: this.signupForm.get('isInternal')?.value,
        Expertise: this.signupForm.get('expertise')?.value,
        FirstName: this.signupForm.get('FirstName')?.value,
        LastName: this.signupForm.get('LastName')?.value,
        Email: this.signupForm.get('Email')?.value,
        PhoneNumber: fullPhone,
        Birthdate: this.signupForm.get('Birthdate')?.value,
        Address: this.signupForm.get('Address')?.value,
        Password: this.signupForm.get('Password')?.value,
        Diplomas
      };

      this.userSignupService.registerUser(payload).subscribe({
        next: res => console.log('Registration successful:', res),
        error: err => console.error('Registration failed:', err)
      });
    }
  }
}
