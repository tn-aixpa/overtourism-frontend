import { Injectable } from '@angular/core';
import { DataFact } from '../models/data-fact.model';

@Injectable({
  providedIn: 'root'
})
export class ExplanationService {
    explainGlobalIndex(dataFacts: DataFact[], catname: string): string {
    if (!catname || catname === 'all' || catname === 'overtourism_level') {
      const dataFact = dataFacts.find(d => d.category === 'all' || d.category === 'overtourism_level');
      if (dataFact) {
        return `Sulla base dei parametri di contesto utilizzati, il modello stima che, in media, nel ${Math.round(dataFact.violations_percentage)}% delle giornate si verifichi sovraffollamento, ovvero si presentino situazioni con valori superiori alla capacità di carico della destinazione. Il margine di incertezza della previsione è di ±${dataFact.uncertainty}%.`;
      }
    } else {
      const dataFact = dataFacts.find(d => d.category === catname);
      if (dataFact) {
        if (dataFact.violations_numerosity === 0) {
          return `Il modello stima che, in media, non vi siano giornate con un superamento della capacità del sottosistema ${catname}. Ciò significa che in nessuna giornata si verifica sovraffollamento dovuto alla saturazione del sottosistema ${catname}.`;
        } else {
          return `Il modello stima che, in media, nel ${dataFact.violations_percentage}% delle giornate si verifichi sovraffollamento, ovvero si presentino situazioni con valori superiori alla capacità del sottosistema ${catname}.`;
        }
      }
    }
    return '';
  }

  explainIndexesList(dataFacts: DataFact[], categories: string[]): string {
    let text = 'Esaminando i singoli sottosistemi, si osservano diversi livelli di saturazione';
    let mostCritical: string | null = null;
    let mostCriticalValue = 0;
    for (const cat of categories) {
      const dataFact = dataFacts.find(d => d.category === cat);
      if (dataFact) {
        if (dataFact.violations_percentage === 0) {
          text += `\n- ${cat}: nessun superamento rilevato`;
        } else if (dataFact.violations_percentage < 5) {
          text += `\n- ${cat}: solo ${dataFact.violations_percentage}% di giornate con superamento capacità (incertezza ±${dataFact.uncertainty})%`;
        } else {
          text += `\n- ${cat}: ${dataFact.violations_percentage}% di giornate con superamento capacità (incertezza ±${dataFact.uncertainty})%`;
        }
        if (dataFact.violations_percentage > mostCriticalValue) {
          mostCriticalValue = dataFact.violations_percentage;
          mostCritical = cat;
        }
      }
    }
    if (mostCritical) {
      text += `\n\n Il vincolo più critico è quello legato alla disponibilità di ${mostCritical}`;
    }
    return text;
  }

  explainUncertainty(): string {
    return `La previsione è caratterizzata da un margine di incertezza (evidenziato in giallo) che dipende da diversi fattori, quali (i) le assunzioni sul comportamento dei visitatori e su altri parametri dei fenomeni turistici, (ii) le approssimazioni dovute alla modellazione statistica. Per i punti colorati di giallo, la previsione è più incerta.`;
  }

  explainParametersChanges(dataFactsParametersChanges: DataFact[]): string {
    if (!dataFactsParametersChanges || dataFactsParametersChanges.length === 0) {
      return 'Il nuovo scenario è stato generato senza introdurre modifiche nei parametri di configurazione del modello rispetto allo scenario di partenza';
    } else {
      let explanation = 'Il nuovo scenario è stato generato in base ai seguenti cambiamenti di parametri: \n';
      for (const dataFact of dataFactsParametersChanges) {
        explanation += `\n\n- [sottosistema ${dataFact.category}] ${dataFact.parameter} \n-- valore di partenza: ${dataFact.original_value} \n-- nuovo valore: ${dataFact.new_value}`;
      }
      return explanation;
    }
  }
}