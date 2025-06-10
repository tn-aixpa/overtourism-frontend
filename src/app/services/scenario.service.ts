import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scenario } from '../models/scenario.model';
import { Observable, of, BehaviorSubject, map } from 'rxjs';
import dataExample from '../../assets/dataExample.json';
import { ConfigService } from './config.service';
interface ScenarioResponse {
  scenarios: Array<{
    problem_id: string;
    scenario_id: string;
    scenario_name: string;
    scenario_description: string;
  }>;
}
export interface Widget {
  index_id: string;
  index_name: string;
  group: string;
  editable: boolean;
  description?: string;
  min: number;
  max: number;
  step: number;
  v?: number;
  loc?: number;
}
@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  private baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // getScenario(id: string): Observable<Scenario> {
  //   return this.http.get<Scenario>(`${this.baseUrl}/v1/models/${id}/data`);
  // }
  getScenarioData(scenarioId: string, problemId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/scenarios/${scenarioId}`,{
      params: { problem_id: problemId }
    });
  }
  deleteScenario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/scenarios/${id}`);
  }
  getScenariosByProblemId(problemId: string): Observable<Scenario[]> {
    return this.http
      .get<ScenarioResponse>(`${this.baseUrl}/problems/${problemId}`)
      .pipe(
        map(response => response.scenarios.map(scenario => ({
          id: scenario.scenario_id,
          name: scenario.scenario_name,
          description: scenario.scenario_description,
          problemId: scenario.problem_id
        })))
      );
  }
  
  getWidgets(): Observable<Record<string, Widget[]>> {
    return this.http.get<{ widgets: Record<string, Widget[]> }>(
      `${this.baseUrl}/widgets`
    ).pipe(map(res => res.widgets));
  }
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


}
