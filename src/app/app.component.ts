import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataService } from './data.service';
import { set } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  mostrarOverlay: boolean = false;
  dadosNota: any[] = [];

  constructor(
    private dataService: DataService,
    private messageService: MessageService
  ) {}
  confirmacao() {
    if (this.dataService.getInputs().length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Nenhum item adicionado',
      });
    } else {
      this.mostrarOverlay = true;
    }
  }
  emitirNota() {
    this.dadosNota = [];
    let count = 1;
    console.log(this.dataService.getInputs());

this.dataService.getInputs().forEach((element) => {
  console.log(element);
  
  console.log(element.notaFiscal.DadosGerais.CodFil);
  
  
  if (this.dadosNota.length == 0) {
    this.dadosNota.push(element.notaFiscal);
  }
  else {
    this.dadosNota.forEach((element2) => {
      console.log(element.notaFiscal.DadosGerais.CodFil);
      console.log(element2);
      
      if (element.notaFiscal.DadosGerais.CodFil === element2.DadosGerais.CodFil) {
        element2.DadosGerais.Produtos.push(element.notaFiscal.DadosGerais.Produtos.pop());
      }
      else {
        this.dadosNota.push(element.notaFiscal);
      }
    });
  }
  console.log(this.dadosNota);
  
}
);
console.log(this.dadosNota);


    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Nota emitida com sucesso',
    });
    // setTimeout(() => {
    // location.reload();
    // }
    // , 2000);


    // this.dataService.getInputs().forEach((element) => {
    //   this.dadosNota.push(element.dadosGerais);
    // });
    // console.log(this.dadosNota);

    // this.dadosNota.forEach((element) => {
    //   element.Produtos.forEach((element2: any) => {
    //     element2.SeqIpv = count++;
    //   });
    // });
    // console.log(this.dadosNota);
    
    // colocar os mesmos produtos no
        // percorre o array de objetos
        // verifica se ja tem uma com a mesma filial
        // se tiver, adiciona o produto no array de produtos e exclui o objeto
  }

}
