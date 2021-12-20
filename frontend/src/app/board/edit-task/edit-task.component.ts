import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit {
  selectedFile: any;
  message: string = '';
  registerData: any;
  _id: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _boardService: BoardService,
    private _router: Router,
    private _Arouter: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.registerData = {};
    this._id = '';
    this.selectedFile = null;
  }

  ngOnInit(): void {
    this._Arouter.params.subscribe((params) => {
      this._id = params['_id'];
      this._boardService.findTask(this._id).subscribe(
        (res) => {
          this.registerData = res.taskfind;
          console.log(this.registerData);
        },
        (err) => {
          this.message = err.error;
          this.openSnackBarError();
        }
      );
    });
  }

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  editTask() {
    if (!this.registerData.name || !this.registerData.description) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
    } else {
      this._boardService.editTask(this.registerData).subscribe(
        (res) => {
          this._router.navigate(['/listTask']);
          this.message = 'Successfull edit Task';
          this.openSnackBarSuccesfull();
          this.registerData = {};
          console.log(this.registerData);
        },
        (err) => {
          this.message = err.error;
          this.openSnackBarError();
        }
      );
    }
  }

  editTaskImg() {
    if (!this.registerData.name || !this.registerData.description) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
    } else {
      const data = new FormData();

      if (this.selectedFile != null) {
        data.append('image', this.selectedFile, this.selectedFile.name);
      }
      data.append('name', this.registerData.name);
      data.append('description', this.registerData.description);
      console.log(data)
      this._boardService.editTaskImg(data).subscribe({
        next: (v) => {
          this._router.navigate(['/listTask']);
          this.message = 'Successfull edit Task';
          this.openSnackBarSuccesfull();
          this.registerData = {};
          console.log(this.registerData);
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('complete'),
      });
    }
  }

  // findTask(){
  //   this._Arouter.params.subscribe((params) => {
  //     this._id = params['_id'];
  //     this._boardService.findTask(this._id).subscribe(
  //       (res) => {
  //         console.log(this.registerData);
  //       },
  //       (err) => {
  //         this.message = err.error;
  //         this.openSnackBarError();
  //       },
  //     );

  //   });
  // }

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
