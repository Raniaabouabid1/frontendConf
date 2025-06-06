import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-input-error',
  imports: [],
  templateUrl: './input-error.component.html',
  styleUrl: './input-error.component.css'
})
export class InputErrorComponent {
  @Input() errorMsg: string = '';

}
