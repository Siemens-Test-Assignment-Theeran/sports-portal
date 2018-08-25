import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-tree',
  templateUrl: './custom-tree.component.html',
  styleUrls: ['./custom-tree.component.css']
})
export class CustomTreeComponent implements OnInit, OnChanges {
  @Input('data') data: Array<Object>;
  private showPlayers: Object;
  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data.length > 0) {
      // this.data.map((value) => {
      //   this.showItems['show'+value[name]] = false;
      // });
    }
  }

}
