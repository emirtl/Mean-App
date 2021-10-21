import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    return form.resetForm();
  }
}
