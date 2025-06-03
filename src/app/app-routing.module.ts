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
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' } },
  { 
    path: 'simulazioni', 
    data: { breadcrumb: 'Simulazioni' },
    children: [
      { 
        path: '', 
        component: SimulazioniComponent 
      },
      {
        path: ':simulationId/scenari',
        data: { breadcrumb: 'Scenari' },
        children: [
          {
            path: '',
            component: ScenariComponent
          },
          {
            path: ':scenarioId',
            component: ScenarioDetailComponent,
            data: { breadcrumb: 'Dettaglio scenario' }
          }
        ]
      },
      {
        path: 'preferiti',
        component: PreferitiComponent,
        data: { breadcrumb: 'Preferiti' }
      }
    ]
  },
  { path: 'faqs', component: FaqsComponent, data: { breadcrumb: 'FAQ' } },
  { path: 'terms', component: TermsComponent, data: { breadcrumb: 'Termini di utilizzo' } },
  { path: 'settings', component: SettingsComponent, data: { breadcrumb: 'Impostazioni' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
