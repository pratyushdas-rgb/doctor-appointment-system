import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  error: string | null = null;
  success: string | null = null;
  token: string | null = null;

  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    console.log('reset token params:', params);
    this.token = params['token'] || null;
  });
}


  submit() {
    this.error = null;
    this.success = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newPassword = this.form.value.newPassword!;
    const confirmPassword = this.form.value.confirmPassword!;
    if (newPassword !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (!this.token) {
      this.error = 'Missing reset token. Use the link in your email.';
      return;
    }

    this.loading = true;
    this.auth.resetPassword(this.token, newPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res?.message || 'Password reset successful. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || err?.error?.message || 'Reset failed. Token may be invalid or expired.';
      }
    });
  }
}
