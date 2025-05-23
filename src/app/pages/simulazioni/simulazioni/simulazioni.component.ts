import { Component } from '@angular/core';
import { Simulazione } from '../../../models/simulazione.model';
import { SimulazioneService } from '../../../services/simulazione.service';

@Component({
  selector: 'app-simulazioni',
  standalone: false,
  templateUrl: './simulazioni.component.html',
  styleUrl: './simulazioni.component.scss'
})
export class SimulazioniComponent {
  simulazioni: Simulazione[] = [];
  loading = true;

  constructor(private simulazioneService: SimulazioneService) {}

  ngOnInit(): void {
    this.loadSimulations();
  }

  loadSimulations(): void {
    this.loading = true;
    this.simulazioneService.getSimulations().subscribe({
      next: (data) => {
        this.simulazioni = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento simulazioni', err);
        this.loading = false;
      }
    });
  }
}
