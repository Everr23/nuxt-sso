export {};
declare global {
  interface IUserInfo {
    email: string;
    fullName: string;
    name?: string;
    lastName?: string;
    photoUrl?: string;
    role?: string;
  }

  interface IAuthData {
    isAuthenticated: boolean;
    jti: string;
    sub: string;
  }

  interface IAuthState {
    user: IUserInfo | null;
    authData: IAuthData | null;
  }
}
