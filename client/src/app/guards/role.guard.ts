import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (user.role === 2 || user.role === '2') {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
