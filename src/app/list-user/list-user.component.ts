import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import{ MatButtonModule } from '@angular/material/button';
import{ UserProfileService } from '../user_profile.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-user',
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css',
  providers: [UserProfileService]
})
export class ListUserComponent implements OnInit {
  public user: any;
  //initialize the call using StudentService 
  constructor(private _myService: UserProfileService) { }
  ngOnInit() {
      this.getUser();
  }
  //method called OnInit
  getUser() {
  this._myService.getUser().subscribe({
    //read data and assign to public variable students
    next: (data => { this.user = data }),
    error: (err => console.error(err)),
    complete: (() => console.log('finished loading'))
  });
  }
  onDelete(userId: string) {
    this._myService.deleteUser(userId);
}

}
