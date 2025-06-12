import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {JwtDecoderService} from '../../services/jwt-decoder.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isAuthor : boolean = false;
  isChairman : boolean = false;
  isAttendee : boolean = true;
  isBoardDirector: boolean = false;

  constructor(private router: Router, private jwtDecoder: JwtDecoderService, private authService: AuthService) {
    if (!this.jwtDecoder.extractRoles()) {
      localStorage.removeItem("jwt")
      localStorage.removeItem("roles")
      this.router.navigate(['/']);
      return;
    }

    const roles = localStorage.getItem('roles');
    if (roles) {
      this.isAuthor = roles.includes('Author');
      this.isChairman = roles.includes('Chairman');
      this.isBoardDirector = roles.includes('BoardDirector');
    }
  }

  logout() {
    this.authService.logout(this.router);
  }
}
