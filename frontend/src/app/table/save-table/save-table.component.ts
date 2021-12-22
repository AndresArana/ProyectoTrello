import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/services/table.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-save-table',
  templateUrl: './save-table.component.html',
  styleUrls: ['./save-table.component.css'],
})
export class SaveTableComponent implements OnInit {
  registerData: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;
  constructor(
    private _tableService: TableService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.registerData = {};
  }

  ngOnInit(): void {}
  saveWorkB() {
    if (!this.registerData.name || !this.registerData.description) {
      this.message = 'Failed process: Incomplete data';
      this.openSnackBarError();
    } else {
      // const data = new FormData();
      // data.append('name', this.registerData.name);
      // data.append('description', this.registerData.description);

      this._tableService.saveWorkB(this.registerData).subscribe({
        next: (v) => {
          this._router.navigate(['/listWorkB']);
          this.message = 'Table created';
          this.openSnackBarSuccesfull();
          this.registerData = {};
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('complete'),
      });
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
