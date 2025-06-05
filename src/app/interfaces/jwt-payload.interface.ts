export interface JwtPayload {
  [key: string]: string | string[] | number | undefined | null;
  nbf: number | undefined | null;
  exp: number | undefined | null;
  iss: string | undefined | null;
  aud: string | undefined | null;
}
