import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']); // Redirect to dashboard if logged in
      return false;
    }
    return true; // Allow access to the route if not logged in
  }
}

export const authGuard: CanActivateFn = ((): CanActivateFn => {
  const guard = inject(AuthGuard);
  return () => guard.canActivate();
})();