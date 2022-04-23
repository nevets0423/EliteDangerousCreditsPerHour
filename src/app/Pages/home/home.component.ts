import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public Tab1: string = "tab1";
  public Tab2: string = "tab2";
  public Tab3: string = "tab3";
  public ActiveTab: string = this.Tab1;

  constructor() { }

  ngOnInit(): void {}

  TabClicked(tabName: string){
    this.ActiveTab = tabName;
  }
}
