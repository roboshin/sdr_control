import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LineInfo, Point2D} from "./LineInfo";

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
    console.log("upload : " + file);

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
export class ViewLayerService {
  baseApiUrl = "/app/viewLayer"

  constructor(private http: HttpClient) {
  }

  getViewLayer(): Observable<string[]> {
    return this.http.get<string[]>(this.baseApiUrl);
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
}


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
   * ロボットへスタート信号を送る
   * @param str
   */
  setPlay(str: string): Observable<any> {
    return this.http.put(this.baseApiUrl + '/play', str, this.httpOptions);
  }

  /**
   * ロボットへ一時停止信号を送る
   * ロボットはインク吐出中であれば、吐出を停止する
   * @param str
   */
  setHold(str: string): Observable<any> {
    return this.http.put(this.baseApiUrl + '/hold', str, this.httpOptions);
  }

  /**
   * ロボットへ停止信号を送信する
   * @param str
   */
  setStop(str: string): Observable<any> {
    return this.http.put(this.baseApiUrl + '/stop', str, this.httpOptions);
  }
}

// @Injectable({
//   providedIn: 'root'
// })
// export class DrawLineDatas {
//   public points: LineInfo[];
// }
