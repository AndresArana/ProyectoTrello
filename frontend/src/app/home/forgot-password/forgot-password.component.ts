import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordData: any;
  message: string = '';
  _id: string;
  newPass: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _Arouter: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.forgotPasswordData = {};
    this._id = '';
    this.newPass = '';
  }

  ngOnInit(): void {
    this._Arouter.params.subscribe((params)=>{
      this._id = params['_id']
      this._userService.findUserPass(this._id).subscribe({
        next: (v) =>{
          this.forgotPasswordData = v.userfind;
          this.forgotPasswordData.password = this.newPass
          console.log(this.forgotPasswordData)
        },
        error: (e) => {
          this.message = 'daasd';
          this.openSnackBarError();
        }
      })
    })
  }

  forgotPassword(){
    if (!this.forgotPasswordData.password || !this.forgotPasswordData.password2) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
    } else {
      this._userService.forgotPassword(this.forgotPasswordData).subscribe({
        next: (v) => {
          this.message='Succefull recovery passwword';
          this.openSnackBarSuccesfull();
          this.forgotPasswordData={};
        },
        error: (e)=>{
          this.message = e.error.message;
          this.message = 'error recovery password';
          this.openSnackBarError
        },
        complete: () => console.info('complete'),
      })
    }
  }


  openSnackBarSuccesfull() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarTrue'],
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
