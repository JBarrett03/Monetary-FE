import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule, CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userId');
  }

  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }
}
