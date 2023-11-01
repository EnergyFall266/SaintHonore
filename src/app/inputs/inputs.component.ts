import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MessageService } from 'primeng/api';
import { AppService } from '../../services/app.service';
import { format } from 'date-fns';
import { VP_BPM } from 'src/beans/VP_BPM';
import { ws_beans_header } from 'src/beans/WS_Beans';
import { Table } from 'primeng/table';

interface input {
  Filial: string;
  codigo: string;
  Deposito: string;
  tipoBaixa: string;
  Produto: string;
  Quantidade: number;
  Complemento: string;
  notaFiscal: notaFiscal;
}
interface notaFiscal {
  fecNot: string;
  prcNfv: string;
  gerarDocumentoEletronico: string;
  identificacaoSistema: string;
  dadosGerais: dadosGerais[];
}
interface dadosGerais {
  codEmp: number;
  codFil: number;
  codSnf: string;
  numNfv: string;
  tipNfs: number;
  codEdc: string;
  tnsPro: string;
  datEmi: string;
  codCli: string;
  codCpg: string;
  obsNfv: string;
  produtos: Produtos[];
}
interface Produtos {
  seqIpv: number;
  tnsPro: string;
  filPed: number;
  numPed: number;
  seqIpd: number;
  codPro: string;
  codDer: string;
  codDep: string;
  qtdFat: string;
  preUni: string;
  obsIpv: string;
  camposUsuario: CamposUsuario;
}
interface CamposUsuario {
  cmpUsu: string;
  vlrUsu: string;
}


@Component({
  selector: 'app-input',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
  providers: [MessageService],
})
export class InputComponent {
  @Input() vp!: VP_BPM;
  Filial: string = '';
  Deposito: string = '';
  tipoBaixa: string = '';
  Produto: string = '';
  Quantidade: number = 0;
  Complemento: string = '';
  baixa: any;
  produtos: any;
  filial: any;
  depositos: any;
  depositoFiltrado: any = [];
  boolDeposito: boolean = true;
  visible: boolean = false;
  @ViewChild('table') table: Table | undefined;

  first: number = 0;

    rows: number = 10;
  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private appService: AppService
  ) {
    //pega o token do usuario
    this.appService.acao$.subscribe((retorno) => {
      if (retorno) {
        this.vp.token = retorno;
        this.importa();
      } else {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possivel obter o usuário Token',
        });
      }
    });
  }

  async importa() {
    try {
      this.baixa = await this.appService.loadTipoDespesas();
      let ConsultarProduto = await this.appService.loadProdutosDeposito();
      this.produtos = ConsultarProduto.produtos;
      this.filial = ConsultarProduto.filial;
      this.depositos = ConsultarProduto.depositos;
      this.vp.overlay = false;
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error,
      });
    }
  }
  incluir() {
    if (
      this.Filial === '' ||
      this.Deposito === '' ||
      this.Deposito === null ||
      this.tipoBaixa === '' ||
      this.Produto === '' ||
      this.Quantidade === 0 ||
      this.Quantidade === null
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios!',
      });
    } else {
      //filtra os dados de acordo com o que foi selecionado
      const produtoFiltrado: any = this.produtos.find(
        (objeto: { desPro: string }) => objeto.desPro === this.Produto
      );
      const baixaFiltrada: any = this.baixa.find(
        (objeto: { desDes: string }) => objeto.desDes === this.tipoBaixa
      );
      const depositoFiltrado: any = this.depositoFiltrado.find(
        (objeto: { desDep: string }) => objeto.desDep === this.Deposito
      );
      const filialFiltrada: any = this.filial.find(
        (objeto: { nomFil: string }) => objeto.nomFil === this.Filial
      );
      //preenche o objeto input com os dados
      let input: input = {
        Filial: this.Filial,
        codigo: produtoFiltrado.codPro,
        Deposito: this.Deposito,
        tipoBaixa: this.tipoBaixa,
        Produto: this.Produto,
        Quantidade: this.Quantidade,
        Complemento: this.Complemento,
        notaFiscal: {
          fecNot: '0',
          prcNfv: '6',
          gerarDocumentoEletronico: '1',
          identificacaoSistema: 'Nota Não Fiscal - Baixa de Estoque',
          dadosGerais: [
            {
              codEmp: baixaFiltrada.codEmp,
              codFil: filialFiltrada.codFil,
              codSnf: baixaFiltrada.codSnf.toString(),
              numNfv: '0',
              tipNfs: 1,
              codEdc: '55',
              tnsPro: baixaFiltrada.codTns.toString(),
              datEmi: format(new Date(), 'dd/MM/yyyy'),
              codCli: baixaFiltrada.codCli.toString(),
              codCpg: '001',
              obsNfv: 'Nota Não Fiscal - Baixa de Estoque',
              produtos: [
                {
                  seqIpv: 0,
                  tnsPro: baixaFiltrada.codTns.toString(),
                  filPed: 0,
                  numPed: 0,
                  seqIpd: 0,
                  codPro: produtoFiltrado.codPro,
                  codDer: produtoFiltrado.codDer,
                  codDep: depositoFiltrado.codDep,
                  qtdFat: this.Quantidade.toString(),
                  preUni:
                    produtoFiltrado.preUni.toString() === '0'
                      ? '1'
                      : produtoFiltrado.preUni.toString(),
                  obsIpv: this.Complemento,
                  camposUsuario: {
                    cmpUsu: 'USU_TipDes',
                    vlrUsu: baixaFiltrada.tipDes.toString(),
                  },
                },
              ],
            },
          ],
        },
      };

      this.dataService.setInputs(input);
    }
  }
  //filtra o deposito de acordo com a filial selecionada
  selecionaDesposito() {
    let codFil = this.filial.find(
      (objeto: { nomFil: string }) => objeto.nomFil === this.Filial
    );
    let prefixo = 'D0' + codFil.codFil;
    this.depositoFiltrado = this.depositos.filter(
      (objeto: { codDep: string }) => objeto.codDep.startsWith(prefixo)
    );
    this.boolDeposito = false;
  }

  clear() {
    this.Filial = '';
    this.Deposito = '';
    this.boolDeposito = true;
    this.tipoBaixa = '';
    this.Produto = '';
    this.Quantidade = 0;
    this.Complemento = '';
  }

  selecionaProduto() {
    this.visible = true;
  }
  

  onPageChange(event:any) {
    this.first = event.first;
    this.rows = event.rows;
}
clearProduto(table: Table, input:any) {
  table.clear();
  input.value = '';
}
}
