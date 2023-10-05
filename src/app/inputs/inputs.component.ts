import { MenuItem } from 'primeng/api';
import { VP_BPM } from 'src/beans/VP_BPM';
import { Component,  OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MessageService } from 'primeng/api';

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
  providers: [MessageService]
})
export class InputComponent implements OnInit {

  cities: string[];
  Filial:string = '';
  Deposito:string = '';
  tipoBaixa:string = '';
  Produto:string = '';
  Quantidade:number = 0;
  Complemento:string = '';
  data:any


  constructor(private dataService: DataService, private messageService: MessageService ) {
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

    if(this.Filial == '' || this.Deposito == '' || this.tipoBaixa == '' || this.Produto == '' || this.Quantidade == 0 || this.Quantidade == null || this.Complemento == '' || this.data == null){
      this.messageService.add({severity:'warn', summary: 'Atenção', detail: 'Preencha todos os campos!'});
    }
    else{

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
  
}

