import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private env: string;
  constructor(private _http: HttpClient) {
    this.env = environment.APP_URL;
  }

  saveWorkB(workBoard: any) {
    return this._http.post<any>(this.env + 'workB/saveWorkB', workBoard);
  }

  listWorkB() {
    return this._http.get<any>(this.env + 'workB/listWorkB');
  }

  deleteTable(table: any) {
    return this._http.delete<any>(this.env + 'workB/deleteWorkB/' + table._id);
  }
}
