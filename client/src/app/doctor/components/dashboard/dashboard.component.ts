// src/app/doctor/components/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: any = null;

  links = [
    { label: 'Home', path: '/doctor' },
    { label: 'Schedule Availability', path: '/doctor/schedule' }
  ];

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
