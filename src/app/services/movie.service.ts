import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private omdbApiKey = '255d2dd7';
  private omdbApiUrl = 'http://www.omdbapi.com/';
  private backendApiUrl = 'http://localhost:8080/api/movies'; // Your Spring Boot movie API

  constructor(private http: HttpClient) { }

  searchMovies(searchTerm: string): Observable<OMDBResponse> {
    const url = `${this.omdbApiUrl}?s=${searchTerm}&apikey=${this.omdbApiKey}`;
    return this.http.get<OMDBResponse>(url);
  }

  getMovieDetails(imdbID: string): Observable<OMDBMovieDetail> {
    const url = `${this.omdbApiUrl}?i=${imdbID}&apikey=${this.omdbApiKey}&plot=full`;
    return this.http.get<OMDBMovieDetail>(url);
  }

  addToDatabase(movieDetail: OMDBMovieDetail): Observable<any> {
    const movieToSave = {
      imdbID: movieDetail.imdbID,
      title: movieDetail.Title,
      year: movieDetail.Year,
      poster: movieDetail.Poster
    };
    return this.http.post(`${this.backendApiUrl}/add`, movieToSave);
  }

  removeFromDatabase(imdbID: string): Observable<any> {
    return this.http.delete(`${this.backendApiUrl}/remove/${imdbID}`);
  }

  getDatabaseMovies(): Observable<BackendMovie[]> {
    return this.http.get<BackendMovie[]>(`${this.backendApiUrl}/list`);
  }

  getMovieDetailsFromDatabase(imdbID: string): Observable<any> {
    return this.http.get(`${this.backendApiUrl}/${imdbID}`);
  }

  removeMultipleFromDatabase(imdbIDs: string[]): Observable<any> {
    return this.http.post(`${this.backendApiUrl}/remove/multiple`, imdbIDs);
  }

  addMultipleToDatabase(movies: any[]): Observable<any> {
    return this.http.post(`${this.backendApiUrl}/add/multiple`, movies);
  }

  searchDatabaseMovies(searchTerm: string): Observable<BackendMovie[]> {
    const params = new HttpParams().set('query', searchTerm);
    return this.http.get<BackendMovie[]>(`${this.backendApiUrl}/search`, { params });
  }
}