import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlotService } from '../../../services/plot.service';
import { renderFunctionPlot, PlotInput } from '../../../models/plot.model';

@Component({
  selector: 'app-scenario-detail',
  standalone: false,
  templateUrl: './scenario-detail.component.html',
  styleUrl: './scenario-detail.component.scss'
})
export class ScenarioDetailComponent implements AfterViewInit {
  @ViewChild('plotContainer') plotContainer!: ElementRef<HTMLDivElement>;

  scenarioId!: string;
  simulationId!: string;

  constructor(
    private route: ActivatedRoute,
    private plotService: PlotService
  ) {}

  ngOnInit(): void {
    this.simulationId = this.route.snapshot.paramMap.get('simulationId')!;
    this.scenarioId = this.route.snapshot.paramMap.get('scenarioId')!;
  }

  async ngAfterViewInit(): Promise<void> {
    // try {
    //   const plotData: PlotInput = await this.plotService.fetchPlotData();
    //   renderFunctionPlot(this.plotContainer.nativeElement, plotData);
    // } catch (error) {
    //   console.error('Errore nel caricamento dei dati del plot:', error);
    // }
  }
}
