import {Component, Input, SimpleChanges} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-error-div',
  imports: [
    NgClass
  ],
  templateUrl: './error-div.component.html',
  styleUrl: './error-div.component.css'
})
export class ErrorDivComponent {
  @Input() errorMsg: string = '';
  @Input() src: string = '';
  @Input() color: string = '';
  isRed: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['color']) {
      this.isRed = this.color === 'red';
    }
  }
}
