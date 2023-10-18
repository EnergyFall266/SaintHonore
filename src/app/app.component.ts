import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataService } from './data.service';
import { AppService } from './app.service';
import { Table } from 'primeng/table';
import { TableComponent } from './table/table.component';
import { InputComponent } from './inputs/inputs.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  mostrarOverlay: boolean = false;
  dadosNota: any[] = [];
  loading: boolean = false;
  labelButton: string = 'Confirmar';
  @ViewChild(TableComponent) table!: TableComponent;
  @ViewChild(InputComponent) input!: InputComponent;

  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private appService: AppService
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
    console.log(this.dataService.getInputs());
    let igual: boolean = false;

    //junta produtos da mesma filial
    this.dataService.getInputs().forEach((element) => {
      igual = false;
      // console.log(element);

      // console.log(element.notaFiscal.DadosGerais.CodFil);

      if (this.dadosNota.length == 0) {
        element.notaFiscal.DadosGerais.Produtos[0].SeqIpv = 1;
        this.dadosNota.push(element.notaFiscal);
        // console.log('primeiro');
      } else {
        this.dadosNota.forEach((element2) => {
          // console.log(element2);

          if (
            element.notaFiscal.DadosGerais.CodFil ===
            element2.DadosGerais.CodFil
          ) {
            // console.log("sseq");

            // console.log(element2.DadosGerais.Produtos[element2.DadosGerais.Produtos.length - 1].SeqIpv);
            element.notaFiscal.DadosGerais.Produtos[0].SeqIpv =
              element2.DadosGerais.Produtos[
                element2.DadosGerais.Produtos.length - 1
              ].SeqIpv + 1;
            element2.DadosGerais.Produtos.push(
              element.notaFiscal.DadosGerais.Produtos.pop()
            );
            // console.log('igual');
            igual = true;
          }
        });
        if (!igual) {
          element.notaFiscal.DadosGerais.Produtos[0].SeqIpv = 1;

          this.dadosNota.push(element.notaFiscal);
          // console.log('novo');
        }
      }
      console.log(this.dadosNota);
    });
    // console.log(this.dadosNota);
    this.request();
  }

  async request() {
    try {
      this.loading = true;
      this.labelButton = 'Emitindo...';
      await this.appService.gerarNota(this.dadosNota);
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Nota emitida com sucesso',
      });
      this.labelButton = 'Confirmar';
      this.table.clear();
      this.input.clear();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao emitir nota',
      });
    }
  }
}
