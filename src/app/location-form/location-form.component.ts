import { Component, AfterViewInit, ElementRef, ViewChild, OnInit} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';  // Import schema
import { CommonModule } from '@angular/common';
import { GoogleMap } from '@angular/google-maps';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { LocationService } from '../location.service';
import {Router} from '@angular/router';

declare const google: any; // Ensure Google is recognized
type CustomMarker = google.maps.Marker & {
  _id: string;
  city?: string;
  country?: string;
  description?: string;
  category?: string;
  rating?: number;
  infoWindow?: google.maps.InfoWindow; // 👈 add this
};

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css'],
  providers: [LocationService]
})
export class LocationFormComponent {
  //declare variable to hold response and make it public to be accessible from components.html
  public locations: any;
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef; // Add ViewChild for map container
  map!: google.maps.Map; // Declare the map property
  markers: google.maps.Marker[] = []; // Declare markers array
  isEditMode: boolean = false;
  editingMarkerId: string | null = null;
  selectedMarker: CustomMarker | null = null;  

  constructor(private _myService: LocationService, private http: HttpClient, private router: Router) {}

  locationForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    country: new FormControl('', { nonNullable: true }),
    lat: new FormControl<number | null>(null, { nonNullable: false }),
    lng: new FormControl<number | null>(null, { nonNullable: false }),
    description: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    rating: new FormControl(0, { nonNullable: true }),
  });

  ngOnInit() {
    console.log("📌 Initializing Form...");
    this.locationForm = new FormGroup({
      name: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
      country: new FormControl('', { nonNullable: true }),
      lat: new FormControl<number | null>(null, { nonNullable: false }),
      lng: new FormControl<number | null>(null, { nonNullable: false }),
      description: new FormControl('', { nonNullable: true }),
      category: new FormControl('', { nonNullable: true }),
      rating: new FormControl(0, { nonNullable: true }),
    });
    console.log("✅ Form Initialized:", this.locationForm.value);
  }

     addNewLocation() {
      if (this.locationForm.invalid) {
        alert("Please complete the form before submitting.");
        return;
      }
    
      const formValues = this.locationForm.value;
    
      if (this.isEditMode && this.editingMarkerId) {
        this.saveLocation(); // Delegate to save function for updates
      } else {
        const newLocation = {
          id: Math.random().toString(36).substring(2, 9),
          name: formValues.name!,
          location: {
            city: formValues.city!,
            country: formValues.country!,
          },
          coordinates: {
            lat: formValues.lat!,
            lng: formValues.lng!,
          },
          description: formValues.description!,
          category: formValues.category!,
          rating: formValues.rating!,
        };
    
        this._myService.addLocations(
          newLocation.name,
          newLocation.location,
          newLocation.coordinates,
          newLocation.description,
          newLocation.category,
          newLocation.rating
        );
    
        this.addMarker(newLocation);
        this.resetForm();
      }
    }

  ngAfterViewInit() {
    this.loadMap();
    this.fetchLocations();
  }

  loadMap() {
    const mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(40.7128, -74.0060), // Default NYC
      zoom: 5,
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
  }

  fetchLocations() {
    this.http.get<any[]>('http://localhost:8000/locations').subscribe((locations) => {
      locations.forEach((location) => {
        this.addMarker(location);
      });
    });
  }

  addMarker(spot: any) {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(spot.coordinates.lat, spot.coordinates.lng),
      map: this.map,
      title: spot.name,
    }) as CustomMarker;

      marker._id = spot._id || Math.random().toString(36).substr(2, 9);
      marker.city = spot.location?.city;
      marker.country = spot.location?.country;
      marker.description = spot.description;
      marker.category = spot.category;
      marker.rating = spot.rating;

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="text-align:center;">
          <h4>${spot.name || 'Unknown Place'}</h4>
          <p><strong>Location:</strong> ${spot.location?.city || 'Not Available'}, ${spot.location?.country || 'Not Available'}</p>
          <p><strong>Description:</strong> ${spot.description || 'No Description Available'}</p>
          <p><strong>Category:</strong> ${spot.category || 'Not Specified'}</p>
          <p><strong>Rating:</strong> ⭐ ${spot.rating || 'N/A'}</p>
        </div>
      `,
    });

    marker.infoWindow = infoWindow; // ✅ Add this line here

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
      this.selectedMarker = marker as CustomMarker;
    });
    

    marker.addListener('mouseover', () => {
      infoWindow.open(this.map, marker);
    });
    marker.addListener('mouseout', () => {
      infoWindow.close();
    });

    this.markers.push(marker);
  }

  editMarker(marker: CustomMarker) {
    this.locationForm.patchValue({
      name: marker.getTitle() || '',
      city: marker.city || '',
      country: marker.country || '',
      lat: marker.getPosition()?.lat() ?? null,
      lng: marker.getPosition()?.lng() ?? null,
      description: marker.description || '',
      category: marker.category || '',
      rating: marker.rating || 0,
    });
  
    this.isEditMode = true;
    this.editingMarkerId = marker._id;
  }
  

  removeMarker(marker: CustomMarker | null) {
    if (!marker) return;
  
    // Delete marker from the backend using _id
    this._myService.deleteLocation(marker._id).subscribe(
      (response) => {
        console.log("✅ Marker deleted successfully:", response);
        // Remove marker from the map
        marker.setMap(null);
        this.markers = this.markers.filter(m => (m as CustomMarker)._id !== marker._id);
      },
      (error) => {
        console.error("🚨 Error deleting marker:", error);
      }
    );
  
    // Clear edit state if the removed marker is being edited
    if (this.editingMarkerId === marker._id) {
      this.resetForm();
    }
  } 
  
  resetForm(): void {
    this.locationForm.reset();
    this.isEditMode = false;
    this.editingMarkerId = null;
    this.selectedMarker = null;
  }

  saveLocation() {
    const formValues = this.locationForm.value;
    const marker = this.markers.find(m => (m as CustomMarker)._id === this.editingMarkerId) as CustomMarker;
  
    if (!marker) {
      console.error("Marker not found for editing.");
      return;
    }
  
    // Update marker data (on UI)
    marker.setTitle(formValues.name!);
    marker.setPosition(new google.maps.LatLng(formValues.lat!, formValues.lng!));
  
    // Update marker properties
    marker.city = formValues.city!;
    marker.country = formValues.country!;
    marker.description = formValues.description!;
    marker.category = formValues.category!;
    marker.rating = formValues.rating!;

      // ✅ UPDATE INFO WINDOW CONTENT (add here)
  if (marker.infoWindow) {
    marker.infoWindow.setContent(`
      <div style="text-align:center;">
        <h4>${formValues.name}</h4>
        <p><strong>Location:</strong> ${formValues.city}, ${formValues.country}</p>
        <p><strong>Description:</strong> ${formValues.description}</p>
        <p><strong>Category:</strong> ${formValues.category}</p>
        <p><strong>Rating:</strong> ⭐ ${formValues.rating}</p>
      </div>
    `);

    // Optional: reopen the infoWindow if currently selected
    if (this.selectedMarker === marker) {
      marker.infoWindow.close();
      marker.infoWindow.open(this.map, marker);
    }
  }
  
    // Check if editingMarkerId is not null before calling updateLocation
    if (this.editingMarkerId) {
      this._myService.updateLocation?.(this.editingMarkerId, {
        name: formValues.name!,
        location: {
          city: formValues.city!,
          country: formValues.country!
        },
        coordinates: {
          lat: formValues.lat!,
          lng: formValues.lng!
        },
        description: formValues.description!,
        category: formValues.category!,
        rating: formValues.rating!
      }).subscribe(
        (response) => {
          console.log("✅ Location updated successfully:", response);
          this.resetForm();
        },
        (error) => {
          console.error("🚨 Error updating location:", error);
        }
      );
    } else {
      console.error("🚨 editingMarkerId is null, cannot update location.");
    }
  }
  
  generateInfoWindowContent(spot: any): string {
    return `
      <div style="text-align:center;">
        <h4>${spot.name || 'Unknown Place'}</h4>
        <p><strong>Location:</strong> ${spot.location?.city || 'Not Available'}, ${spot.location?.country || 'Not Available'}</p>
        <p><strong>Description:</strong> ${spot.description || 'No Description Available'}</p>
        <p><strong>Category:</strong> ${spot.category || 'Not Specified'}</p>
        <p><strong>Rating:</strong> ⭐ ${spot.rating || 'N/A'}</p>
      </div>
    `;
  }
  
  

  
}


  


