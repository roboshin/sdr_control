import { interval, catchError, Observable, throwError } from 'rxjs';
import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse
} from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import { NGXLogger } from "ngx-logger";

/**
 * ロボット設定用クラス
 */
export class SettingInfo{
  public XErrorGain : number;
  public YErrorGain : number;
  public DrawSpeed : number;
  public InkOn : boolean;
}

@Injectable({
  providedIn: 'root'
})

// ロボットの情報を取得するサービス
export class RobotInfoService{

  // ロボット情報取得用のサービスアドレス
  baseApiUrl = "/app/robotInfo"
  baseSetApiUrl = "/app/robotSet"

  constructor(private http:HttpClient,
              private logger:NGXLogger) {
  }

  // ロボットの情報を取得する
  getRobotInfo() : Observable<any>{

    let cmd = "all";
    let getUrl = `${this.baseApiUrl}/info/${cmd}/`;

    console.log(getUrl);
    this.logger.debug(`getRobotInfo service`, `getUrl : ${getUrl}`)

    return this.http.get(getUrl);
  }
  //
  // getInterval(){
  //   return interval(1000);
  // }

  /**
   * ロボット設定をサーバへ送信
   * @param cmd
   * @param settings
   */
  setRobotSettings(cmd : string, settings:SettingInfo):Observable<SettingInfo> {
    let putUrl = `${this.baseSetApiUrl}/info/${cmd}/`;

    return this.http.put<SettingInfo>(putUrl,settings,{});
  }




}
