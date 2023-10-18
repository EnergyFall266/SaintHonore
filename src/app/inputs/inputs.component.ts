import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MessageService } from 'primeng/api';
import { AppService } from '../app.service';
import { format } from 'date-fns';

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
  FecNot: string;
  PrcNfv: string;
  GerarDocumentoEletronico: string;
  IdentificacaoSistema: string;
  DadosGerais: dadosGerais;
}
interface dadosGerais {
  CodEmp: number;
  CodFil: number;
  CodSnf: string;
  NumNfv: string;
  TipNfs: number;
  CodEdc: string;
  TnsPro: string;
  DatEmi: string;
  CodCli: string;
  CodCpg: string;
  ObsNfv: string;
  Produtos: Produtos[];
}
interface Produtos {
  SeqIpv: number;
  TnsPro: string;
  FilPed: number;
  NumPed: number;
  SeqIpd: number;
  CodPro: string;
  CodDer: string;
  CodDep: string;
  QtdFat: string;
  PreUni: string;
  ObsIpv: string;
  CamposUsuario: CamposUsuario;
}
interface CamposUsuario {
  CmpUsu: string;
  VlrUsu: string;
}

@Component({
  selector: 'app-input',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
  providers: [MessageService],
})
export class InputComponent implements OnInit {
  Filial: string = '';
  Deposito: string = '';
  tipoBaixa: string = '';
  Produto: string = '';
  Quantidade: number = 0;
  Complemento: string = '';
  Titulo: string = 'Carregando dados...';
  baixa: any;
  produtos: any;
  filial: any;
  depositos: any;
  depositoFiltrado: any = [];
  boolDeposito: boolean = true;

  constructor(
    private dataService: DataService,
    private messageService: MessageService,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.importa();
  }
  async importa() {
    try {
      this.baixa = await this.appService.loadTipoDespesas();
      let ConsultarProduto = await this.appService.loadProdutosDeposito();
      this.produtos = ConsultarProduto.produtos;
      this.filial = ConsultarProduto.filial;
      this.depositos = ConsultarProduto.depositos;
      // console.log(this.produtos);
      // console.log(this.filial);
      // console.log(this.depositos);
      // console.log(ConsultarProduto);
      // console.log(this.baixa);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Dados carregados com sucesso',
      });
      this.Titulo = 'Baixa Especial de Estoque';
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error,
      });
    }
  }
  incluir() {
    // console.log(this.Filial);
    // console.log(this.Deposito);
    // console.log(this.tipoBaixa);
    // console.log(this.Produto);
    // console.log(this.Quantidade);
    // console.log(this.Complemento);

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
        detail: 'Preencha todos os campos!',
      });
    } else {
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

      let input: input = {
        Filial: this.Filial,
        codigo: produtoFiltrado.codPro,
        Deposito: this.Deposito,
        tipoBaixa: this.tipoBaixa,
        Produto: this.Produto,
        Quantidade: this.Quantidade,
        Complemento: this.Complemento,
        notaFiscal: {
          FecNot: '0',
          PrcNfv: '6',
          GerarDocumentoEletronico: '1',
          IdentificacaoSistema: 'Nota Não Fiscal - Baixa de Estoque',
          DadosGerais: {
            CodEmp: baixaFiltrada.codEmp,
            CodFil: filialFiltrada.codFil,
            CodSnf: baixaFiltrada.codSnf.toString(),
            NumNfv: '0',
            TipNfs: 1,
            CodEdc: '55',
            TnsPro: baixaFiltrada.codTns.toString(),
            DatEmi: format(new Date(), 'dd/MM/yyyy'),
            CodCli: baixaFiltrada.codCli.toString(),
            CodCpg: '001',
            ObsNfv: 'Nota Não Fiscal - Baixa de Estoque',
            Produtos: [
              {
                SeqIpv: 0,
                TnsPro: baixaFiltrada.codTns.toString(),
                FilPed: 0,
                NumPed: 0,
                SeqIpd: 0,
                CodPro: produtoFiltrado.codPro,
                CodDer: produtoFiltrado.codDer,
                CodDep: depositoFiltrado.codDep,
                QtdFat: this.Quantidade.toString(),
                PreUni: produtoFiltrado.preUni.toString(),
                ObsIpv: this.Complemento,
                CamposUsuario: {
                  CmpUsu: 'USU_' + baixaFiltrada.tipDes.toString(),
                  VlrUsu: baixaFiltrada.codTns.toString(),
                },
              },
            ],
          },
        },
      };
      this.dataService.setInputs(input);
    }
  }

  selecionaDesposito() {
    let codFil = this.filial.find(
      (objeto: { nomFil: string }) => objeto.nomFil === this.Filial
    );
    let prefixo = 'D0' + codFil.codFil;
    this.depositoFiltrado = this.depositos.filter(
      (objeto: { codDep: string }) => objeto.codDep.startsWith(prefixo)
    );
    this.boolDeposito = false;
    // console.log(this.depositoFiltrado);
  }

  clear() {
    this.Filial = '';
    this.Deposito = '';
    this.tipoBaixa = '';
    this.Produto = '';
    this.Quantidade = 0;
    this.Complemento = '';
  }
}
