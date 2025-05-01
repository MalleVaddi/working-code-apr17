import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//we know that response will be in JSON format
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserProfileService {

    constructor(private http:HttpClient) {}

    // Uses http.get() to load data 
    getUser() {
        return this.http.get('http://localhost:8000/user_profile');
    }
    //Uses http.post() to post data 
    addUser(firstName: string, lastName: string,email: string,password: string, phone: string, street: string, city: string, state: string, zip: string, bio: string,  countries_visited: string) {
    this.http.post('http://localhost:8000/user_profile',{ firstName, lastName, email,password, phone, street, city, state, zip, bio, countries_visited })
        .subscribe((responseData) => {
            console.log(responseData);
        }); 
        //location.reload()
    }
    getUsers(userId: string) {
        return this.http.get('http://localhost:8000/user_profile/'+ userId);
    }
    updateUser(userId: string,firstName: string, lastName: string,email: string,password: string,
        phone: string, street: string, city: string, state: string, zip: string,bio: string,
        countries_visited: string ) {
        //request path http://localhost:8000/students/5xbd456xx 
        //first and last names will be send as HTTP body parameters 
        this.http.put("http://localhost:8000/user_profile/" + 
        userId,{ firstName, lastName, email, password, phone, street, city, state, zip, bio,
            countries_visited })
        .subscribe(() => {
            console.log('Updated: ' + userId);
        });
    }

   

    deleteUser(userId: string) {
        this.http.delete("http://localhost:8000/user_profile/" + userId)
            .subscribe(() => {
                console.log('Deleted: ' + userId);
                
            });
            location.reload()
    }
    
    
    
}
