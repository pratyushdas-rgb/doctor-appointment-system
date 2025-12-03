import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpEventType } from '@angular/common/http';
import { environment } from 'src/environment/environment';

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
  uploadProgress = 0;
  uploading = false;
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

   onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    const fd = new FormData();
    fd.append('file', file, file.name);

    this.uploading = true;
    this.uploadProgress = 0;

    this.doctorService.uploadDocument(fd).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        } else if (event.type === HttpEventType.Response) {
          this.uploading = false;
          const body = event.body;
          if (body && body.documents) {
            this.profileForm.patchValue({ documents: body.documents });
          } else if (body && body.added) {
            const docs = this.profileForm.value.documents || [];
            docs.push(body.added);
            this.profileForm.patchValue({ documents: docs });
          }
        }
      },
      error: (err) => {
        this.uploading = false;
        console.error('upload error', err);
        alert('Upload failed');
      }
    });
  }

  private fileBase = (() => {
    const api = environment.apiUrl || '';
    return api.replace(/\/api\/?$/, '') || ''; 
  })();

  getDocUrl(urlPath: string) {
    if (!urlPath) return '#';
    if (/^https?:\/\//i.test(urlPath)) return urlPath;
    if (urlPath.startsWith('/')) {
      return `${this.fileBase}${urlPath}`;
    }
    return `${this.fileBase}/${urlPath}`;
  }

  deleteDoc(doc: any) {
  if (!confirm("Delete this document?")) return;

  this.doctorService.deleteDocument(doc.url).subscribe({
    next: (res) => {
      this.profileForm.patchValue({ documents: res.documents });
    },
    error: (err) => {
      console.error(err);
      alert("Failed to delete document");
    }
  });
}

}
