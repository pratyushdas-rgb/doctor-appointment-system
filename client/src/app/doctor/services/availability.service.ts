import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private base = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  setAvailability(payload: {
    date: string;
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
  }): Observable<any> {
    return this.http.post(`${this.base}/doctor/availability`, payload);
  }

  getAvailabilitySlots(date: string): Observable<any> {
    return this.http.get(`${this.base}/doctor/availability`, { params: { date } });
  }
}
