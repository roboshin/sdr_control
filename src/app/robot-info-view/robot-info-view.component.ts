import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {interval} from "rxjs";

@Component({
  selector: 'app-robot-info-view',
  templateUrl: './robot-info-view.component.html',
  styleUrls: ['./robot-info-view.component.scss']
})
export class RobotInfoViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const inter = interval(1000);


    const obs = {
      next:(x:any)=>{console.log("next obs")},
      error:(err:Error)=>{
        console.log("err : "+err);
        console.log(err.message)
      },
      complete:()=>{console.log("comp")}
    };

    inter.subscribe(obs);
  }

}
