import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './app-side-bar.component.html',
  styleUrl: './app-side-bar.component.scss',
  
})
export class AppSideBarComponent {
  @Input() collapsed = false;
  sidebarOpen = true;
  isSimulazioniOpen = false;

  constructor(public router: Router) {
    
  }
  isSimulazioniActive(): boolean {
    return this.router.url.startsWith('/simulazioni');
  }
}
