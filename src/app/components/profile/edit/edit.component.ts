import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserProfileService} from '../../../services/user-profile.service';
import {UserProfile} from '../../../interfaces/user-profile.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {JwtDecoderService} from "../../../services/jwt-decoder.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-edit',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.css'
})
export class EditComponent {
    editForm: FormGroup;
    isDisabled: boolean = true;
    buttonLabel: string = "Edit information";
    isAuthor : boolean = false;

    constructor(private formBuilder: FormBuilder,
                private userProfileService: UserProfileService,
                private jwtDecoder: JwtDecoderService,
                private router: Router,
    ) {
        const roles : string[] | null = this.jwtDecoder.extractRoles();

        this.editForm = this.formBuilder.group({
            description: ["", [Validators.maxLength(255)]],
            firstName: ["", [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
            lastName: ["", [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÀ-ÿ\s'-]+$/)]],
            email: ["", [Validators.required, Validators.email, Validators.maxLength(255)]],
            phoneNumber: ["", [Validators.required, Validators.pattern(/^[6-7]\d{8}$/)]],
            birthdate: ["", [Validators.required, userProfileService.minimumAgeValidator(18)]],
            address: ["", [Validators.required, Validators.maxLength(255)]],
            expertise: ["", [Validators.required, Validators.maxLength(255)]],
        });

        if (roles == null) {
            this.router.navigate(['/login']);
            return;
        }

        console.log("Author? Maybe?", !roles?.includes("Author"));
        console.log(roles);
        this.isAuthor = roles?.includes("Author");

        this.userProfileService.getUserProfileInformation().subscribe({
            next: (response: UserProfile) => {
                const userProfile: UserProfile = {
                    ...response,
                    description: response.description ? response.description : "",
                    expertise: response.expertise ? response.expertise : "",
                    birthdate: response.birthdate.split("T")[0]
                }

                this.editForm.setValue(userProfile);
            },
            error: (error: HttpErrorResponse) => {
                console.error(error);
            }
        });
    }

    toggleDisabled() {
        this.isDisabled = !this.isDisabled;
        if (this.isDisabled) {
            this.buttonLabel = "Edit information";
        } else {
            this.buttonLabel = "Confirm changes";
        }
    }
}
