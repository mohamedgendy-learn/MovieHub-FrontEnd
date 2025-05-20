import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig) // Used appConfig in bootstrapApplication
  .catch((err) => console.error(err));

// bootstrapApplication(AppComponent, {
//   providers: [provideRouter(routes)]
// }).catch((err) => console.error(err));
