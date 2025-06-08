import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {JwtDecoderService} from '../../services/jwt-decoder.service';

@Component({
  selector: 'app-admin',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  // roles: string[] | null = [];
  // isAuthor : boolean = false;
  // isChairman : boolean = false;
  // isAttendee : boolean = true;
  // isBoardDirector: boolean = false;

  constructor(private router: Router, private jwtDecoder: JwtDecoderService) {
    // if (!this.jwtDecoder.extractRoles()) {
    //   this.router.navigate(['/']);
    //   return;
    // }
    //
    // const roles = localStorage.getItem('roles');
    // if (roles) {
    //   this.isAuthor = roles.includes('Author');
    //   this.isChairman = roles.includes('Chairman');
    //   this.isBoardDirector = roles.includes('BoardDirector');
    // }
  }
}
