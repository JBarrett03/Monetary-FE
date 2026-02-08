import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * The Navigation component is responsible for rendering the navigation bar of the application. It includes links to different routes and is displayed on all pages.
 */
@Component({
  selector: 'app-navigation',
  imports: [RouterModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})

/**
 * The Navigation class defines the component logic for the navigation bar. Currently, it does not contain any properties or methods, but it can be extended in the future to include additional functionality such as handling user authentication state or dynamic menu items.
 */
export class Navigation {

}
