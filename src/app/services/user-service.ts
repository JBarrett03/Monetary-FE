import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class UserService {

  private apiUrl = 'http://localhost:5000/api/v1.0/users';

  constructor(private http: HttpClient) { }

  getUser(id: any) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUser(user: any) {
    return this.http.post(this.apiUrl, user);
  }

  editUser(userId: string, updatedUser: { firstName: string, lastName: string, email: string, phone: string, address: string }) {
    return this.http.put(`${this.apiUrl}/${userId}`, updatedUser);
  }

  changePassword(userId: string, currentPassword: string, newPassword: string) {
    return this.http.put(`${this.apiUrl}/${userId}/change-password`, { currentPassword, newPassword });
  }
}
