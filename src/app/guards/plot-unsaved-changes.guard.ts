import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { PlotComponent } from '../components/plot/plot.component';

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard implements CanDeactivate<PlotComponent> {
  canDeactivate(component: PlotComponent): Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}
