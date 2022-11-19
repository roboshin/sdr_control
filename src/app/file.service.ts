import { catchError, Observable, throwError } from 'rxjs';

import {
    HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse
} from '@angular/common/http';
import { TmplAstRecursiveVisitor } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  // baseApiUrl = "/app/upload"
  baseApiUrl = "http://localhost:8000" + "/app"
  //baseApiUrl = "https://file.io"
  /**
   *
   * @param http
   */
  constructor(private http: HttpClient) {
  }

  getCurrDxfFilename():Observable<string>{
    return this.http.get<string>(`${this.baseApiUrl}/getdxffilename`);
  }

  /**
   *
   * @param file
   */
  upload(file: File): Observable<HttpEvent<any>> {
      const formData: FormData = new FormData();

      formData.append('file', file);

      const req = new HttpRequest('POST', `${this.baseApiUrl}/upload`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

      return this.http.request(req);
  }

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

/*  
  upload(file): Observable<any> {
    console.log("upload : "+file);

    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.baseApiUrl, formData)
  }
*/
}

/**
 * サーバーから表示用レイヤー群を取得する
 */
@Injectable({
  providedIn: 'root'
})
export class LayerService{
  // baseApiUrl = "/app/viewLayer"
  baseApiUrl = "http://localhost:8000" + "/app"

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' },)
  };

  constructor(private http:HttpClient) {
  }

  getLayers():Observable<string[]>{
    return this.http.get<string[]>(`${this.baseApiUrl}/getLayernames`);
  }

  getViewLayer():Observable<string>{
    return this.http.get<string>(`${this.baseApiUrl}/getviewLayer`);
  }

  getDrawLayer():Observable<string>{
    return this.http.get<string>(`${this.baseApiUrl}/getdrawLayer`);
  }
  
  setViewLayer(str: string): Observable<HttpResponse<any>> {
    let viewlayerjson = {"layername" : str };
    const transjson = JSON.stringify(viewlayerjson);

    return this.http.put<any>(`${this.baseApiUrl}/setViewLayer`,transjson);
  }

  setDrawLayer(str: string): Observable<HttpResponse<any>> {
    let drawlayerjson = {"layername" : str };
    const transjson = JSON.stringify(drawlayerjson);

    return this.http.put<any>(`${this.baseApiUrl}/setDrawLayer`,transjson);
  }

}


/**
 * 描画用レイヤ名を取得する
 */
/*
@Injectable({
  providedIn: 'root'
})
export class DrawLayerService{
  baseApiUrl = "/app/drawLayer"

  constructor(private http:HttpClient) {
  }

  getViewLayer():Observable<string[]>{
    return this.http.get<string[]>(this.baseApiUrl);
  }
}
*/

@Injectable({
  providedIn: 'root'
})
export class RobotControService{
  baseApiUrl = "/app/robotControl"

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' },)
  };

  constructor(private http:HttpClient) {
  }

  setPlay(str:string):Observable<any>{
  return this.http.put(this.baseApiUrl+'/play',str,this.httpOptions);}

  setHold(str:string):Observable<any>{
    return this.http.put(this.baseApiUrl+'/hold',str,this.httpOptions);}

  setStop(str:string):Observable<any>{
    return this.http.put(this.baseApiUrl+'/stop',str,this.httpOptions);}
}
