import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(private router: Router) {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.setUserRole(storedRole);
    }
  }

  setUserRole(role: string): void {
    this.userRoleSubject.next(role);
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string | null {
    return this.userRoleSubject.getValue();
  }

  isLoggedIn(): boolean {
    return !!this.getUserRole();
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ROLE_ADMIN';
  }

  isUser(): boolean {
    return this.getUserRole() === 'ROLE_USER';
  }

  logout(): void {
    this.userRoleSubject.next(null);
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}