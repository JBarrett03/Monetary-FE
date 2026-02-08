import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../services/user-data';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

  user_list: any =[];

  constructor(private userData: UserData, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user_list = this.userData.getUser(this.route.snapshot.paramMap.get('id'));
  }
}
