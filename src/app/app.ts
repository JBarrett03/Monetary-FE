import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import userData from '../assets/users.json';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  ngOnInit() {

    console.log(userData);
    
  }
}
