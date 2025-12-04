import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.auth.getUser();

    if (!user) {
      return this.router.createUrlTree(['/auth/login']);
    }

    const allowedRoles: Array<number | string> = route.data['roles'] ?? [];

    const userRole = typeof user.role === 'string' && !isNaN(Number(user.role)) ? Number(user.role) : user.role;

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const allowed = allowedRoles.some(ar => {
      const arNorm = (typeof ar === 'string' && !isNaN(Number(ar))) ? Number(ar) : ar;
      return arNorm === userRole;
    });

    if (allowed) {
      return true; 
    }

    if (userRole === 2) {
      return this.router.createUrlTree(['/doctor/dashboard']);
    }
    if (userRole === 1) {
      return this.router.createUrlTree(['/patient/dashboard']);
    }

    return this.router.createUrlTree(['/']);
  }
}
