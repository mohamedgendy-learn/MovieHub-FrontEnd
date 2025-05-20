import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';

interface OMDBMovieDetail {
  title: string; 
  year: string;   
  imdbID: string;
  Type?: string;  
  poster: string; 
  Plot?: string;
  Response?: string;
  Error?: string;
}

@Component({
  selector: 'app-moviesdetails',
  imports: [CommonModule ,  RouterModule],
  templateUrl: './moviesdetails.component.html',
  styleUrl: './moviesdetails.component.css'
})
export class MoviesDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  movieService = inject(MovieService);
  imdbID: string | null = null;
  movieDetails: OMDBMovieDetail | null = null;
  errorMessage: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.imdbID = params.get('id');
      if (this.imdbID) {
        this.loadMovieDetails(this.imdbID);
      }
    });
  }

  loadMovieDetails(id: string) {
    this.movieService.getMovieDetailsFromDatabase(id).subscribe({
      next: (details) => {
        this.movieDetails = details;
      },
      error: (error) => {
        console.error('Error fetching movie details:', error);
        this.errorMessage = 'Failed to load movie details.';
      }
    });
  }
}
