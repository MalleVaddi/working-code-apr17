import { Component,OnInit } from '@angular/core';
import{MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import{ MatButtonModule } from '@angular/material/button';
import {Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray } from '@angular/forms';
import{ UserProfileService } from '../user_profile.service';
import {Router} from '@angular/router';
import {ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-user-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule , ReactiveFormsModule,CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  public mode = 'Add'; //default mode
  private id: any; //student ID
  

  constructor(private _myService: UserProfileService,private router:Router,public route: ActivatedRoute) { }
  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap ) => {
        if (paramMap.has('_id'))
            { this.mode = 'Edit'; /*request had a parameter _id */ 
            this.id = paramMap.get('_id');
        } else {
            this.mode = 'Add';
            this.id = null; }
    });
}
  
  formBuilder: any;
 
   // Scroll to the top of the page
   scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  profileImage: string | ArrayBuffer | null = '';

    userForm = new FormGroup({
      firstName: new FormControl('',[Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('',[Validators.required, Validators.minLength(2)]),
      email: new FormControl('',[Validators.required, Validators.email]),
      phone: new FormControl('',[Validators.required, Validators.pattern(/^\d{10}$/)]),
      
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl('',[Validators.required, Validators.pattern(/^\d{5}$/)]),
      
      bio: new FormControl(''),
      profileImage: new FormControl(null as File | null),
      profilePic: new FormControl(null as File | null),
      countries_visited: new FormControl(''),

    });
    onFileChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.profileImage = reader.result; // Store image preview
          this.userForm.get('profilePic')?.setValue(file);
        };
        reader.readAsDataURL(file);
      }
    }
  
    onSubmit(){
      let firstName = this.userForm.get('firstName')?.value ?? "";
      let lastName = this.userForm.get('lastName')?.value ?? "";
      let email = this.userForm.get('email')?.value ?? "";
      let phone = this.userForm.get('phone')?.value ?? "";
      let street = this.userForm.get('street')?.value ?? "";
      let city = this.userForm.get('city')?.value ?? "";
      let state = this.userForm.get('state')?.value ?? "";
      let zip = this.userForm.get('zip')?.value ?? "";
      let bio = this.userForm.get('bio')?.value ?? "";
      let profileImage = this.userForm.get('profileImage')?.value ?? "";
      let countries_visited = this.userForm.get('countries_visited')?.value ?? "";
      //let countries_visited = this.userForm.get('countries_visited')?.value ?? "";
      console.log("You submitted: " + firstName + " " + lastName + " " + email + " " + phone + " " + street + " " + city + " " + state + " " + zip + " " + bio + " " + profileImage + " " + countries_visited);
     
      //(this._myService.addUser(firstName, lastName, email, phone, street, city, state, zip, bio, this.userForm.get('profilePic')?.value as File, countries_visited);)
      
    if (this.mode == 'Add')
        this._myService.addUser(firstName, lastName, email, phone, street, city, state, zip, bio, this.userForm.get('profilePic')?.value as File, countries_visited);
    if (this.mode == 'Edit')
        this._myService.updateUser(this.id, firstName, lastName, email, phone, street, city, state, zip, bio, typeof profileImage === 'string' ? profileImage : '', countries_visited);
      
    this.router.navigate(['/listUser']);
    }

    
  }
                      

