import {catchError, Observable, throwError} from 'rxjs';

import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse
} from '@angular/common/http';
import {TmplAstRecursiveVisitor} from '@angular/compiler';
import {NGXLogger} from "ngx-logger";

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KuiNavyService {

  public selected: string;

  private cmdBaseUrl : string = "/app/kui"; // 杭ナビコントロール用

  /**
   *
   * @param logger
   * @param http
   */
  constructor(
    private  logger : NGXLogger,
    private http: HttpClient
    ) {

  }

  /**
   * 杭ナビの状態を取得する
   */
  getKuiStatus() :Observable<any>{
    const baseUrl = this.cmdBaseUrl+`/ctrl/status`;

    return this.http.get(baseUrl);
  }

  /**
   * 杭ナビにターゲットサーチコマンドを発行する
   */
  setCmdSearch():Observable<any>{
    const baseUrl = this.cmdBaseUrl+`/ctrl/search`;

    return this.http.get(baseUrl, {});
  }

  /**
   * 杭ナビに計測開始を指示
   */
  setCmdStartMeasure():Observable<any>{
    const basweUrl = this.cmdBaseUrl+`/ctrl/start`;

    return this.http.get(basweUrl, {});
  }

  /**
   * 杭ナビに計測停止を指示
   */
  setCmdStopMeasure():Observable<any>{
    const basweUrl = this.cmdBaseUrl+`/ctrl/stop`;

    return this.http.get(basweUrl, {});
  }

  /**
   * プリズム設定
   * @param prismType プリズムタイプ "0":プリズム "1":360度プリズム
   * @param prismDia プリズム直系:[mm] 1-300
   * @param prismValue プリズム補正値:[mm] -99.9-99.9
   */
  setCmdReflectorParam(prismType:string, prismDia:number, prismValue:number):Observable<any>{
    const basweUrl = this.cmdBaseUrl+`/priParam`+`/${prismType}/${prismDia}/${prismValue}`;

    return this.http.get(basweUrl, {});
  }

}
