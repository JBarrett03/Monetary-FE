import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../services/user-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit {
  user: any;
  notFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userData: UserData
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const userId = params['id'];
      const users = this.userData.getUser(userId);
      if (users && users.length > 0) {
        this.user = users[0];
        this.notFound = false;
      } else {
        this.notFound = true;
      }
    });
  }
}
