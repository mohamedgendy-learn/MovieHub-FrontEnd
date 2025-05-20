    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable, catchError, throwError } from 'rxjs';
    import { map } from 'rxjs/operators';

    interface LoginRequest { 
      userName: string;
      password: string;
    }

    @Injectable({
      providedIn: 'root'
    })
    export class LoginService {
      private loginPAI = 'http://localhost:8080/api/auth/login'; 

      constructor(private http: HttpClient) { }

      loginAuth(userName: string, password: string): Observable<string> {
        const loginRequest: LoginRequest = { userName, password }; 

        return this.http.post(this.loginPAI, loginRequest, { responseType: 'text' }) 
          .pipe(
            map((response: string) => {
                return response;
            }),
            catchError(this.handleError)
          );
      }

      private handleError(error: any) {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed.'));
      }
    }
    