import {Component, ElementRef, OnInit, ViewChild, AfterViewInit,} from '@angular/core';
import {FileService, ViewLayerService} from "../file.service";
import {catchError, lastValueFrom, take} from "rxjs";
import {map} from "rxjs/operators";
import {IgxDialogComponent, IgxSelectComponent} from "igniteui-angular";
import {filter} from "rxjs/operators";
import {LineInfo} from "../LineInfo";
import {FileInfo} from "@angular-devkit/build-angular/src/utils/index-file/augment-index-html";
import {SharedDataService} from "../SharedData.Service";
import {NGXLogger} from "ngx-logger";

// for ngx-logger
// https://github.com/dbfannin/ngx-logger

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, AfterViewInit {

  constructor(
    private fileUploadService: FileService,
    private viewLayerService: ViewLayerService,
    private shareDataService: SharedDataService,
    private logger: NGXLogger) {
  }

  @ViewChild('alert', {static : true}) public alertDialg: IgxDialogComponent;
  @ViewChild('selectViewLayer', {static : true}) selectViewLayer : IgxSelectComponent;
  @ViewChild('selectDrawLayer', {static : true}) selectDrawLayer : IgxSelectComponent;
  /**
   * itemsRobot : ロボット名称
   * itemsKui   :　杭ナビ番号
   * itemViewLayer :　表示用レイヤー名称
   * itemDrawLayer :　描画用レイヤー名称
   */
  public itemsRobot: string[] = ['SDR2-1', 'SDR2-2',];
  public itemsKui: string[] = ['KUI1',];
  public itemViewLayer: string[] = ['A'];
  public itemDrawLayer: string[] = ['DrawLayer01'];

  dialog_title: string = ""; // ポップアップウィンドウタイトル
  dialog_msg: string = "";  // ポップアップメッセージ

  shortLink: string = "";
  loading: boolean = false;   // DXFデータロード中の表示用フラグ
  success_loading: boolean = false; // DXFデータロード完了中の表示用
  error_loading:boolean = false;
  file: File = null;

  private layerNames: string[];  // レイヤー名称のリスト
  private lineDatas: LineInfo[]; // 描画用データ


  /**
   *
   */
  ngOnInit(): void {
    this.shareDataService.sharedData$.subscribe(sData => this.lineDatas = sData);
  }

  /**
   *
   */
  ngAfterViewInit(): void {

  }

  /**
   * Dxfデータを保存する
   */
  upDateLineData() {
    this.logger.debug("[START] : upDateLineData")
    this.shareDataService.setData(this.lineDatas);
  }

  /**
   * 選択ファイルを確定
   * @param event
   */
  onChange(event) {
    this.file = event.target.files[0];
    this.logger.debug('FILE : ' + `${this.file}`);
  }

  /**
   * ファイルアップロード用
   * ロボット側で、ファイルアップロード後にファイルパースの結果を受け取る
   * サーバーからの戻り値　DXFに含まれるレイヤー名の一覧
   * 画面表示用に、　各カーブのポイント配列、レイヤー名
   * 交点タップ用に　各カーブ同士の交点一覧
   */
  onUpload() {
    this.logger.debug("[STAR] : onUpload");

    this.loading = !this.loading;
    const layersMap = this.fileUploadService.upload(this.file);

    const obsCallbacks = {
      next:(x:any)=>{
        this.logger.debug(x);

        this.layerNames = x['Item2'];
        this.lineDatas  = x['Item1'];
        this.upDateLineData();  // 描画データの更新

        this.itemViewLayer = x['Item2'];
        this.itemDrawLayer = x['Item2'];

        this.logger.debug("LayerName : "+`${this.layerNames}`);
        this.logger.debug("lineDatas : "+`${this.lineDatas}`);

        if(this.itemViewLayer.length > 0) {
          this.selectViewLayer.setSelectedItem(0);
        }

        if(this.itemDrawLayer.length > 0){
          this.selectDrawLayer.setSelectedItem(0);
        }
      },

      error:(err:Error)=>{
        // エラー処理
        // Dialogを開いて、
        this.logger.error("Error in onUpload"+`${Error.name}`)

        this.dialog_title = "Failed";
        this.dialog_msg = "ファイル転送に失敗しました";
        this.alertDialg.open(); // 完了Dialogをオープンする
      },

      complete:()=>{
        this.dialog_title = "Success";
        this.dialog_msg = "ファイル転送完了\nLayers : " + this.itemViewLayer;
        this.alertDialg.open(); // 完了Dialogをオープンする
      }
    };

    layersMap.subscribe(obsCallbacks);

    // layersMap.subscribe(x => {
    //   console.log(x);
    //   this.itemViewLayer = x;
    //   this.itemDrawLayer = x;
    // });

    // console.log(layersMap);
    // this.dialog_title = "Success";
    // this.dialog_msg = "ファイル転送完了\nLayers : " + this.itemViewLayer;

    // 受信データから、描画ラインのデータを抜き出す

  }

  // onUpload_getData() {
  //   var ob = this.fileUploadService.upload(this.file);
  //   ob.pipe(filter(cat=>cat=='a'))
  // }


  // TODO: エラー時の処理を追加する
  /**
   * レイヤー名　一覧を取得する
   */
  onLoadViewLayer() {
    this.viewLayerService.getViewLayer()
      .subscribe({
        next(vl) {
          this.itemViewLayer = vl
        },
        error(msg) {
          console.log(msg);
        }
      });
  }


}
