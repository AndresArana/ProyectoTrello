import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-save-task',
  templateUrl: './save-task.component.html',
  styleUrls: ['./save-task.component.css'],
})
export class SaveTaskComponent implements OnInit {
  info: any;
  registerData: any;
  selectedFile: any;
  message: string = '';
  _id: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _boardService: BoardService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _Arouter: ActivatedRoute,
  ) {
    this.info = {};
    this.registerData = {};
    this._id='';
    this.selectedFile = null;
  }

  ngOnInit(): void {
    
  }

  saveTask(){
    this._Arouter.params.subscribe((params)=>{
      this._id = params["_id"];
      if (!this.registerData.name || !this.registerData.description) {
        this.message = 'Failed process: Imcomplete data';
        console.log(this._id);
        console.log(this.registerData);
        this.openSnackBarError();
      } else {
        this._boardService.saveTask(this._id, this.registerData).subscribe({
          next: (v)=>{
            console.log(this._id);
            console.log(this.registerData);
            this._router.navigate([`/listTask/`+this._id]);
            this.message = 'Successfull task registration';
            this.openSnackBarSuccesfull();
            this.registerData = {};
            console.log(this._id);
            console.log(this.registerData);
          },
          error: (e) => {
            this.message = e.error.message;
            this.openSnackBarError();
          }
        });
      }
    });
  }

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  saveTaskImg() {
    if (!this.registerData.name || !this.registerData.description) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
    } else {
      console.log(this.registerData);
      this._boardService.saveTaskImg(this.registerData).subscribe({
        next: (v) => {
          this._router.navigate(['/listTask']);
          this.message = 'Task create';
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
