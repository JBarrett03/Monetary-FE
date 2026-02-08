import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Navigation component for the application.
 */
@Component({
  selector: 'app-navigation',
  imports: [RouterModule, CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})

/**
 * Navigation class handles the navigation logic of the application.
 */
export class Navigation {

  /**
   * Current user ID
   */
  userId: string | null = null;

  /**
   * Creates an instance of Navigation.
   */
  constructor() {}

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');
  }

}
