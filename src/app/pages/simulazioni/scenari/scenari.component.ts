import { Component } from '@angular/core';
import { ScenarioService } from '../../../services/scenario.service';
import { Scenario } from '../../../models/scenario.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scenari',
  standalone: false,
  templateUrl: './scenari.component.html',
  styleUrl: './scenari.component.scss'
})
export class ScenariComponent {
  scenari: Scenario[] = [];
  loading = true;
  simulationId: any;

  constructor(private scenarioService: ScenarioService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.simulationId = this.route.snapshot.paramMap.get('simulationId')!;

    this.loadScenarios();
  }

  loadScenarios(): void {
    this.loading = true;
    this.scenarioService.getScenarios().subscribe({
      next: (data) => {
        this.scenari = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento scenari', err);
        this.loading = false;
      }
    });
  }
}
