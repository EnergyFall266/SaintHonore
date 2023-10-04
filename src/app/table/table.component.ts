import { Component,  } from '@angular/core';
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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
input: input[] = [];

constructor(private dataService: DataService) { }

ngOnInit(): void {
  this.input = this.dataService.getInputs();
}

}
