import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private injector: Injector,
    private zone: NgZone
  ) {}

  handleError(error: any): void {
    console.error('Unhandled runtime error:', error);

    const unwrapped = error?.rejection || error;
    if (unwrapped instanceof HttpErrorResponse) {
      return;
    }

    this.zone.run(() => {
      const notificationService = this.injector.get(NotificationService);
      const translateService = this.injector.get(TranslateService);

      const message = translateService.instant('errors.clientError') || 'Si è verificato un errore nell\'applicazione.';
      notificationService.showError(message);
    });
  }
}