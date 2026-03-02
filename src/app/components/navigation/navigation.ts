import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule, CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation implements OnInit {

  ngOnInit() {}

  get userId(): string | null {
    return sessionStorage.getItem('userId');
  }

  get isLoggedIn(): boolean {
    return !!this.userId;
  }
}
