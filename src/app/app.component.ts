import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataService } from './data.service';
import { AppService } from './app.service';
import { Table } from 'primeng/table';
import { TableComponent } from './table/table.component';
import { InputComponent } from './inputs/inputs.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService,DialogService],
})
export class AppComponent {
  mostrarOverlay: boolean = false;
  dadosNota: any[] = [];
  loading: boolean = false;
  labelButton: string = 'Confirmar';
  @ViewChild(TableComponent) table!: TableComponent;
  @ViewChild(InputComponent) input!: InputComponent;
  ref: DynamicDialogRef| undefined;
  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private appService: AppService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {

  }
  
  confirmacao() {


    
    if (this.dataService.getInputs().length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Nenhum item adicionado',
      });
    } else {
      this.ref = this.dialogService.open(TableComponent, {
        header: 'Tem certeza que deseja realizar a baixa destes produtos?',
        width: '80vw',
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
       
    });
      // console.log(this.dataService.getInputs());
      
      // this.mostrarOverlay = true;
    }
  }
  emitirNota() {
    console.log("aaaaaa");
    this.ref?.close();
    this.dadosNota = [];
    console.log(this.dataService.getInputs());
    let igual: boolean = false;

    //junta produtos da mesma filial
    this.dataService.getInputs().forEach((element) => {
      igual = false;
      // console.log(element);

      // console.log(element.notaFiscal.DadosGerais.CodFil);

      if (this.dadosNota.length == 0) {
        element.notaFiscal.dadosGerais[0].produtos[0].seqIpv = 1;
        this.dadosNota.push(element.notaFiscal);
        // console.log('primeiro');
      } else {
        console.log(this.dadosNota);
        
        this.dadosNota.forEach((element2) => {
          console.log(element2);
          for(let i = 0; i < element2.dadosGerais.length; i++){
          if (
            element.notaFiscal.dadosGerais[0].codFil ===
            element2.dadosGerais[i].codFil
          ) {
            // console.log("sseq");

            // console.log(element2.DadosGerais.Produtos[element2.DadosGerais.Produtos.length - 1].SeqIpv);
            element.notaFiscal.dadosGerais[0].produtos[0].seqIpv =
              element2.dadosGerais[i].produtos[
                element2.dadosGerais[i].produtos.length - 1
              ].seqIpv + 1;
            element2.dadosGerais[i].produtos.push(
              element.notaFiscal.dadosGerais[0].produtos.pop()
            );
            // console.log('igual');
            igual = true;
          }
        }
        });
        if (!igual) {
          element.notaFiscal.dadosGerais[0].produtos[0].seqIpv = 1;

          this.dadosNota[0].dadosGerais.push(element.notaFiscal.dadosGerais[0]);
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
      await this.appService.gerarNota(this.dadosNota[0]);
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Nota emitida com sucesso',
      });
      this.labelButton = 'Confirmar';
      this.table.clear();
      this.table.ngOnInit();
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
