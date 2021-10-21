import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthModel } from './authModel';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string = '';
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  signUp(email: string, password: string) {
    const authModel: AuthModel = { email: email, password: password };
    return this.http
      .post<{ message: string; user: AuthModel }>(
        'http://localhost:3000/api/auth/signup',
        authModel
      )
      .subscribe((resData) => {
        console.log(resData);
        this.router.navigate(['/login']);
      });
  }
  login(email: string, password: string) {
    const authModel: AuthModel = { email: email, password: password };
    return this.http
      .post<{ message: string; token: string }>(
        'http://localhost:3000/api/auth/login',
        authModel
      )
      .subscribe((resData) => {
        this.token = resData.token;
        this.router.navigate(['/']);
      });
  }
}
