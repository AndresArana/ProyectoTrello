import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/services/table.service';
import { UserService } from '../../services/user.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.css'],
})
export class ListTableComponent implements OnInit {
  tableData: any;
  // tableTodo: any;
  // tableInprogress: any;
  // taskDone: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;
  constructor(
    public _userService: UserService,
    private _tableService: TableService,
    private _snackBar: MatSnackBar
  ) {
    this.tableData = {};
    // this.tableTodo = [];
    // this.tableInprogress = [];
    // this.tableDone = [];
  }

  ngOnInit(): void {
    this._tableService.listWorkB().subscribe({
      next: (v) => {
        this.tableData = v.worksGroup;
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      }
    });
  }

  deleteTable(table: any) {
    this._tableService.deleteTable(table).subscribe({
      next: (v) => {
        let index = this.tableData.indexOf(table);
        if (index > -1) {
          this.tableData.splice(index, 1);
          this.message = v.message;
          this.openSnackBarSuccesfull();
        }
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
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
