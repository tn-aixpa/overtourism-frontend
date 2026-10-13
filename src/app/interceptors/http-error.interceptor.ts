import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { NotificationService } from '../services/notifications.service';
import { AuthenticationService } from '../services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
export const SKIP_ERROR_NOTIFICATION = new HttpContextToken<boolean>(() => false);

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private translate: TranslateService

  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      timeout(60000),
      catchError((error: any) => {
        const skipNotification = req.context.get(SKIP_ERROR_NOTIFICATION);

        if (error instanceof TimeoutError) {
          if (!skipNotification) {
            this.notificationService.showError(this.translate.instant('errors.timeout'));
          }
        } else if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 0:
              if (!skipNotification) {
                this.notificationService.showError(this.translate.instant('errors.unreachable'));
              }
              break;
            case 401:
              if (!skipNotification) {
                this.notificationService.showError(this.translate.instant('errors.sessionExpired'));
              }
              this.authService.forceLocalLogout();
              break;
            case 403:
              // Gestito da AuthInterceptor / AuthenticationService
              break;
            case 404:
              if (!skipNotification) {
                this.notificationService.showError(this.translate.instant('errors.notFound'));
              }
              break;
            case 500:
              if (!skipNotification) {
                this.notificationService.showError(this.translate.instant('errors.serverError'));
              }
              break;
            default:
              if (!skipNotification) {
                const message = error.error?.message || error.error?.detail || this.translate.instant('errors.generic');
                this.notificationService.showError(message);
              }
          }
        }

        // Rilancia l'errore per preservare la catena di gestione del chiamante
        return throwError(() => error);
      })
    );
  }
}