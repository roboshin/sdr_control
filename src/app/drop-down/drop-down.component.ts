import { Component , OnInit} from '@angular/core';
import { Country, data } from './local-data';
import {RobotControService} from "../file.service";
import { from, Observable } from 'rxjs';

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

  /**
   *
   */
  onPlay(){
    console.log("onPlay");
    this.rcs.setPlay('play').subscribe({
      next(response) { console.log(response); },
      error(err) { console.error('Error: ' + err); },
      complete() { console.log('Completed'); }
    })};

  /**
   *
   */
  onHold(){
    this.rcs.setHold('hold').subscribe({
      next(response) { console.log(response); },
      error(err) { console.error('Error: ' + err); },
      complete() { console.log('Completed'); }
    })};

  /**
   *
   */
  onStop(){
    this.rcs.setStop('stop').subscribe({
      next(response) { console.log(response); },
      error(err) { console.error('Error: ' + err); },
      complete() { console.log('Completed'); }
    })};
}
