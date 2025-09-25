// toast.component.ts
import { Component } from '@angular/core';
import { NotificationService } from '../../services/notifications.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: false,
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  notification$: Observable<any>;

  constructor(private notificationService: NotificationService) {
    this.notification$ = this.notificationService.notification$;
  }

  clear() {
    this.notificationService.clear();
  }
}
