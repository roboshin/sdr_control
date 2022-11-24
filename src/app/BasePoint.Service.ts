import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasePointService{
  baseApiUrlMaster = "/app/master";
  baseApiUrlMeasure = "/app/measure";
  baseApiUrlCal = "/app/calc";
  constructor(private http:HttpClient) {
  }

  /**
   * 計測基準を設定する
   * @param pname
   * @param x
   * @param y
   */
  setMasterPoint(pname:string, x:number, y:number): Observable<HttpEvent<any>> {
    let getUrl = `${this.baseApiUrlMaster}/${pname}/${x}/${y}`;
    console.log(getUrl);
    return this.http.put<any>(getUrl, {});
  }

  /**
   * 計測基準を取得する　ロボットからの取得
   * @param pname
   */
  getMasterPoint(pname:string): Observable<HttpEvent<any>> {
    let getUrl = `${this.baseApiUrlMaster}/${pname}`;
    console.log(getUrl);
    return this.http.get<any>(getUrl, {observe:'response'});
  }

  /**
   * 計測値を設定する
   * @param pname
   * @param x
   * @param y
   */
  setMeasurePoint(pname:string, x:number, y:number): Observable<HttpEvent<any>> {
    let getUrl = `${this.baseApiUrlMeasure}/${pname}/${x}/${y}`;
    console.log(getUrl);
    return this.http.put<any>(getUrl,{});
  }

  /**
   * 計測値を取得する　ロボットからの取得
   * @param pname
   */
  getMeasurePoint(pname:string): Observable<HttpEvent<any>> {
    let getUrl = `${this.baseApiUrlMeasure}/${pname}`;
    console.log(getUrl);
    return this.http.get<any>(getUrl,{observe:'response'});
  }

  /**
   * 計測結果、基準データから計算を開始する
   */
  setCalc(): Observable<HttpEvent<any>> {
    let getUrl = `${this.baseApiUrlMeasure}`;
    console.log(getUrl);
    return this.http.put<any>(getUrl,{});
  }

}
