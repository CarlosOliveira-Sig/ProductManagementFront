import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrl: './app.css'
})
export class App {
  title = 'produto-management';
}
