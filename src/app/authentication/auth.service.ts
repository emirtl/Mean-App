import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthModel } from './authModel';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userId: string = '';
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
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>('http://localhost:3000/api/auth/login', authModel)
      .subscribe((resData) => {
        this.token = resData.token;
        this.userId = resData.userId;

        if (this.token) {
          const expiresIn = resData.expiresIn;
          this.logOutTimer(expiresIn);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.setAuthCookie(this.token, expirationDate, this.userId);
          console.log(expirationDate);
          this.isAuth = true;
          this.isAuthListner.next(true);
        }
        this.router.navigate(['/']);
      });
  }

  logOutTimer(expiresIn: number) {
    this.timeOutDeletion = setTimeout(() => {
      this.logOut();
    }, expiresIn * 1000);
  }

  getUserId() {
    return this.userId;
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
    this.userId = '';
    this.RemoveAuthData();
    clearTimeout(this.timeOutDeletion);
    this.router.navigate(['/']);
  }
  saveAuthData() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expiresIn =
        authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token!;
        this.isAuth = true;
        this.userId = authInformation.userId!;
        this.isAuthListner.next(true);
        this.logOutTimer(expiresIn / 1000);
      }
    }
  }

  private setAuthCookie(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private RemoveAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate!),
      userId: userId,
    };
  }
}
