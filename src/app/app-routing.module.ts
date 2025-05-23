import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PreferitiComponent } from './pages/simulazioni/preferiti/preferiti.component';
import { ScenariComponent } from './pages/simulazioni/scenari/scenari.component';
import { SimulazioniComponent } from './pages/simulazioni/simulazioni/simulazioni.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ScenarioDetailComponent } from './pages/simulazioni/scenario-detail/scenario-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'simulazioni', component: SimulazioniComponent },
  { path: 'simulazioni/:simulationId/scenari', component: ScenariComponent },
  { path: 'simulazioni/:simulationId/scenari/:scenarioId', component: ScenarioDetailComponent },
  { path: 'simulazioni/preferiti', component: PreferitiComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
