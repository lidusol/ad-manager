import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry, map } from 'rxjs/operators'

import { Campaign, Adset, Ad } from '../models/facebook.models'
import { ADAFRI_BUSINESS_ID } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  apiUrl: string = 'http://localhost:7100'
  fbGraphUrl: string = 'https://graph.facebook.com/v11.0'

  constructor(private http: HttpClient) { }

  public createCampaign(campaign: Campaign): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/fb-campaign`, campaign).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public getCampaigns() {
    return this.http.get<any>(`${this.apiUrl}/fb-campaign`).pipe(
      retry(1),
        catchError((e) => throwError(e))
    )
  }

  public getCampaignById(id: string){
    return this.http.get<Campaign>(`${this.apiUrl}/fb-campaign/${id}`).pipe(
      retry(1),
        catchError((e) => throwError(e))
    )
  }

  public createAdset(adset: Adset): Observable<Adset>{
    return this.http.post<Adset>(`${this.apiUrl}/fb-adset`, adset).pipe(
      retry(1),
        catchError((e) => throwError(e))
    )
  }

  public getAdsets(){
    return this.http.get<any>(`${this.apiUrl}/fb-adset`).pipe(
      retry(1),
        catchError((e) => throwError(e))
    )
  }

  public getClientPages(){
    return this.http.get<any>(`${this.fbGraphUrl}/${ADAFRI_BUSINESS_ID}/client_pages`).pipe(
      retry(1),
        catchError((e) => throwError(e))
    )
  }
}
