import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Problem, ProblemResponse } from '../models/problem.model';
import { ConfigService } from './config.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = environment.apiBaseUrl;
  }

  /** GET all problems */
  getProblems(): Observable<Problem[]> {
    return this.http.get<ProblemResponse>(`${this.baseUrl}/problems`).pipe(
      map(response =>
        response.data?.map(problem => ({
          problem_id: problem.problem_id,
          problem_name: problem.problem_name,
          problem_description: problem.problem_description,
          updated: problem.updated ? new Date(problem.updated) : undefined,
          created: problem.created ? new Date(problem.created) : undefined,
          objective: problem.objective,
          category: problem.category ?? [],
          links: problem.links ?? [],
          proposals: problem.proposals ?? []
        }))
      )
    );
  }

  /** POST create new problem */
  createProblem(problem: {
    problem_name: string;
    problem_description: string;
    created?: string;
    updated?: string;
    objective?: string;
    category?: string[];
    links?: string[];
    proposals?: any[];
  }): Observable<Problem> {
    return this.http.post<Problem>(`${this.baseUrl}/problems`, problem);
  }

  /** GET single problem by ID */
  getProblemById(problemId: string): Observable<Problem> {
    return this.http.get<Problem>(`${this.baseUrl}/problems/${problemId}`);
  }

  /** DELETE problem by ID */
  deleteProblem(problemId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/problems/${problemId}`);
  }

  /** PUT refresh problems */
  refreshProblems(): Observable<any> {
    return this.http.put(`${this.baseUrl}/problems/refresh`, {});
  }
}
