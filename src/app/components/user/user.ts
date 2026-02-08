import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../services/user-data';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [CommonModule],
  providers: [UserService, UserData],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

  user_list: any = [];

  constructor(private userData: UserData, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUser(userId).subscribe(
        (response: any) => {
          this.user_list = response ? [response] : [];
        },
        (error: any) => {
          this.user_list = [];
        }
      );
    }
  }
}