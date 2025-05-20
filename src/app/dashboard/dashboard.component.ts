import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../services/movie.service';
import { AuthService } from '../services/auth.service';

interface OMDBResponse {
  Search?: any[];
  totalResults?: string;
  Response: string;
  Error?: string;
}
interface BackendMovie {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
}

interface OMDBMovieDetail {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Response: string;
  Error?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  searchTerm: string = '';
  searchResults: any[] = [];
  errorMessage: string = '';
  addedMovies: Set<string> = new Set<string>();
  showingSearch: boolean = true; // Initially show search
  databaseMovies: BackendMovie[] = [];
  authService = inject(AuthService);
  router = inject(Router);
  selectedMovieIds: string[] = []; // For adding
  selectedToDelete: string[] = []; // For deleting
  selectedMoviesMap: { [key: string]: any } = {};
  userSearchTerm: string = '';
  userSearchResults: BackendMovie[] = [];
  userSearchErrorMessage: string = '';

  constructor(private movieService: MovieService) {}

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    console.log('User Role on Dashboard:', this.authService.isAdmin());
    this.loadDatabaseMovies(); // Load movies on initialization
  }

  onCheckboxChange(event: Event, movie: any, isForDeletion: boolean = false) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    if (isForDeletion) {
      this.toggleMovieSelectionToDelete(movie.imdbID, isChecked);
    } else {
      this.toggleMovieSelectionToAdd(movie, isChecked);
    }
  }

  toggleMovieSelectionToAdd(movie: any, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedMovieIds.includes(movie.imdbID)) {
        this.selectedMovieIds.push(movie.imdbID);
        this.selectedMoviesMap[movie.imdbID] = movie;
      }
    } else {
      this.selectedMovieIds = this.selectedMovieIds.filter(id => id !== movie.imdbID);
      delete this.selectedMoviesMap[movie.imdbID];
    }
    console.log('Selected IDs for Add:', this.selectedMovieIds);
  }

  toggleMovieSelectionToDelete(imdbID: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedToDelete.includes(imdbID)) {
        this.selectedToDelete.push(imdbID);
      }
    } else {
      this.selectedToDelete = this.selectedToDelete.filter(id => id !== imdbID);
    }
    console.log('Selected IDs for Delete:', this.selectedToDelete);
  }

  isSelectedToAdd(imdbID: string): boolean {
    return this.selectedMovieIds.includes(imdbID);
  }

  isSelectedToDelete(imdbID: string): boolean {
    return this.selectedToDelete.includes(imdbID);
  }

  addSelectedMoviesToDatabase(): void {
    const moviesToAdd = Object.values(this.selectedMoviesMap).map((movie: any) => ({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }));

    if (moviesToAdd.length > 0) {
      console.log('--- Movies to be added ---');
      moviesToAdd.forEach(movie => console.log(`Title: ${movie.title}`));
      this.movieService.addMultipleToDatabase(moviesToAdd).subscribe({
        next: (response) => {
          console.log('Selected movies added successfully', response);
          this.selectedMovieIds = [];
          this.selectedMoviesMap = {};
          this.loadDatabaseMovies();
        },
        error: (error) => {
          console.error('Error adding selected movies', error);
          this.errorMessage = 'Failed to add selected movies.';
        },
      });
    } else {
      alert('Please select movies to add.');
    }
  }

  deleteSelectedMovies(): void {
    if (this.selectedToDelete.length > 0) {
      if (confirm(`Are you sure you want to delete ${this.selectedToDelete.length} movies?`)) {
        console.log('--- IDs to be deleted ---', this.selectedToDelete);
        this.movieService.removeMultipleFromDatabase(this.selectedToDelete).subscribe({
          next: (response) => {
            console.log('Selected movies deleted successfully', response);
            this.selectedToDelete = [];
            this.loadDatabaseMovies();
          },
          error: (error) => {
            console.error('Error deleting selected movies', error);
            alert('Failed to delete selected movies.');
          },
        });
      }
    } else {
      alert('Please select movies to remove.');
    }
  }

  searchMovies() {
    if (this.searchTerm.trim()) {
      this.movieService.searchMovies(this.searchTerm.trim()).subscribe({
        next: (response) => {
          this.searchResults = response.Search || [];
          this.errorMessage = response.Error || '';
          if (response.Response === 'False' && !this.errorMessage) {
            this.errorMessage = 'No movies found!';
          }
        },
        error: (error) => {
          console.error('Search error:', error);
          this.errorMessage = 'Failed to search movies.';
          this.searchResults = [];
        },
      });
    } else {
      this.searchResults = [];
      this.errorMessage = '';
    }
  }

  toggleView() {
    this.showingSearch = !this.showingSearch;
    if (!this.showingSearch) {
      this.loadDatabaseMovies();
    }
  }

  loadDatabaseMovies() {
    this.movieService.getDatabaseMovies().subscribe({
      next: (movies) => {
        this.databaseMovies = movies;
        // Reset selectedToDelete when loading movies
        this.selectedToDelete = [];
      },
      error: (error) => {
        console.error('Error loading database movies:', error);
        alert('Failed to load movies from the database.');
      },
    });
  }

  removeFromDatabase(imdbID: string) {
    this.movieService.removeFromDatabase(imdbID).subscribe({
      next: (response) => {
        console.log('Removed from database:', response);
        alert(`Movie with ID "${imdbID}" removed from the database.`);
        this.loadDatabaseMovies();
        this.addedMovies.delete(imdbID);
      },
      error: (error) => {
        console.error('Error removing from database:', error);
        alert(`Failed to remove movie with ID "${imdbID}" from the database.`);
      },
    });
  }

  searchDatabaseMoviesByUser() {
    if (this.userSearchTerm.trim()) {
      this.movieService.searchDatabaseMovies(this.userSearchTerm.trim()).subscribe({
        next: (movies) => {
          this.userSearchResults = movies;
          this.userSearchErrorMessage = '';
          console.log('User search results:', this.userSearchResults);
        },
        error: (error) => {
          console.error('Error searching database movies:', error);
          this.userSearchResults = [];
          this.userSearchErrorMessage = 'Failed to find movies.';
        },
      });
    } else {
      this.userSearchResults = [];
      this.userSearchErrorMessage = '';
    }
  }
}