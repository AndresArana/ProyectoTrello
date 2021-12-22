import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
})
export class ListTaskComponent implements OnInit {
  _id: string;
  taskData: any;
  taskTodo: any;
  taskInprogress: any;
  taskDone: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _boardService: BoardService,
    private _snackBar: MatSnackBar,
    private _Arouter: ActivatedRoute,
  ) {
    this._id='';
    this.taskData = {};
    this.taskTodo = [];
    this.taskInprogress = [];
    this.taskDone = [];
  }

  ngOnInit(): void {
    this._Arouter.params.subscribe((params) => {
      this._id = params['_id'];
      this._boardService.listTaskId(this._id).subscribe({
        next: (v) => {
          this.taskData = v.boardList;
          this.taskData.forEach((tk: any) => {
            if (tk.taskStatus === 'to-do') {
              this.taskTodo.push(tk);
            }
            if (tk.taskStatus === 'in-progress') {
              this.taskInprogress.push(tk);
            }
            if (tk.taskStatus === 'done') {
              this.taskDone.push(tk);
            }
          });
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('complete'),
      });
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.dropUpdate();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.dropUpdate();
    }
  }



  updateTask(task: any, status: string) {
    let tempStatus = task.taskStatus;
    task.taskStatus = status;
    this._boardService.updateTask(task).subscribe({
      next: (v) => {
        task.status = status;
        this.resetList();
      },
      error: (e) => {
        task.status = tempStatus;
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info(task),
    });
  }



  resetList() {
    this.taskTodo = [];
    this.taskInprogress = [];
    this.taskDone = [];
    this._boardService.listTaskId(this._id).subscribe({
      next: (v) => {
        this.taskData = v.boardList;
        this.taskData.forEach((tk: any) => {
          if (tk.taskStatus === 'to-do') {
            this.taskTodo.push(tk);
          }
          if (tk.taskStatus === 'in-progress') {
            this.taskInprogress.push(tk);
          }
          if (tk.taskStatus === 'done') {
            this.taskDone.push(tk);
          }
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  dropUpdate() {
    this.taskTodo.forEach((tk: any) => {
      if (tk.taskStatus !== 'to-do') {
        this.updateTask(tk, 'to-do');
      }
    });
    this.taskInprogress.forEach((tk: any) => {
      if (tk.taskStatus !== 'in-progress') {
        this.updateTask(tk, 'in-progress');
      }
    });
    this.taskDone.forEach((tk: any) => {
      if (tk.taskStatus !== 'done') {
        this.updateTask(tk, 'done');
      }
    });
  }

  findTask(task: any){
   this._boardService.findTask(task).subscribe({
     next: (v) =>{
      let index = this.taskData.indexOf(task);
      this.taskData.forEach((tk: any) => {
        if (tk.taskStatus === 'to-do') {
          this.taskTodo.findIndex( tk._id ===this._boardService.findTask(tk._id));
          console.log(index);
          return index
        }
        if (tk.taskStatus === 'in-progress') {
          this.taskTodo.findIndex(tk._id === this._boardService.findTask(tk._id));
          console.log(index);
          return index
        }
        if (tk.taskStatus === 'done') {
          this.taskTodo.findIndex(tk._id === this._boardService.findTask(tk._id));
          console.log(index);
          return index
        }
      });
     },
     error: (e) => {
      this.message = e.error.message;
      this.openSnackBarError();
    },
    complete: () => console.info('complete'),
   })
  }

  deleteTask(task: any) {
    this._boardService.deleteTask(task).subscribe({
      next: (v) => {
        let index = this.taskData.indexOf(task);
        if (index > -1) {
          this.taskData.splice(index, 1);
          this.message = v.message;
          this.openSnackBarSuccesfull();
          this.resetList();
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
