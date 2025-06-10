import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PreferitiComponent } from './pages/problems/preferiti/preferiti.component';
import { ScenariComponent } from './pages/problems/scenari/scenari.component';
import { ProblemsComponent } from './pages/problems/problems/problems.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ScenarioDetailComponent } from './pages/problems/scenario-detail/scenario-detail.component';
import { ConfrontoScenariComponent } from './pages/problems/confronto-scenari/confronto-scenari.component';

const routes: Routes = [
  { path: '', redirectTo: 'problems', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' } },
  {
    path: 'problems',
    data: { breadcrumb: 'Problemi' },
    children: [
      {
        path: '',
        component: ProblemsComponent
      },
      {
        path: ':problemId/scenari',
        data: { breadcrumb: 'Scenari' },
        children: [
          {
            path: '',
            component: ScenariComponent
          },
          {
            path: 'confronta/:id1/:id2',
              component: ConfrontoScenariComponent,
            data: { breadcrumb: 'Confronto scenari' }
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
  // { path: 'terms', component: TermsComponent, data: { breadcrumb: 'Termini di utilizzo' } },
  // { path: 'settings', component: SettingsComponent, data: { breadcrumb: 'Impostazioni' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
