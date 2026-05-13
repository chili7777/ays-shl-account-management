import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://ays-msa-dm-cuaa-cr-account-stagi-zdpms.ondigitalocean.app/customers';

  private _isLoggedIn = signal<boolean>(this.checkSession());

  get isLoggedIn() {
    return this._isLoggedIn.asReadonly();
  }

  private getHeaders(isJson = false): HttpHeaders {
    const headers: any = {
      'x-guid': '550e8400-e29b-41d4-a716-446655440000',
      'x-app': 'postman-test',
      'Accept': 'application/json'
    };
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    return new HttpHeaders(headers);
  }

  login(clientId: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { identification: clientId, password }, { headers: this.getHeaders(true) })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('clientId', clientId);
          if (response && (response.name || response.fullName)) {
            localStorage.setItem('userName', response.name || response.fullName);
          }
          this._isLoggedIn.set(true);
        }),
        catchError(err => {
          return throwError(() => err);
        })
      );
  }

  register(customerData: any): Observable<any> {
    return this.http.post(this.apiUrl, customerData, { headers: this.getHeaders(true) });
  }

  logout() {
    localStorage.removeItem('clientId');
    localStorage.removeItem('userName');
    this._isLoggedIn.set(false);
  }

  private checkSession(): boolean {
    return !!localStorage.getItem('clientId');
  }

  getClientId(): string | null {
    return localStorage.getItem('clientId');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }
}
