import {catchError, Observable, throwError} from 'rxjs';

import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse
} from '@angular/common/http';
import {TmplAstRecursiveVisitor} from '@angular/compiler';
import {Injectable} from '@angular/core';
import {RobotInformation} from "./robot-information";
import {NGXLogger} from "ngx-logger";
import {DrawLineDatas} from "./draw-line-datas";
import {CrossPointDatas} from "./cross-point-datas";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  baseApiUrl = "/app/upload"

  //baseApiUrl = "https://file.io"
  /**
   *
   * @param http
   */
  constructor(private http: HttpClient,
              private logger: NGXLogger,) {
  }

  getCurrDxfFilename(): Observable<string> {
    return this.http.get<string>(`${this.baseApiUrl}/getdxffilename`);
  }

  // /**
  //  *
  //  * @param file
  //  */
  // upload(file: File): Observable<HttpEvent<any>> {
  //     const formData: FormData = new FormData();
  //
  //     formData.append('file', file);
  //
  //     const req = new HttpRequest('POST', `${this.baseApiUrl}/upload`, formData, {
  //       reportProgress: true,
  //       responseType: 'json'
  //     });
  //
  //     return this.http.request(req);
  // }

  /**
   * @param void
   */
  parseuploadfile(): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.baseApiUrl}/parsedxffile`, {observe: 'response'})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An Error Occurred: ', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error.message);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'))
  }

  /**
   * DXFファイルをアップロードする
   * @param file
   */
  upload(file : File): Observable<[DrawLineDatas,CrossPointDatas]> {
    // console.log("upload : " + file);
    this.logger.log(`upload : ${file.name}`)

    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post<[DrawLineDatas,CrossPointDatas]>(this.baseApiUrl, formData)
  }

  /**
   * ラインデータを取得する
   */
  getLines(): Observable<DrawLineDatas> {
    var getBaseUrl = "/app/linedata";

    return this.http.get<DrawLineDatas>(getBaseUrl);
  }

  /**
   * 交点情報を取得する
   */
  getCrossPoint():Observable<CrossPointDatas>{
    const getBaseUrl = "/app/crossData";

    return this.http.get<CrossPointDatas>(getBaseUrl);
  }
}

/**
 * サーバーから表示用レイヤー群を取得する
 */
@Injectable({
  providedIn: 'root'
})
export class ViewLayerService {
  baseApiUrl = "/app/viewLayer"

  constructor(private http: HttpClient) {
  }

  /**
   *
   */
  getViewLayer(layerName:string): Observable<string[]> {
    return this.http.get<string[]>(this.baseApiUrl+`/view/`+`${layerName}`);
  }

  getDrawLayer(layerName:string): Observable<string[]> {
    return this.http.get<string[]>(this.baseApiUrl+`/draw/`+`${layerName}`);
  }

  setDrawLayer(str: string): Observable<HttpResponse<any>> {
    let drawlayerjson = {"layername": str};
    const transjson = JSON.stringify(drawlayerjson);

    return this.http.put<any>(`${this.baseApiUrl}/setDrawLayer`, transjson);
  }

  /**
   * PCに表示用レイヤー名称（基準点レイヤー）をセットする
   * @param layerName
   */
  setViewerLayer(layerName : string) : Observable<string>{
    let setLayerName = this.baseApiUrl+`/setLayer/${layerName}`;

    return this.http.put<string>(setLayerName,{});
  }

}

/**
 * 描画用レイヤ名を取得する
 */
@Injectable({
  providedIn: 'root'
})
export class DrawLayerService {
  baseApiUrl = "/app/drawLayer"

  constructor(private http: HttpClient) {
  }

  getViewLayer(): Observable<string[]> {
    return this.http.get<string[]>(this.baseApiUrl);
  }

  /**
   * PCに表示用レイヤー名称（基準点レイヤー）をセットする
   * @param layerName
   */
  setDrawLayer(layerName : string) : Observable<string>{
    let setLayerName = this.baseApiUrl+`/setLayer/${layerName}`;

    return this.http.put<string>(setLayerName,{});
  }
}


/**
 * ロボットコントロール用サービス
 * 再生ボタン、停止、ホールド用通信
 */
@Injectable({
  providedIn: 'root'
})
export class RobotControService {
  baseApiUrl = "/app/robotControl"

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'},)
  };

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param str
   */
  setPlay(str: string): Observable<any> {
    return this.http.put(this.baseApiUrl + '/play', str, this.httpOptions);
  }

  /**
   *
   * @param str
   */
  setHold(str: string): Observable<any> {
    return this.http.put(this.baseApiUrl + '/hold', str, this.httpOptions);
  }

  /**
   *
   * @param str
   */
  setStop(str: string): Observable<any> {
    return this.http.put(this.baseApiUrl + '/stop', str, this.httpOptions);
  }


  /**
   * ロボットの状態を取得する
   * @param cmd
   */
  getRobotInfo(cmd : string) : Observable<RobotInformation>{

    //
    // 通信アドレス　get
    // /app/robotControl/rinfo
    //

    return this.http.get<RobotInformation>(this.baseApiUrl+`/rinfo`);
  }
}

/**
 * ロボットの現在位置を取得する
 */
@Injectable({
  providedIn : 'root'
})
export class RobotPoseService{

  // C#との通信用ルート
  baseApiUrl = "/app/robotPose"

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'},)
  };

  constructor(private http: HttpClient) {
  }

  /**
   * ロボットの現在位置（測定値、DXF上の値）を取得する
   * @param str
   */
  getPose(str : string): Observable<any>{
    let getPoseUrl = this.baseApiUrl+'/getPose';
    return this.http.get(getPoseUrl);
  }

}
