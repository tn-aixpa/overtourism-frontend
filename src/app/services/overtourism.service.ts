import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class OvertourismService {
  private baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getIndexes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/data/overtourism/indexes/list`);
  }
  getIndexesByCategory(category: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/data/overtourism/indexes/list?category=${category}`);
  }
  // getMap(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/data/overtourism/map`);
  // }
  getMapByDataset(dataset: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/data/overtourism/indexes/map?map=${dataset}`);
  }

  getDataByDataset(dataset: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/data/overtourism/indexes/data?dataframe=${dataset}`);
  }
}

