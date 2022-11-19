import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-view',
  templateUrl: './svg-view.component.html'
  // styleUrls: ['./svg-view.component.scss']
})
export class SvgViewComponent implements OnInit {
  color1 = "blue";
  imageurl = "";
  style = {
    "width":"32px", 
    "height":"32px", 
    "background-image":"", 
    "background-size":"100%",
    "background-color":"red"
  };

  constructor() { }

  ngOnInit(): void {
  };

  onClickChangeColor1() {
    this.color1 = "red";
  };

  onClickSetSVGBkground() {
    this.imageurl = "/assets/out.svg"
  };

}
