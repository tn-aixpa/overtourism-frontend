import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlotService } from '../../../services/plot.service';

@Component({
  selector: 'app-scenario-detail',
  standalone: false,
  templateUrl: './scenario-detail.component.html',
  styleUrl: './scenario-detail.component.scss'
})
export class ScenarioDetailComponent  {
  @ViewChild('plotContainer') plotContainer!: ElementRef<HTMLDivElement>;

  scenarioId!: string;
  problemId!: string;
  // isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private plotService: PlotService
  ) {}

  ngOnInit(): void {
    this.problemId = this.route.snapshot.paramMap.get('problemId')!;
    this.scenarioId = this.route.snapshot.paramMap.get('scenarioId')!;
  }

}
