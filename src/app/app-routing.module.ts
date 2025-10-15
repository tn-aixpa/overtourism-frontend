import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FaqsComponent } from './pages/faqs/faqs.component';
import { PreferitiComponent } from './pages/problems/preferiti/preferiti.component';
import { ProblemsComponent } from './pages/problems/problems/problems.component';
import { ProblemCreateComponent } from './pages/problems/problem-create/problem-create.component';
import { ProblemDetailComponent } from './pages/problems/problem-detail/problem-detail.component';
import { ProposalListPageComponent } from './pages/problems/proposal-list-page/proposal-list-page.component';
import { ProposalDetailPageComponent } from './pages/problems/proposal-detail-page/proposal-detail-page.component';
import { ScenariComponent } from './pages/problems/scenari/scenari.component';
import { ScenarioDetailComponent } from './pages/problems/scenario-detail/scenario-detail.component';
import { ConfrontoScenariComponent } from './pages/problems/confronto-scenari/confronto-scenari.component';

import { CapacityComponent } from './pages/overtourism/capacity/capacity.component';
import { FlowsComponent } from './pages/overtourism/flows/flows.component';
import { HiddenComponent } from './pages/overtourism/hidden/hidden.component';
import { RedistributionComponent } from './pages/overtourism/redistribution/redistribution.component';
import { OvertourismComponent } from './pages/overtourism/overtourism/overtourism.component';

import { UnsavedChangesGuard } from './guards/plot-unsaved-changes.guard';

const routes: Routes = [
  { path: '', redirectTo: 'problems', pathMatch: 'full' },

  {
    path: 'problems',
    data: { breadcrumb: 'Analisi' },
    children: [
      {
        path: '',
        component: ProblemsComponent
      },
      {
        path: 'create',
        component: ProblemCreateComponent,
        data: { breadcrumb: 'Nuova analisi' }
      },
      {
        path: ':problemId',
        component: ProblemDetailComponent,
        data: { 
          breadcrumb: 'Dettaglio analisi',
          breadcrumbUrl: '/problems/:problemId'
        }
      },
      {
        path: ':problemId/proposals',
        data: { breadcrumb: 'Proposte', breadcrumbUrl: '/problems/:problemId' },
        children: [
          {
            path: '',
            component: ProposalListPageComponent,
            data: { breadcrumb: 'Lista proposte', breadcrumbUrl: '/problems/:problemId/proposals' }
          },
          {
            path: ':proposalId',
            component: ProposalDetailPageComponent,
            data: { 
              breadcrumb: 'Dettaglio proposta',
              breadcrumbUrl: '/problems/:problemId/proposals/:proposalId'
            }
          },
          {
            path: ':proposalId/scenari',
            data: { 
              breadcrumb: 'Scenari',
              breadcrumbUrl: '/problems/:problemId/proposals/:proposalId'
            },
            children: [
              {
                path: '',
                component: ScenariComponent,
                data: { breadcrumb: 'Lista scenari', breadcrumbUrl: '/problems/:problemId/proposals/:proposalId/scenari' }
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
                data: { 
                  breadcrumb: 'Dettaglio scenario',
                  breadcrumbUrl: '/problems/:problemId/proposals/:proposalId/scenari/:scenarioId'
                }
              }
            ]
          }
        ]
      },
      {
        path: 'preferiti',
        component: PreferitiComponent,
        data: { breadcrumb: 'Preferiti', breadcrumbUrl: '/problems/preferiti' }
      }
    ]
  }
  ,

  // 🔹 Altre sezioni del portale
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
export class AppRoutingModule {}
