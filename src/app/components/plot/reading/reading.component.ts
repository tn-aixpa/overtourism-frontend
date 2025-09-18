import { Component, Input } from '@angular/core';
import { Widget } from '../../../services/scenario.service';
import { ExplanationService } from '../../../services/explanation.service';
import { DataFact } from '../../../models/data-fact.model';

@Component({
  selector: 'app-reading',
  standalone: false,
  templateUrl: './reading.component.html',
  styleUrl: './reading.component.scss'
})
export class ReadingComponent {
  @Input() widgets!: Record<string, Widget[]>;
  @Input() indexDiffs!: Record<string, any>;
  @Input() originalIndexDiffs!: Record<string, any>;
  @Input() dataFacts: DataFact[] = [];
  categories = ['parcheggi', 'spiaggia', 'alberghi', 'ristoranti'];
  selectedCategory = 'all';
  dataFactsParametersChanges: DataFact[] = [];
  
  constructor(private explanationService: ExplanationService) {}
  ngOnInit() {
    if (this.dataFacts.length > 0) {
      // Initialize with data from input
      this.dataFactsParametersChanges = this.createParameterChanges();
    }
  }
  getLocallyChangedKeys(): string[] {
    if (!this.indexDiffs || !this.originalIndexDiffs) return [];
    return Object.keys(this.indexDiffs).filter(key => 
      String(this.indexDiffs[key]) !== String(this.originalIndexDiffs[key])
    );
  }

  getIndexNameFromKey(key: string): string {
    if (!this.widgets) return key;
    
    for (const group of Object.values(this.widgets)) {
      const widget = group.find(w => w.index_id === key);
      if (widget) {
        return widget.index_name || key;
      }
    }
    return key;
  }
  private createParameterChanges(): DataFact[] {
    return Object.entries(this.indexDiffs)
      .filter(([key]) => this.getLocallyChangedKeys().includes(key))
      .map(([key, value]) => ({
        category: key,
        parameter: this.getIndexNameFromKey(key),
        original_value: this.originalIndexDiffs[key],
        new_value: value,
        violations_percentage: 0,
        uncertainty: 0
      }));
  }
  getChangedKeys(): string[] {
    return Object.keys(this.indexDiffs).filter(
      key => String(this.indexDiffs[key]) !== String(this.originalIndexDiffs[key])
    );
  }
  getGlobalIndexExplanation(): string {
    return this.explanationService.explainGlobalIndex(this.dataFacts, this.selectedCategory);
  }

  getIndexesListExplanation(): string {
    return this.explanationService.explainIndexesList(this.dataFacts, this.categories);
  }

  getUncertaintyExplanation(): string {
    return this.explanationService.explainUncertainty();
  }

  getParametersChangesExplanation(): string {
    return this.explanationService.explainParametersChanges(this.dataFactsParametersChanges);
  }
}
