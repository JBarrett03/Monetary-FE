import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  pageSize: number = 3;

  constructor(private http: HttpClient) {}

  getUsers(page: number) {
    return this.http.get<any>('http://localhost:5000/api/v1.0/users?pn=' + page + '&ps=' + this.pageSize);
  }

  getUser(id: any) {
    return this.http.get<any>('http://localhost:5000/api/v1.0/users/' + id);
  }

}

