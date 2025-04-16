import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//we know that response will be in JSON format
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LocationService {
    private apiUrl = 'http://localhost:8000/locations';

    constructor(private http:HttpClient) {}

    // Uses http.get() to load data 
    getLocations() {
        return this.http.get('http://localhost:8000/locations');
        
    }
//Uses http.post() to post data 
addLocations(name: string,
    location: {
      city: string,
      country: string,
    },
    coordinates: {
      lat: number,
      lng: number,
    },
    description: string,
    category: string,
    rating: number) {
    this.http.post('http://localhost:8000/locations', { name, location, coordinates, description, category, rating }, httpOptions)
        .subscribe((responseData) => {
            console.log(responseData);
        });
    }

    updateLocation(id: string, locationData: any) {
        const url = `http://localhost:8000/locations/${id}`; // MongoDB uses _id
        return this.http.put(url, locationData);
      }
    
      deleteLocation(id: string) {
        const url = `http://localhost:8000/locations/${id}`; // MongoDB uses _id
        return this.http.delete(url);
      }
      
    
}
    