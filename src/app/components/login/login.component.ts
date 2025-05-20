import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService

interface LoginResponse {
  role: string;
  userId: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginService = inject(LoginService);
  router = inject(Router);
  authService = inject(AuthService); // Inject AuthService
  userName: string = '';
  password: string = '';
  loginError: string = '';

  onLogin() {
    this.loginService.loginAuth(this.userName, this.password).subscribe({
      next: (response: any) => { // Expecting an object now
        console.log('Login successful:', response);
        this.authService.setUserRole(response); // Store the role
        this.router.navigate(['/dashboard']); // Navigate to dashboard
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loginError = 'Invalid username or password.';
      }
    });
  }
}