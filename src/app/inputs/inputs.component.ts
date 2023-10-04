import { MenuItem } from 'primeng/api';
import { VP_BPM } from 'src/beans/VP_BPM';
import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../data.service';


interface input {
  Filial: string;
  Deposito: string;
  tipoBaixa: string;
  Produto: string;
  Quantidade: number;
  Complemento: string;
  data: any;
}

@Component({
  selector: 'app-input',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
})
export class InputComponent implements OnInit {

  cities: string[];
  Filial:string = '';
  Deposito:string = '';
  tipoBaixa:string = '';
  Produto:string = '';
  Quantidade:number = 10;
  Complemento:string = '';
  data:any


  constructor(private dataService: DataService ) {
    this.cities = [
     'New York' ,
    'Rome' ,
     'London' ,
     'Istanbul' ,
     'Paris' ,
  ];}

  ngOnInit(): void {}

  incluir(){
    console.log(this.Filial);
    console.log(this.Deposito);
    console.log(this.tipoBaixa);
    console.log(this.Produto);
    console.log(this.Quantidade);
    console.log(this.Complemento);

    let input: input = {
      Filial: this.Filial,
      Deposito: this.Deposito,
      tipoBaixa: this.tipoBaixa,
      Produto: this.Produto,
      Quantidade: this.Quantidade,
      Complemento: this.Complemento,
      data: this.data
    }
    this.dataService.setInputs(input);
    
  }
  
}

