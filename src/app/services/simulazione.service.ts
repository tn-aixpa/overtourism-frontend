import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Simulazione } from '../models/simulazione.model';

@Injectable({
  providedIn: 'root'
})
export class SimulazioneService {
  constructor(private http: HttpClient) {}

  // TODO che manca l'api
  // getSimulations(): Observable<Simulazione[]> {
  //   return this.http.get<Simulazione[]>('/api/simulaziones');
  // }

  // Mock temporaneo
  getSimulations(): Observable<Simulazione[]> {
    const mockData: Simulazione[] = [
      { id: '1', name: 'simulazione Alpha', description: 'Prima simulazione ' },
      { id: '2', name: 'simulazione Beta', description: 'Seconda simulazione' }
    ];
    return of(mockData);
  }
}
