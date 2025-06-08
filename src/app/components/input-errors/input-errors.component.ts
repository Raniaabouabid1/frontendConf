import {Component, Input} from '@angular/core';
import {InputErrorComponent} from "../input-error/input-error.component";
import {AbstractControl, FormControl} from '@angular/forms';

@Component({
  selector: 'app-input-errors',
    imports: [
        InputErrorComponent
    ],
  templateUrl: './input-errors.component.html',
  styleUrl: './input-errors.component.css'
})
export class InputErrorsComponent {
  @Input() abstractControl: AbstractControl | null = null;
  @Input() requiredErr: string = '';
  @Input() minLenErr: string = '';
  @Input() patternErr: string = '';

}
