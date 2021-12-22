import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SocialAuthService } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  registerData: any;
  user: any = SocialUser;
  loggedIn: boolean = true;
  loginData: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private authService: SocialAuthService,
    private _userService: UserService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.loginData = {};
  }
  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loginGoogle();
      this.loggedIn = user != null;
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
  loginGoogle() {
    this.loginData = this.user;
    if (!this.user.email) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
    } else {
      this.loginData = this.user;
      this._userService.registerUserGoogle(this.loginData).subscribe({
        next: (v) => {
          localStorage.setItem('token', v.token);
          this._router.navigate(['/listWorkB']);
          this.message = 'Successfull user registration';
          this.loginData = {};
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('complete'),
      });
    }
  }

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
    } else {
      this._userService.login(this.loginData).subscribe({
        next: (v) => {
          localStorage.setItem('token', v.token);
          this._router.navigate(['/listWorkB']);
          this.getRole(this.loginData.email);
          this.loginData = {};
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('complete'),
      });
    }
  }

  getRole(email: string) {
    this._userService.getRole(email).subscribe({
      next: (v) => {
        localStorage.setItem('role', v.userRole);
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  openSnackBarError() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarFalse'],
    });
  }
}
