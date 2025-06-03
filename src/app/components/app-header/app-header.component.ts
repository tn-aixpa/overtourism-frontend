import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  darkMode = false;
constructor(public router: Router) {
}
  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('it-dark-mode', this.darkMode);
  }
  links = [
    { label: 'Home', route: '/home' },
    { label: 'Simulazioni', route: '/simulazioni' },
    { label: 'FAQ', route: '/faqs' },
    { label: 'Terms', route: '/terms' },
    { label: 'Settings', route: '/settings' }
  ];

  isActive(link: any): boolean {
    if (link.route === '/simulazioni') {
      return this.router.url.startsWith('/simulazioni');
    }
    return this.router.url === link.route;
  }
}
