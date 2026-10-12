import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../core/config/app-config.model';
import {
  IndicatorMeta, Comune,
  IndexDataResponse, VariationDataResponse, VariationOverTimeResponse,
  AdditionalLabelMeta
} from '../models/indici.model';

@Injectable({ providedIn: 'root' })
export class IndiciService {

  // prefisso fisso con /default/indexes
  private readonly base: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.base = `${config.apiBaseUrl}/default/indexes`;
  }

  getIndicatorList(): Observable<{ indicators: IndicatorMeta[]; additional_labels?: AdditionalLabelMeta[] }> {
    return this.http.get<{ indicators: IndicatorMeta[]; additional_labels?: AdditionalLabelMeta[] }>(`${this.base}/get-index-list`);
  }

  getSpatialAreas(): Observable<{ comuni: Comune[], areas: Comune[] }> {
    return this.http.get<{ comuni: Comune[], areas: Comune[] }>(`${this.base}/get-spatial-areas`);
  }

  getIndexData(
    index: string,
    startDate?: string,
    endDate?: string,
    seasonality?: string,
    spatialGranularity = 'comune',
    indicator?: string,           
    startDateComparison?: string,  
    endDateComparison?: string,
  ): Observable<IndexDataResponse> {
    let params = new HttpParams()
      .set('index', index)
      .set('spatial_granularity', spatialGranularity);
    if (startDate)            params = params.set('start_date', startDate);
    if (endDate)              params = params.set('end_date', endDate);
    if (seasonality)          params = params.set('seasonality', seasonality);
    if (indicator)            params = params.set('indicator', indicator);
    if (startDateComparison)  params = params.set('start_date_comparison', startDateComparison);
    if (endDateComparison)    params = params.set('end_date_comparison', endDateComparison);

    return this.http.get<IndexDataResponse>(`${this.base}/get_index_data`, { params });
  }

  getVariationData(
    index: string,
    startDate: string,
    endDate: string,
    granularity: string,
    spatialGranularity = 'comune'
  ): Observable<VariationDataResponse> {
    const params = new HttpParams()
      .set('index', index)
      .set('start_date', startDate)
      .set('end_date', endDate)
      .set('granularity', granularity)
      .set('spatial_granularity', spatialGranularity);
    return this.http.get<VariationDataResponse>(`${this.base}/get-variation-data`, { params });
  }
}