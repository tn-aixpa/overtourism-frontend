import { Component } from '@angular/core';
import { NotificationService } from './services/notifications.service';
import { Observable } from 'rxjs';

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
  errorMessage$: Observable<string | null>;
  successMessage$: Observable<string | null>;

  constructor( public notificationService: NotificationService) {
    this.errorMessage$ = this.notificationService.error$;
    this.successMessage$ = this.notificationService.success$;
  }

ngOnInit() {
  this.isMobile = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    this.isMobile = window.innerWidth < 768;
  });
}
}

