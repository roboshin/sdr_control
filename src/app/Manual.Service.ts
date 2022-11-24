import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManualService{
  baseApiUrl = "/app/control"
  constructor(private http:HttpClient) {
  }

  /**
   *
   * @param x
   * @param y
   */
  moveWheel(x : Number, y : Number): Observable<HttpEvent<any>> {
    let getUrl = `${this.baseApiUrl}/${x}/${y}`;
    console.log(getUrl);
    return this.http.get<any>(getUrl);
  }

  /**
   * 台車を停止させる
   */
  moveWeelStop(){
    let getUrl = `${this.baseApiUrl}/stop`;
    console.log("stop cmd " + getUrl);
    return this.http.get<any>(getUrl);
  }
}

