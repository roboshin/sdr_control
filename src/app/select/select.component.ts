import {Component, ElementRef, OnInit, ViewChild, AfterViewInit,} from '@angular/core';
import { FileService, ViewLayerService} from "../file.service";
import {catchError, lastValueFrom, take} from "rxjs";
import {map} from "rxjs/operators";
import {IgxDialogComponent} from "igniteui-angular";
import {filter} from "rxjs/operators";
import {LineInfo} from "../LineInfo";
import {FileInfo} from "@angular-devkit/build-angular/src/utils/index-file/augment-index-html";
import {SharedDataService} from "../SharedData.Service";


@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, AfterViewInit {
  @ViewChild('alert') public alertDialg: IgxDialogComponent;
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

  dialog_title: string =""; // ポップアップウィンドウタイトル
  dialog_msg : string ="";  // ポップアップメッセージ

  shortLink: string = "";
  loading: boolean = false;
  file: File = null;

  private layerNames: string[];  // レイヤー名称のリスト

  private lineDatas : LineInfo[]; // 描画用データ

  constructor(
    private fileUploadService: FileService,
    private viewLayerService: ViewLayerService,
    private shareDataService: SharedDataService) {
  }


  ngOnInit(): void {
    this.shareDataService.sharedData$.subscribe(sData=>this.lineDatas = sData);
  }

  ngAfterViewInit(): void {
    console.log(this.alertDialg);
  }

  /**
   * Dxfデータを保存する
   */
  upDateLineData(){
    console.log("upDateLineData")
    this.shareDataService.setData(this.lineDatas);
  }

  /**
   * 選択ファイルを確定
   * @param event
   */
  onChange(event) {
    this.file = event.target.files[0];
  }

  /**
   * ファイルアップロード用
   * ロボット側で、ファイルアップロード後にファイルパースの結果を受け取る
   * サーバーからの戻り値　DXFに含まれるレイヤー名の一覧
   * 画面表示用に、　各カーブのポイント配列、レイヤー名
   * 交点タップ用に　各カーブ同士の交点一覧
   */
  onUpload() {
    this.loading = !this.loading;
    const layersMap = this.fileUploadService.upload(this.file).pipe(map((v, i) => {

      console.log("onUpload");
      console.log(v);
      this.alertDialg.open();

      this.layerNames = v["Item2"]; // C#側からtupleでデータ送信されるDXF内のレイヤー
      this.lineDatas = v["Item1"];

      console.log("layerNames");
      console.log(this.layerNames);
      console.log("lineDatas");
      console.log(this.lineDatas);

      this.upDateLineData();  // 描画データの更新

      return v["Item2"]
    }));

    layersMap.subscribe(x=> {
      console.log(x);
      this.itemViewLayer = x;
      this.itemDrawLayer = x;
    });

    console.log(layersMap);
    this.dialog_title = "Success";
    this.dialog_msg = "ファイル転送完了\nLayers : "+this.itemViewLayer;

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
