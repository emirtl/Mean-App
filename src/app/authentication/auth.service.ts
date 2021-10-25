import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthModel } from './authModel';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string = '';
  private isAuthListner = new Subject<boolean>();
  private isAuth = false;
  private timeOutDeletion: any;
  constructor(private http: HttpClient, private router: Router) {}

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
      .post<{ message: string; token: string; expiresIn: number }>(
        'http://localhost:3000/api/auth/login',
        authModel
      )
      .subscribe((resData) => {
        this.token = resData.token;
        if (this.token) {
          const expiresIn = resData.expiresIn;
          this.timeOutDeletion = setTimeout(() => {
            this.logOut();
          }, expiresIn * 1000);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(this.token, expirationDate);
          console.log(expirationDate);
          this.isAuth = true;
          this.isAuthListner.next(true);
        }
        this.router.navigate(['/']);
      });
  }

  getToken() {
    return this.token;
  }

  getIsAuthListner() {
    return this.isAuthListner.asObservable();
  }

  getisAuth() {
    return this.isAuth;
  }

  logOut() {
    this.token = '';
    this.isAuth = false;
    this.isAuthListner.next(false);
    this.RemoveAuthData();
    clearTimeout(this.timeOutDeletion);
    this.router.navigate(['/']);
  }
  private saveAuthData(token: string, expirationData: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationData.toISOString());
  }

  private RemoveAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }
}
