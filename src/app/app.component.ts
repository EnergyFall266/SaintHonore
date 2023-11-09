import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataService } from '../services/data.service';
import { AppService } from '../services/app.service';
import { TableComponent } from './table/table.component';
import { InputComponent } from './inputs/inputs.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VP_BPM } from 'src/beans/VP_BPM';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService, DialogService],
})
export class AppComponent {
  public vp: VP_BPM = new VP_BPM();
  mostrarOverlay: boolean = false;
  dadosNota: any[] = [];
  loading: boolean = false;
  labelButton: string = 'Confirmar';
  @ViewChild(TableComponent) table!: TableComponent;
  @ViewChild(InputComponent) input!: InputComponent;
  ref: DynamicDialogRef | undefined;
  retorno: any;
  response: any;
  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private appService: AppService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {}

  confirmacao() {
    if (this.dataService.getInputs().length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Nenhum item adicionado',
      });
    } else {
      //abre o dialogo de confirmação com a tebela de produtos
      this.ref = this.dialogService.open(TableComponent, {
        header: 'Tem certeza que deseja realizar a baixa destes produtos?',
        width: '80vw',
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
      });
    }
  }
  emitirNota() {
    this.ref?.close();
    this.dadosNota = [];
    let igual: boolean = false;

    //junta produtos da mesma filial
    this.dataService.getInputs().forEach((element) => {
      igual = false;

      if (this.dadosNota.length == 0) {
        element.notaFiscal.dadosGerais[0].produtos[0].seqIpv = 1;
        this.dadosNota.push(element.notaFiscal);
      } else {
        this.dadosNota.forEach((element2) => {
          for (let i = 0; i < element2.dadosGerais.length; i++) {
            if (
              element.notaFiscal.dadosGerais[0].codFil ===
              element2.dadosGerais[i].codFil
            ) {
              element.notaFiscal.dadosGerais[0].produtos[0].seqIpv =
                element2.dadosGerais[i].produtos[
                  element2.dadosGerais[i].produtos.length - 1
                ].seqIpv + 1;
              element2.dadosGerais[i].produtos.push(
                element.notaFiscal.dadosGerais[0].produtos.pop()
              );

              igual = true;
            }
          }
        });
        if (!igual) {
          element.notaFiscal.dadosGerais[0].produtos[0].seqIpv = 1;

          this.dadosNota[0].dadosGerais.push(element.notaFiscal.dadosGerais[0]);
        }
      }
    });

    this.request();
  }
  //envia os dados da nota para o servidor e limpa a tela
  async request() {
    try {
      this.vp.overlay = true;
      this.loading = true;
      this.labelButton = 'Emitindo...';
      this.response = await this.appService.gerarNota(this.dadosNota[0]);
      this.retorno = this.response.retorno;
      this.loading = false;
      if (Array.isArray(this.response)) {
        this.response.forEach((element) => {
          if (element.retorno.includes('OK')) {
            this.messageService.add({
              severity: 'success',
              summary: 'Nota emitida com sucesso',
              detail: 'Número da Nota: ' + element.numNfv,
              sticky: true,
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Nota não emitida',
              detail: element.retorno,
              sticky: true,
            });
          }
        });
      } else {
        if (this.retorno.includes('OK')) {
          this.messageService.add({
            severity: 'success',
            summary: 'Nota emitida com sucesso',
            detail: 'Número da Nota: ' + this.response.numNfv,
            sticky: true,
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Nota não emitida',
            detail: this.retorno,
            sticky: true,
          });
        }
      }
      this.labelButton = 'Confirmar';
      this.vp.overlay = false;
      this.table.clear();
      this.table.ngOnInit();
      this.input.clear();
    } catch (error) {
      this.labelButton = 'Confirmar';
      this.vp.overlay = false;
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: this.retorno,
        sticky: true,
      });
    }
  }
}
