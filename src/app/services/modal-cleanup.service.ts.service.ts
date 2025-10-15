import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ItModalComponent } from 'design-angular-kit'; 

@Injectable({ providedIn: 'root' })
export class ModalCleanupService {
  private openModals: ItModalComponent[] = [];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeAll();
      }
    });
  }

  register(modal: ItModalComponent) {
    if (!this.openModals.includes(modal)) {
      this.openModals.push(modal);
    }
  }

  unregister(modal: ItModalComponent) {
    this.openModals = this.openModals.filter(m => m !== modal);
  }

  closeAll() {
    this.openModals.forEach(m => m.hide());
    this.openModals = [];
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }
}
