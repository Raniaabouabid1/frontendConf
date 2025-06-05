import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import {JwtPayload} from '../interfaces/jwt-payload.interface';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {
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

  extractRoles(): string[] | null {
    const token = this.isValid();

    if (!token)
      return null;

    if ("http://schemas.microsoft.com/ws/2008/06/identity/claims/role" in token)
      return token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string[];

    return null;
  }
}
