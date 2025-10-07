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
    { label: 'Problemi', route: '/problems' },
    { label: 'Indici di Capacità', route: '/capacity' },
    { label: 'Livello di Affollamento', route: '/overtourism' },
    { label: 'Flussi', route: '/flows' },
    { label: 'Ridistribuzione dei turisti', route: '/redistribution' },
    { label: 'Turismo Sommerso', route: '/hidden' },
  ];

  isActive(link: any): boolean {
    if (link.route === '/problems') {
      return this.router.url.startsWith('/problems');
    }
    return this.router.url === link.route;
  }
}
