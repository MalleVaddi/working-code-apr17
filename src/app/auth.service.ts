import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';



interface LoginResponse {
  success?: boolean;
  message: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8000/login';
  private signupUrl = 'http://localhost:8000/user_profile'; // Adjust if needed

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };

    return this.http.post<LoginResponse>(this.loginUrl, body).pipe(
      map(response => ({
        success: true,
        message: response.message,
        userId: response.userId
      })),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => ({
          success: false,
          message: error.error?.message || 'Login failed'
        }));
      })
    );
  }

  signup(userData: any): Observable<any> {
    return this.http.post(this.signupUrl, userData).pipe(
      map(response => ({
        success: true,
        message: 'User registered successfully',
        data: response
      })),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => ({
          success: false,
          message: error.error?.message || 'Signup failed'
        }));
      })
    );
  }
}
