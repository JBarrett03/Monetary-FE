import { Component } from '@angular/core';
import { Authbutton } from '../authbutton/authbutton';
import { Authuser } from '../authuser/authuser';

/**
 * The Home component serves as the main landing page of the application. It includes the Authbutton and Authuser components, which provide authentication functionality and display user information, respectively. The Home component is responsible for rendering the home page template and applying the associated styles.
 */
@Component({
  selector: 'app-home',
  imports: [Authbutton, Authuser],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

/**
 * The Home class defines the component logic for the home page. It does not contain any specific logic or properties, as its primary purpose is to serve as a container for the Authbutton and Authuser components and to render the home page template.
 */
export class Home {

}
