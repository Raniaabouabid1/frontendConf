import {Component, Input} from '@angular/core';
import {InputErrorComponent} from "../../input-error/input-error.component";
import {AbstractControl, FormControl} from '@angular/forms';

@Component({
  selector: 'app-password-errors',
    imports: [
        InputErrorComponent
    ],
  templateUrl: './password-errors.component.html',
  styleUrl: './password-errors.component.css'
})
export class PasswordErrorsComponent {
  @Input() passwordAbstractControl: AbstractControl | null = null;
  @Input() requiredErr: string = '';

}
