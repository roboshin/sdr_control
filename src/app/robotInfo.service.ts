import { interval, catchError, Observable, throwError } from 'rxjs';
import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse
} from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import {IgxSliderComponent, IgxSliderType} from "igniteui-angular";


@Injectable({
  providedIn: 'root'
})

export class RobotInfoService{

  baseApiUrl = "/app/info"

  constructor(private http:HttpClient) {
  }



  getRobotInfo() : Observable<HttpEvent<any>>{

    let cmd = "all";
    let getUrl = `${this.baseApiUrl}/${cmd}/`;

    console.log(getUrl);

    return this.http.get<any>(getUrl);
  }

  getInterval(){
    return interval(1000);
  }





}
