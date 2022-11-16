import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';

/**
 *
 */
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
  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param file
   */
  upload(file): Observable<any> {
    console.log("upload : "+file);

    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.baseApiUrl, formData)
  }
}

/**
 * サーバーから表示用レイヤー群を取得する
 */
@Injectable({
  providedIn: 'root'
})
export class ViewLayerService{
  baseApiUrl = "/app/viewLayer"

  constructor(private http:HttpClient) {
  }

  getViewLayer():Observable<string[]>{
    return this.http.get<string[]>(this.baseApiUrl);
  }
}

/**
 * 描画用レイヤ名を取得する
 */
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
