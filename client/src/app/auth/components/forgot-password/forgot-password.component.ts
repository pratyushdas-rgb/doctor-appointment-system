import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  loading = false;
  success: string | null = null;
  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    this.error = null;
    this.success = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const email = this.form.value.email!;
    this.auth.requestPasswordReset(email).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res?.message || 'A reset link has been sent to the email.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.error?.error || 'Failed to request reset. Try again later.';
      }
    });
  }
}
