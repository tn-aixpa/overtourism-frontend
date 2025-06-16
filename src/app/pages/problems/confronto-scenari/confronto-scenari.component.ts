
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Plotly from 'plotly.js-dist-min';
import { KPIs, PlotInput } from '../../../models/plot.model';
import { PlotService } from '../../../services/plot.service';
import { ScenarioService } from '../../../services/scenario.service';


@Component({
  selector: 'app-confronto-scenari',
  templateUrl: './confronto-scenari.component.html',
  styleUrls: ['./confronto-scenari.component.scss'],
  standalone: false
})
export class ConfrontoScenariComponent {
  scenari: any[] = [];
  selectedScenario1Id!: string;
  selectedScenario2Id!: string;
  problemId!: string;

  kpisLeft?: KPIs;
  kpisRight?: KPIs;

  @ViewChild('chartLeft', { static: true }) chartLeft!: ElementRef<HTMLElement>;
  @ViewChild('chartRight', { static: true }) chartRight!: ElementRef<HTMLElement>;

  constructor(
    private scenarioService: ScenarioService,
    private plotService: PlotService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.problemId = this.scenarioService.getCurrentProblemId(); // O altro metodo
    this.problemId = this.route.snapshot.paramMap.get('problemId')!;

    this.scenarioService.getScenariosByProblemId(this.problemId).subscribe(scenari => {
      this.scenari = scenari;
      if (scenari.length >= 2) {
        this.selectedScenario1Id = scenari[0].id;
        this.selectedScenario2Id = scenari[1].id;
        this.loadScenario(1);
        this.loadScenario(2);
      }
    });
  }

  async loadScenario(slot: 1 | 2) {
    const id = slot === 1 ? this.selectedScenario1Id : this.selectedScenario2Id;
    if (!id) return;

    const res = await this.scenarioService.getScenarioData(id, this.problemId).toPromise();
    const input = this.plotService.preparePlotInput(res.data);

    if (slot === 1) {
      this.kpisLeft = input.kpis;
      this.renderChart(this.chartLeft.nativeElement, input);
    } else {
      this.kpisRight = input.kpis;
      this.renderChart(this.chartRight.nativeElement, input);
    }
  }

  renderChart(container: HTMLElement, input: PlotInput) {
    const data: Partial<Plotly.PlotData>[] = input.curves.map(c => ({
      x: c.x,
      y: c.y,
      type: 'scatter',
      mode: 'lines',
      name: c.name,
      line: { color: c.color ?? 'black', dash: c.dash ?? 'solid', width: 3 }
    }));

    const layout: Partial<Plotly.Layout> = {
      margin: { t: 30, l: 50, r: 30, b: 50 },
      xaxis: { title: { text: 'Turisti' } },
      yaxis: { title: { text: 'Escursionisti'}},
      title: { text: '' },
      showlegend: true
    };

    Plotly.newPlot(container, data, layout, { responsive: true });
  }

  formatNumber(value: number): string {
    return value.toFixed(2);
  }
}
