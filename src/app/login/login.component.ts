import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // ✅ Import Router
import { AuthService } from '../auth.service';// ✅ Make sure this path is correct

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    pwd: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
  });

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Form is already initialized above
  }

  loginSubmited(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const pwd = this.loginForm.value.pwd ?? '';

    this.authService.login(email, pwd).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('✅ Login successful:', response);
          this.router.navigate(['/listUser']); // Redirect to home or dashboard
        } else {
          console.error('❌ Login failed:', response.message);
        }
      },
      (error: any) => {
        console.error('❌ Login error:', error);
      }
    );
  }

  // 🔁 This method now works as intended
  goToSignup(): void {
    this.router.navigate(['/addUser']); // Navigates to http://localhost:4200/addUser
  }

  get Email(): FormControl {
    return this.loginForm.get("email") as FormControl;
  }

  get Pwd(): FormControl {
    return this.loginForm.get("pwd") as FormControl;
  }
}

