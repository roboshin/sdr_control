import {catchError, observable, Observable, throwError} from 'rxjs';
import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DxfChartDatas} from "./draw-point-data";
import * as http from "http";
import {DrawAreaPolygon} from "./draw-area-polygon";

@Injectable({
  providedIn: 'root'
})
export class BasePointService{
  baseApiUrlMaster = "/app/master";
  baseApiUrlMeasure = "/app/measure";
  baseApiUrlResult ="/app/result";
  baseApiUrlCal = "/app/calc";
  baseApiUrlSetDrawArea = "/app/drawArea";
  constructor(private http:HttpClient) {
  }

  /**
   * 計測基準を設定する
   * @param pname 基準点名称
   * @param x X座標値
   * @param y Y座標値
   */
  setMasterPoint(pname:string, x:number, y:number): Observable<HttpEvent<any>> {

    // /app/master/P1/x座標/y座標
    // でロボット側に通知
    let getUrl = `${this.baseApiUrlMaster}/${pname}/${x}/${y}`;
    console.log(getUrl);
    return this.http.put<any>(getUrl, {});
  }

  /**
   * 基準座標値の数（Pの数）を設定する
   * @param numOfPont
   */
  setMasterPointNumbers(numOfPont : number):Observable<HttpEvent<any>> {
    // /master/set_number/{num}

    let putUrl =`${this.baseApiUrlMaster}/set_number/${numOfPont}`

    return this.http.put<any>(putUrl, {});
  }

  /**
   * 計測するP点の個数を取得する
   */
  getMeasurePointNumbers():Observable<HttpEvent<any>> {
    let getUrl = `${this.baseApiUrlMaster}/get_number/`;

    return this.http.get<any>(getUrl, {});
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
   * @param pname 計測ポイント名称
   * @param x X座標値
   * @param y Y座標値
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
  getMeasurePoint(pname:string): Observable<HttpEvent<any>>
  {
    let getUrl = `${this.baseApiUrlMeasure}/point/${pname}`;
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

  /**
   * 変換係数を取得する
   * @param cmd
   */
  getMatrixResult(cmd:string) : Observable<HttpEvent<any>>{

    let getUrl = `${this.baseApiUrlResult}/${cmd}`
    return this.http.get<any>(getUrl,{observe:'response'});
  }

  /**
   * Pnに関するエラーを取得する
   * @param cmd
   */
  getP1Error(cmd : string) : Observable<HttpEvent<any>>{
    let getUrl = `${this.baseApiUrlResult}/${cmd}`
    return this.http.get<any>(getUrl,{observe:'response'});

  }

  /**
   * サーバーに描画エリア関係のデータをセットする
   * @param drawAreaData
   */
  setDrawAreaPoints(cmd : string,  drawAreaData : DxfChartDatas): Observable<HttpEvent<any>> {

    let getUrl = `${this.baseApiUrlSetDrawArea}/${cmd}`;
    return this.http.put<any>(getUrl, {drawAreaData});
  }

  /**
   * サーバーに描画エリアデータをセットする
   * @param dAreaPoly
   */
  setDrawAreaPointsFromList(dAreaPoly : DrawAreaPolygon) : Observable<DrawAreaPolygon>{
    let setUrl = `${this.baseApiUrlSetDrawArea}/setPolygon`;

    return this.http.post<DrawAreaPolygon>(setUrl, dAreaPoly);
  }

  /**
   * 基準設定をファイルに保存する
   * @param fileName
   */
  saveOrgManager(fileName : string) : Observable<HttpEvent<any>>{
    let putUrl = `${this.baseApiUrlMeasure}/save_org_manager/${fileName}`;
    return this.http.put<any>(putUrl, {});

  }


}
