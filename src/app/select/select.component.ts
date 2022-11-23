import { Observable } from 'rxjs';

import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { FileService, LayerService } from '../file.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
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

  shortLink: string = "";
  loading: boolean = false;
  file: File = null;

  progress = 0;
  message = '';
  uploadcomplete: boolean = false;

  public selviewlayername: string;
  public seldrawlayername: string;
  public initviewlayer: string;
  public initdrawlayer: string;
  public currfilename: string;

  constructor(private fileService: FileService, private layerService: LayerService) {
  }

  ngOnInit(): void {
    this.fileService.getCurrDxfFilename().subscribe(dxffilename => this.currfilename = dxffilename);
    this.layerService.getLayers().subscribe(layerstrings => {
        this.itemViewLayer = layerstrings;
        this.itemDrawLayer = layerstrings;
      });
    this.layerService.getViewLayer().subscribe(viewlayerstring => {
        // this.initviewlayer = viewlayerstring;
        this.selviewlayername = viewlayerstring;
        console.log("viewlayerstring: " + viewlayerstring);
        console.log("this.selviewlayername: " + this.selviewlayername);
      });
    this.layerService.getDrawLayer().subscribe(drawlayerstring => {
        // this.initdrawlayer = drawlayerstring;
        this.seldrawlayername = drawlayerstring;
        console.log("viewlayerstring: " + drawlayerstring);
        console.log("this.seldrawlayername: " + this.seldrawlayername);
      });

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
   */
   onUpload(): void {
    this.progress = 0;
    this.uploadcomplete = false;

    // 各種データ初期化
    this.initviewlayer = "";
    this.initdrawlayer = "";
    this.currfilename = "";
    this.itemViewLayer = [];
    this.itemDrawLayer = [];

    if (this.file) {
      this.fileService.upload(this.file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
            console.log("loaded: " + event.loaded + " total: " + event.total);
            console.log("progress:" + this.progress);
            if (event.loaded >= event.total) {
              this.uploadcomplete = true;
            }
          } else if (event instanceof HttpResponse) {
            // this.message = event.body.message;
            // console.log("message "+ this.message);
            console.log(event);
          }
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }
          console.log(this.message);
        },
        () => {
          this.file = undefined;
          this.uploadcomplete = true;
          console.log("upload compleate");
          console.log(this.uploadcomplete);
          if (this.uploadcomplete) {  // Uploadが成功したのでLayerリストを取得し上書き
            this.layerService.getLayers().subscribe(
              layerstrings => {
                this.itemViewLayer = layerstrings;
                this.itemDrawLayer = layerstrings;
              }
            );
          }
        });
    }
  }
  /*
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileService.upload(this.file).subscribe((event: any) => {
      if (typeof (event) == 'object') {
        this.shortLink = event.link;
        this.loading = false;
      }
    });
  }
  */

  /**
   * アップロードファイルパース用
   */
  onParse(): void {
    this.fileService.parseuploadfile().subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('response: ', response);
        console.log(response.body)
        this.itemViewLayer = [];  // 一旦クリア
        this.itemViewLayer = response.body; // パース結果のLayerリストを設定
        this.itemDrawLayer = [];  // 一旦クリア
        this.itemDrawLayer = response.body; // パース結果のLayerリストを設定
      },
      error: (e) => {
        switch (e.status) {
          default:
            console.log('error: ', e);
            break;
        }
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  selViewLayer(event) {
    console.log('event: '+ event);
    this.layerService.setViewLayer(event).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('response: ', response);
        console.log('response-body: ', response.body);
      },
      error: (e) => {
        switch (e.status) {
          default:
            console.log('error: ', e);
            break;
        }
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  selDrawLayer(event) {
    console.log('event: '+ event);
    this.layerService.setDrawLayer(event).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('response: ', response);
        console.log('response-body: ', response.body);
      },
      error: (e) => {
        switch (e.status) {
          default:
            console.log('error: ', e);
            break;
        }
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  /*
  selViewLayer() {
    this.layerService.setViewLayer("View Layerzo").subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('response: ', response);
        console.log('response-body: ', response.body);
      },
      error: (e) => {
        switch (e.status) {
          default:
            console.log('error: ', e);
            break;
        }
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
  onLoadViewLayer() {
    // this.viewLayerService.getViewLayer()
    //   .subscribe(viewLayers => this.itemViewLayer = viewLayers);
    this.layerService.setViewLayer("View Layerzo").subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('response: ', response);
        console.log('response-body: ', response.body);
      },
      error: (e) => {
        switch (e.status) {
          default:
            console.log('error: ', e);
            break;
        }
      },
      complete: () => {
        console.log('complete');
      }
    });
  }


}
