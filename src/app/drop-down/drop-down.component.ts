import { Component , OnInit} from '@angular/core';
import { Country, data } from './local-data';
import {RobotControService} from "../file.service";

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit{
  public items: Country[] = data;
  public rippleColor = 'grey';

  constructor(private rcs: RobotControService) {
  }

  ngOnInit():void{

  }

  onPlay(){
    console.log("onPlay");
    this.rcs.setPlay('play').subscribe();
  }

  onHold(){
    this.rcs.setHold('hold').subscribe();
  }

  onStop(){
    this.rcs.setStop('stop').subscribe();
  }
}
