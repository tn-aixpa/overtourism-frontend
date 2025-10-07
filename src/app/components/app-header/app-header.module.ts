import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './app-header.component';
import { DesignAngularKitModule } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';
import {  RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppHeaderComponent],
  imports: [CommonModule, DesignAngularKitModule,TranslateModule.forRoot(),
    RouterModule
  ],
  exports: [AppHeaderComponent]
})
export class AppHeaderModule {}