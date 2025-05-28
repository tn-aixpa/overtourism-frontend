import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  sidebarCollapsed = false;
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  isMobile = false;

ngOnInit() {
  this.isMobile = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    this.isMobile = window.innerWidth < 768;
  });
}
}

