import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyProfile() {
    return this.http.get<any>(`${this.base}/doctor/profile`);
  }

  updateMyProfile(payload: any) {
    return this.http.put(`${this.base}/doctor/profile`, payload);
  }

  getSpecializations() {
    return this.http.get<any[]>(`${this.base}/specializations`);
  }

  getDepartments() {
    return this.http.get<any[]>(`${this.base}/departments`);
  }

    uploadDocument(formData: FormData) {
    return this.http.post<any>(`${this.base}/doctor/profile/documents`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteDocument(url: string) {
  return this.http.delete<any>(`${this.base}/doctor/profile/documents`, {
    body: { url }
  });
}


}
