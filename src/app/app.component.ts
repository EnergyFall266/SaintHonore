import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataService } from './data.service';

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
    
  }
}
