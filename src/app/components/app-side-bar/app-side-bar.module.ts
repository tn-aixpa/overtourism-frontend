import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSideBarComponent } from './app-side-bar.component';
import { DesignAngularKitModule } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AppSideBarComponent],
  imports: [CommonModule, DesignAngularKitModule,TranslateModule.forRoot(),],
  exports: [AppSideBarComponent]
})
export class AppSideBarModule {}