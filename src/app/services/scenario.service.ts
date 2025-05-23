import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scenario } from '../models/scenario.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  constructor(private http: HttpClient) {}
  private dataUrl = 'assets/dataExample.json';

  // TODO che manca l'api
  // getScenarios(): Observable<Scenario[]> {
  //   return this.http.get<Scenario[]>('/api/scenarios');
  // }

  // Mock temporaneo
  getScenarios(): Observable<Scenario[]> {
    const mockData: Scenario[] = [
      { id: '1', name: 'Scenario Alpha', description: 'Primo scenario simulato' },
      { id: '2', name: 'Scenario Beta', description: 'Secondo scenario simulato' }
    ];
    return of(mockData);
  }

}
