import { Component } from '@angular/core';
import { ConfigService } from '../../core/config/config.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
})
export class AppFooterComponent {
  constructor(public configService: ConfigService) {}

  get versionInfo() {
    return this.configService.versionInfo;
  }
}