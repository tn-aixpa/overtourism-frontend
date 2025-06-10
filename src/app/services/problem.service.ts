import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Problem } from '../models/problem.model';
import { ConfigService } from './config.service';
interface ProblemResponse {
  problems: Array<{
    problem_id: string;
    problem_name: string;
    problem_description: string;
  }>;
}
@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private baseUrl: string;
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  getProblems(): Observable<Problem[]> {
    return this.http
      .get<ProblemResponse>(`${this.baseUrl}/problems`)
      .pipe(
        map(response => response.problems.map(problem => ({
          id: problem.problem_id,
          name: problem.problem_name,
          description: problem.problem_description
        })))
      );
  }


}
