import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  user = this.auth.getUser();

  links = [
    { label: 'Dashboard', path: '/doctor/dashboard' },
    { label: 'Schedule Availability', path: '/doctor/schedule' },
    { label: 'Profile', path:'/doctor/profile'}
  ];

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
