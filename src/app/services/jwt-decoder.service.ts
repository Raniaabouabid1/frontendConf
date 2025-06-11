import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import {JwtPayload} from '../interfaces/jwt-payload.interface';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {
  validRoles : string[] = ["Admin", "Author", "Chairman", "Attendee", "BoardDirector"];

  constructor() { }

  decode() : JwtPayload | null {
    const token = localStorage.getItem('jwt');
    if (!token)
      return null;

    const decodedJwtToken = jwtDecode<JwtPayload>(token);
    if (!decodedJwtToken)
      return null;

    return decodedJwtToken;
  }

  isValid() : JwtPayload | null {
    const token = this.decode();

    if (!token)
      return null;

    if (!(token.iss?.toLowerCase() === environment.issuer.toLowerCase()))
      return null;

    if (!token.exp || !(token.exp * 1000 > new Date().getTime()))
      return null;

    return token;
  }

  extractRoles(): boolean {
    const token = this.isValid();

    if (!token)
      return false;

    if ("http://schemas.microsoft.com/ws/2008/06/identity/claims/role" in token) {
      const roles = token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (!(roles instanceof Array) && typeof roles !== "string")
        return false;

      let rolesToStore;

      if (roles instanceof Array) {
        const outliers = roles.filter((role) => !this.validRoles.includes(role));
        if (outliers.length > 0)
          return false;

        rolesToStore = roles.join(',');
      } else {
        const outliers = !this.validRoles.includes(roles);
        if (outliers)
          return false;

        rolesToStore = roles;
      }

      localStorage.setItem('roles', rolesToStore);
      return true;
    }

    return false;
  }
}
