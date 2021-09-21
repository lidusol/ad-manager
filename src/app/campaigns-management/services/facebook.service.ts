import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

import { Campaign, Adset, Creative, Ad } from '../models/facebook.models'
import { ADAFRI_BUSINESS_ID, FACEBOOK_ACCESS_TOKEN, AD_ACCOUNT_ID } from 'src/environments/environment'

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

  public deleteCampaign(id: string){
    return this.http.delete<Campaign>(`${this.apiUrl}/fb-campaign/${id}`).pipe(
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

  public getAdsetById(id: string){
    return this.http.get<Adset>(`${this.apiUrl}/fb-adset/${id}`).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public deleteAdset(id: string){
    return this.http.delete<Adset>(`${this.apiUrl}/fb-adset/${id}`).pipe(
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

  public getPageAccessToken(fbPageId: string){
    const params = new HttpParams()
     .set('fields', 'access_token')
     .set('access_token', FACEBOOK_ACCESS_TOKEN)
    return this.http.get<any>(`${this.fbGraphUrl}/${fbPageId}`, { params: params }).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public getConnectedInstagramAccount(fbPageId: string, accessToken: string){
    const params = new HttpParams()
      .set('access_token', accessToken)
      .set('fields', 'id, username, profile_pic')
    return this.http.get<any>(`${this.fbGraphUrl}/${fbPageId}/instagram_accounts`, { params: params }).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public uploadImage(imgData: FormData){
    return this.http.post<any>(`${this.fbGraphUrl}/${AD_ACCOUNT_ID}/adimages`, imgData).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public createCreative(creative: Creative){
    return this.http.post<Creative>(`${this.apiUrl}/fb-creative`, creative).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public getCreative(){
    return this.http.get<any>(`${this.apiUrl}/fb-creative`).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public createAd(ad: Ad){
    return this.http.post<Ad>(`${this.apiUrl}/fb-ad`, ad).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public getAds(){
    return this.http.get<any>(`${this.http}/fb-ad`).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public getAdById(id: string){
    return this.http.get<any>(`${this.http}/fb-ad/${id}`).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }

  public deleteAd(id: string){
    return this.http.delete<Ad>(`${this.apiUrl}/fb-ad/${id}`).pipe(
      retry(1),
      catchError((e) => throwError(e))
    )
  }
}
