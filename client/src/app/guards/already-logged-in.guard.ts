import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedInGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      const user = this.auth.getUser();

      if (user?.role === 2) {
        this.router.navigate(['/doctor/dashboard']);
      } else if (user?.role === 1) {
        this.router.navigate(['/patient/dashboard']);
      } 
      else {
        this.router.navigate(['/dashboard']);
      }

      return false;
    }
    return true; 
  }
}
