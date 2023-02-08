import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse
} from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import {IgxSliderComponent, IgxSliderType} from "igniteui-angular";

@Injectable({
  providedIn: 'root'
})
export class ManualService{

  baseApiUrl = "/app/control"

  constructor(private http:HttpClient) {
  }

  /**
   * 台車のマニュアル移動命令
   * @param x
   * @param y
   */
  moveWheel(x : Number, y : Number): Observable<HttpEvent<any>> {
    let cmd = "move";
    let getUrl = `${this.baseApiUrl}/${cmd}/${x}/${y}`;

    console.log(getUrl);

    return this.http.get<any>(getUrl);
  }

  /**
   * 台車の回転制御
   * @param x
   */
  moveRotWheel(x : Number) : Observable<HttpEvent<any>> {
    let cmd = "rot_wheel";
    let getUrl = `${this.baseApiUrl}/${cmd}/${x}`;

    console.log(getUrl);

    return this.http.get<any>(getUrl);
  }


  /**
   * リフレクタの回転
   * @param x
   */
  moveRotReflector(x : Number) : Observable<HttpEvent<any>> {
    let cmd = "rot_ref";
    let getUrl = `${this.baseApiUrl}/${cmd}/${x}`;

    console.log(getUrl);

    return this.http.get<any>(getUrl);
  }

  /**
   * 台車を停止させる
   */
  moveWeelStop(){
    let cmd = "stop";
    let getUrl = `${this.baseApiUrl}/${cmd}`;

    console.log("stop cmd " + getUrl);

    return this.http.get<any>(getUrl);
  }

  /**
   *  インク吐出
   * @param mSec インクの吐出時間
   */
  inkOn(mSec : Number){
    let cmd = "ink_on";
    let getUrl = `${this.baseApiUrl}/${cmd}/${mSec}`;

    console.log("ink on cmd : " + getUrl);

    return this.http.get<any>(getUrl);
  }

  /**
   * 台車最高速度の設定
   * @param velo
   */
  setMoveMaxSpeed(velo:Number){
    let cmd = "set_speed";
    let getUrl = `${this.baseApiUrl}/${cmd}/${velo}`;

    console.log("ink on cmd : " + getUrl);

    return this.http.get<any>(getUrl);
  }

  /**
   * 台車回転速度の設定
   * @param velo
   */
  setRotMaxSpeed(velo:Number){
    let cmd = "set_rot_speed";
    let getUrl = `${this.baseApiUrl}/${cmd}/${velo}`;

    console.log("ink on cmd : " + getUrl);

    return this.http.get<any>(getUrl);
  }

  /**
   * リフレクタ回転速度の設定
   * @param velo
   */
  setRefMaxSpeed(velo:Number){
    let cmd = "set_ref_speed";
    let getUrl = `${this.baseApiUrl}/${cmd}/${velo}`;

    console.log("ink on cmd : " + getUrl);

    return this.http.get<any>(getUrl);
  }


  /**
   * インクをONにする
   * @param Number
   */
  onInkOn(Number: NumberConstructor) {
    let cmd = "ink_on";
    let getUrl = `${this.baseApiUrl}/${cmd}`;

    console.log("ink on cmd : " + getUrl);

    return this.http.get<any>(getUrl);
  }

  /**
   * インクをOFFにする
   * @param Number
   */
  onInkOff(Number: NumberConstructor) {
    let cmd = "ink_off";
    let getUrl = `${this.baseApiUrl}/${cmd}`;

    console.log("ink on cmd : " + getUrl);

    return this.http.get<any>(getUrl);
  }


}

