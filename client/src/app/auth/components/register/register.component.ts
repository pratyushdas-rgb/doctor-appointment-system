import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterPayload } from '../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  roles = [
    { id: 1, name: 'Patient' },
    { id: 2, name: 'Doctor' },
    { id: 3, name: 'Clinic Staff' },
    { id: 4, name: 'Admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  registerForm = this.fb.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: [1],  
    phone_number: ['']
  });

  loading = false;
  error: string | null = null;

  onSubmit() {
    this.error = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload: RegisterPayload = this.registerForm.getRawValue();

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || 'Registration failed';
      }
    });
  }
}
