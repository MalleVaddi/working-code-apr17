import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { LocationService } from './app/location.service'; // Import Location Service
import { UserProfileService } from './app/user_profile.service';
import { AuthService } from './app/auth.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Configure routes
    provideHttpClient(),   // Configure HttpClient
    LocationService,
    UserProfileService    ,
    AuthService      // Provide LocationService globally
  ]
}).catch(err => console.error(err));
