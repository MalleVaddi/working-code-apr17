import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LocationFormComponent } from './location-form/location-form.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { UserProfileService } from './user_profile.service';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule,
    HttpClientModule, 
    LocationFormComponent,
    HeaderComponent, 
    FooterComponent,
    GoogleMapsModule,
    NavigationMenuComponent
    ],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [UserProfileService]
})


export class AppComponent {
  title = 'roam-free-0415';

}
