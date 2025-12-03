import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AvailabilityService } from '../../services/availability.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  user: any = null;
  loading = false;
  message: string | null = null;
  error: string | null = null;

scheduleForm = this.fb.nonNullable.group({
  date: ['', Validators.required],
  start_time: ['', Validators.required],
  end_time: ['', Validators.required],
  slot_duration_minutes:  this.fb.nonNullable.control(30, Validators.required)
});


  slots: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private availability: AvailabilityService,
    private auth: AuthService,
    private router: Router
  ) {
    this.user = this.auth.getUser();
  }

  ngOnInit(): void {
  }

submit() {
  this.error = null;
  this.message = null;

  if (this.scheduleForm.invalid) {
    this.scheduleForm.markAllAsTouched();
    return;
  }

  const payload = this.scheduleForm.getRawValue();
  this.loading = true;

  this.availability.setAvailability(payload).subscribe({
    next: (res) => {
      this.loading = false;
      this.message = 'Availability saved';
      this.slots = res.slots || res || [];
    },
    error: (err) => {
      this.loading = false;
      this.error = err?.error?.error || 'Failed to save availability';
    }
  });
}

previewSlots() {
  this.error = null;
  this.message = null;

  if (!this.user || !this.user.id) {
    this.error = 'User not identified.';
    return;
  }

  const date = this.scheduleForm.get('date')?.value;
  if (!date) {
    this.error = 'Select a date first';
    return;
  }

  this.loading = true;
  this.availability.getAvailabilitySlots(date).subscribe({
    next: (res: any) => {
      this.loading = false;
      this.slots = res?.slots ?? res ?? [];
      if (!this.slots.length) {
        this.message = 'No slots generated for the selected date.';
      }
    },
    error: (err) => {
      this.loading = false;
      this.error = err?.error?.error || 'Failed to fetch slots';
    }
  });
}


}
