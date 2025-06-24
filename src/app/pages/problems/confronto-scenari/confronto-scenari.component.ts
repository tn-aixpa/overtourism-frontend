import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Plotly from 'plotly.js-dist-min';
import { KPIs, PlotInput, Curve } from '../../../models/plot.model';
import { PlotService } from '../../../services/plot.service';
import { ScenarioService } from '../../../services/scenario.service';
import {
  SUBSYSTEM_OPTIONS
} from '../../../components/plot/plot.config';

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
  selectedControlOption!: string;

  kpisLeft?: KPIs;
  kpisRight?: KPIs;
  monoDimensionale = false;
  showAllSubsystems = true;
  sottosistemi = SUBSYSTEM_OPTIONS;
  sottosistemaSelezionato = 'default';

  @ViewChild('chartLeft', { static: true }) chartLeft!: ElementRef<HTMLElement>;
  @ViewChild('chartRight', { static: true }) chartRight!: ElementRef<HTMLElement>;
  showControls: boolean = false; // per 'settings'

  constructor(
    private scenarioService: ScenarioService,
    private plotService: PlotService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.problemId = this.route.snapshot.paramMap.get('problemId')!;


    this.scenarioService.getScenariosByProblemId(this.problemId).subscribe(scenari => {
      this.scenari = scenari;
      if (scenari.length >= 2) {
        this.selectedScenario1Id = this.route.snapshot.paramMap.get('id1')!;
        const id2 = this.route.snapshot.paramMap.get('id2');
        this.selectedScenario2Id = id2 && id2 !== 'default' ? id2 : '';
        this.loadScenario(1);
        this.loadScenario(2);
      }
    });
  }
  getScenarioName(id: string | undefined): string | undefined {
    return this.scenari.find(s => s.id === id)?.name;
  }

  selectScenario(slot: 1 | 2, id: string): void {
    if (slot === 1) {
      this.selectedScenario1Id = id;
      this.loadScenario(1);
    } else {
      this.selectedScenario2Id = id;
      this.loadScenario(2);
    }
  }

  onPlotControlChange(value: string) {
    this.selectedControlOption = value;
    this.renderBoth()
  }

  onShowAllSubsystemsChange(value: boolean) {
    this.showAllSubsystems = value;
    this.renderBoth();
  }



  onMonoDimensionaleChange(value: boolean) {
    this.monoDimensionale = value;
    this.renderBoth();
  }

  onSottosistemaSelezionatoChange(value: string) {
    this.sottosistemaSelezionato = value;
    this.renderBoth();
  }

  onFunzioneChange() {
    this.renderBoth();
  }


  toggleControls(): void {
    this.showControls = !this.showControls;
  }
  renderBoth() {
    this.loadScenario(1);
    this.loadScenario(2);
  }

  async loadScenario(slot: 1 | 2) {
    const id = slot === 1 ? this.selectedScenario1Id : this.selectedScenario2Id;
    if (!id) return;

    const res = await this.scenarioService.getScenarioData(id, this.problemId).toPromise();
    const input = this.plotService.preparePlotInput(res.data);

    const container = slot === 1 ? this.chartLeft.nativeElement : this.chartRight.nativeElement;
    if (slot === 1) this.kpisLeft = input.kpis;
    else this.kpisRight = input.kpis;

    this.renderChart(container, input);
  }

  renderChart(container: HTMLElement, input: PlotInput) {
    const cloned = JSON.parse(JSON.stringify(input)) as PlotInput;

    // === MONODIMENSIONALE ===
    if (this.monoDimensionale) {
      this.plotService.renderMonoDimensionale(
        this.sottosistemaSelezionato,
        container,
        cloned
      );
      return;
    }
    this.plotService.renderBidimensionale(
      this.sottosistemaSelezionato,
      container,
      cloned
    );

  }
  onScenarioSelect(slot: 1 | 2, selectedId: string) {
    if (slot === 1) {
      this.selectedScenario1Id = selectedId;
    } else {
      this.selectedScenario2Id = selectedId;
    }
    this.loadScenario(slot);
  }

  getCapacityLabel(subsystem: string): string {
    return subsystem === 'default' ? 'Soglia di sovraffollamento' : 'Capacità di carico';
  }


  formatNumber(value: number): string {
    return value.toFixed(2);
  }
}
