import { MenuItem } from 'primeng/api';
import { VP_BPM } from 'src/beans/VP_BPM';
import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-exemplos',
  templateUrl: './exemplos.component.html',
  styleUrls: ['./exemplos.component.scss'],
})
export class ExemplosComponent implements OnInit {
  @Input() vp!: VP_BPM;
  cities: City[];


  constructor() {this.cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];}

  ngOnInit(): void {}
  
}
interface City {
  name: string;
  code: string;
}
