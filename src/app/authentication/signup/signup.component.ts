import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(private authService: AuthService) {}
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.signUp(form.value.email, form.value.password);
    return form.resetForm();
  }
}
