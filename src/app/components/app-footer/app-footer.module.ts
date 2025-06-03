import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFooterComponent } from './app-footer.component';
import { DesignAngularKitModule } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AppFooterComponent],
  imports: [CommonModule, DesignAngularKitModule,TranslateModule.forRoot(),
  ],
  exports: [AppFooterComponent]
})
export class AppFooterModule {}