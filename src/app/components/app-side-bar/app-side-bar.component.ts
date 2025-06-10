import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './app-side-bar.component.html',
  styleUrl: './app-side-bar.component.scss',
  
})
export class AppSideBarComponent {

  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>(); 

  constructor(public router: Router) {}

  toggleSidebar() {
    this.toggle.emit();
  }

  isProblemsActive(): boolean {
    return this.router.url.startsWith('/problems');
  }
}
