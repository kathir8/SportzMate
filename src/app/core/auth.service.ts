import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;

  login(email: string, password: string) {
    // Call API -> set token
    this.token = 'dummy-token';
  }

  logout() {
    this.token = null;
  }

  isLoggedIn(): boolean {
    return this.token !== null;
  }
}
