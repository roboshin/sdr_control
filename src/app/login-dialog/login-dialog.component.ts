import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Form} from "@angular/forms";
import {IgxDialogComponent} from "igniteui-angular";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('form') public form : IgxDialogComponent;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.form.open();
  }

  // ユーザ名とパスワードでロボットへ問い合わせする

}
