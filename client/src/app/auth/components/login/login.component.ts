import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;
  error: string | null = null;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { email, password } = this.loginForm.value;
this.auth.login(email!, password!).subscribe({
  next: (res) => {
    const user = this.auth.getUser();
    this.loading = false;
    if (user && (user.role === 2 || user.role === '2')) {
      this.router.navigate(['/doctor']);
    }else if (user && (user.role === 1 || user.role === '1')) {
      this.router.navigate(['/patient']);
    }
     else {
      this.router.navigate(['/']); 
    }
  },
  error: (err) => {
    this.loading = false;
    this.error = err?.error?.error || 'Login failed';
  }
});
  }
}
