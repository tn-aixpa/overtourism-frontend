import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scenario } from '../models/scenario.model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import dataExample from '../../assets/dataExample.json';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  constructor(private http: HttpClient) {}

  private dataUrl = 'assets/dataExample.json';

  private currentScenarioSubject = new BehaviorSubject<any>(null);
  public currentScenario$ = this.currentScenarioSubject.asObservable();

  get currentScenario(): any {
    return this.currentScenarioSubject.value;
  }

  async fetchScenarioData(): Promise<any> {
    const scenarioData = dataExample; 
    this.currentScenarioSubject.next(scenarioData);
    return scenarioData;
  }

  // Mock temporaneo
  getScenarios(): Observable<Scenario[]> {
    const mockData: Scenario[] = [
      { id: '1', name: 'Scenario Alpha', description: 'Primo scenario simulato' },
      { id: '2', name: 'Scenario Beta', description: 'Secondo scenario simulato' }
    ];
    return of(mockData);
  }
}
