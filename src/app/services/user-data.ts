import { Injectable } from '@angular/core';
import userData from '../../assets/users.json';

@Injectable({
  providedIn: 'root',
})
export class UserData {

  pageSize: number = 3;

  getUsers(page: number) {
    let pageStart = (page - 1) * this.pageSize;
    let pageEnd = pageStart + this.pageSize;
    return userData.slice(pageStart, pageEnd);
  }

  getLastPageNumber() {
    return Math.ceil(userData.length / this.pageSize);
  }
  
}
