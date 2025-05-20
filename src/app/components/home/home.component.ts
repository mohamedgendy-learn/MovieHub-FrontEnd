import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService); // Inject AuthService
 
  featuredMovies = [
    {
      title: 'Inception',
      description: 'A mind-bending thriller by Christopher Nolan.',
      image: 'https://via.placeholder.com/300x200?text=Inception'
    },
    {
      title: 'Interstellar',
      description: 'A journey through space and time.',
      image: 'https://via.placeholder.com/300x200?text=Interstellar'
    },
    {
      title: 'The Dark Knight',
      description: 'Batman faces the Joker in this epic showdown.',
      image: 'https://via.placeholder.com/300x200?text=The+Dark+Knight'
    }
  ];

  ngOnInit(): void {
    // You might want to check the login status on initialization
    console.log('Is logged in on Home:', this.authService.isLoggedIn());
  }

  logout() {
    this.authService.logout();
  }
}