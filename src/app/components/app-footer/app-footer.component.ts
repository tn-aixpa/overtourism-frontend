import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
})
export class AppFooterComponent {
  readonly versionInfo = (environment as any).version || {
    version: 'dev',
    releaseUrl: 'https://github.com/tn-aixpa/overtourism-frontend'
  };
}