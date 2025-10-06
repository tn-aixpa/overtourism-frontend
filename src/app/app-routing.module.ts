import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { PreferitiComponent } from './pages/problems/preferiti/preferiti.component';
import { ScenariComponent } from './pages/problems/scenari/scenari.component';
import { ProblemsComponent } from './pages/problems/problems/problems.component';
import { ScenarioDetailComponent } from './pages/problems/scenario-detail/scenario-detail.component';
import { ConfrontoScenariComponent } from './pages/problems/confronto-scenari/confronto-scenari.component';
import { ProblemCreateComponent } from './pages/problems/problem-create/problem-create.component';
import { UnsavedChangesGuard } from './guards/plot-unsaved-changes.guard';
import { ProblemDetailComponent } from './pages/problems/problem-detail/problem-detail.component';
import { CapacityComponent } from './pages/overtourism/capacity/capacity.component';
import { FlowsComponent } from './pages/overtourism/flows/flows.component';
import { HiddenComponent } from './pages/overtourism/hidden/hidden.component';
import { RedistributionComponent } from './pages/overtourism/redistribution/redistribution.component';
import { OvertourismComponent } from './pages/overtourism/overtourism/overtourism.component';

const routes: Routes = [
  { path: '', redirectTo: 'problems', pathMatch: 'full' },
  {
    path: 'problems',
    data: { breadcrumb: 'Problemi' },
    children: [
      {
        path: '',
        component: ProblemsComponent
      },
      { path: 'create', component: ProblemCreateComponent }, 
      { path: ':problemId', component: ProblemDetailComponent },
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
            canDeactivate: [UnsavedChangesGuard],
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
  { path: 'capacity', component: CapacityComponent },
  { path: 'overtourism', component: OvertourismComponent },
  { path: 'flows', component: FlowsComponent },
  { path: 'redistribution', component: RedistributionComponent },
  { path: 'hidden', component: HiddenComponent },
  { path: 'faqs', component: FaqsComponent, data: { breadcrumb: 'FAQ' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
