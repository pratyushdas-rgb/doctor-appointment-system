import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from 'src/app/auth/auth.service';

interface DoctorProfileForm {
  specialization_id: number;
  department_id: number;
  bio: string;
  documents: any[];
}
@Component({
  selector: 'app-doctor-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {

  user: any = null;
  loading = false;
  specializations: any[] = [];
  departments: any[] = [];

profileForm = this.fb.nonNullable.group<DoctorProfileForm>({
  specialization_id: 0,
  department_id: 0,
  bio: '',
  documents: []   
});

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private auth: AuthService
  ) {
    this.user = this.auth.getUser();  
  }

  ngOnInit(): void {
    this.loadReferenceData();
    this.loadProfile();
  }

  loadReferenceData() {
    this.doctorService.getSpecializations().subscribe(res => {
      this.specializations = res;
    });

    this.doctorService.getDepartments().subscribe(res => {
      this.departments = res;
    });
  }

  loadProfile() {
    this.loading = true;
    this.doctorService.getMyProfile().subscribe({
      next: (res) => {
        this.loading = false;
        this.profileForm.patchValue({
          specialization_id: res.specialization_id,
          department_id: res.department_id,
          bio: res.bio,
          documents: res.documents || []
        });
      },
      error: () => this.loading = false
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    const payload = this.profileForm.getRawValue();
    this.doctorService.updateMyProfile(payload).subscribe({
      next: () => alert('Profile updated successfully'),
      error: () => alert('Failed to update profile')
    });
  }
}
