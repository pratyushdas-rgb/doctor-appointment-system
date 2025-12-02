import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  role: number;
  phone_number?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base = environment.apiUrl + '/auth';
  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.base}/register`, payload);
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: any }>(`${this.base}/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.token) {
            localStorage.setItem('access_token', res.token);
          }
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
      );
  }
  getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  requestPasswordReset(email: string) {
    return this.http.post<{ message?: string }>(
      `${this.base}/request-password-reset`,
      { email }
    );
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ message?: string }>(`${this.base}/reset-password`, {
      token,
      newPassword,
    });
  }
}
