import { Component } from '@angular/core';
import { Authbutton } from '../authbutton/authbutton';
import { Authuser } from '../authuser/authuser';

@Component({
  selector: 'app-home',
  imports: [Authbutton, Authuser],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
