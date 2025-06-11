import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Scenario } from '../../../models/scenario.model';
import { ScenarioService } from '../../../services/scenario.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';


@Component({
  selector: 'app-confronto-scenari',
  templateUrl: './confronto-scenari.component.html',
  standalone: false,
  styleUrls: ['./confronto-scenari.component.scss']
})
export class ConfrontoScenariComponent implements OnInit {
  scenario1: Scenario | undefined;
  scenario2: Scenario | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private scenarioService: ScenarioService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.scenario1={
      id: "1",
      name: 'Scenario parcheggi +200',
      description: 'Aumento numero di parcheggi'
    };
    
    this.scenario2={
      id: "2",
      name: 'Scenarui flusso +200 nel weekend',
      description: 'Aumento flusso di visitatori nel weekend'
    };
    this.loading = false;
    const id1 = this.route.snapshot.paramMap.get('id1');
    const id2 = this.route.snapshot.paramMap.get('id2');
  
    if (id2 === 'default') {
      // gestisci il caso di confronto con uno scenario solo
      // il default e' altro
    }
  }
}
