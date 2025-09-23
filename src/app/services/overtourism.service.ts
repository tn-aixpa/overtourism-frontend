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

  getMap(): Observable<any> {
    return this.http.get(`${this.baseUrl}/data/overtourism/map`); 
  }

  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/data/overtourism/data`);
  }
}
