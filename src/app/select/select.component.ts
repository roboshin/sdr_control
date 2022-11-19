import {Component, ElementRef, OnInit, ViewChild, AfterViewInit,} from '@angular/core';
import {FileService, ViewLayerService} from "../file.service";
import {catchError, lastValueFrom, take} from "rxjs";
import {map} from "rxjs/operators";
import {IgxDialogComponent} from "igniteui-angular";
import {filter} from "rxjs/operators";
import {LineInfo} from "../LineInfo";
import {FileInfo} from "@angular-devkit/build-angular/src/utils/index-file/augment-index-html";
import {Tuple} from "igniteui-angular-core";
import {strict} from "assert";


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

  dialog_title: string ="";
  dialog_msg : string ="";

  shortLink: string = "";
  loading: boolean = false;
  file: File = null;

  private layerNames: string[];  // レイヤー名称のリスト

  constructor(private fileUploadService: FileService, private viewLayerService: ViewLayerService) {
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.alertDialg);
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
      this.alertDialg.open();
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
