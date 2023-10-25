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
  fecNot: string;
  prcNfv: string;
  gerarDocumentoEletronico: string;
  identificacaoSistema: string;
  dadosGerais: dadosGerais [];
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
  load: boolean = true;

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
      this.load = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Dados Carregados',
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
          fecNot: '0',
          prcNfv: '6',
          gerarDocumentoEletronico: '1',
          identificacaoSistema: 'Nota Não Fiscal - Baixa de Estoque',
          dadosGerais: [{
            codEmp: baixaFiltrada.codEmp,
            codFil: filialFiltrada.codFil,
            codSnf: baixaFiltrada.codSnf.toString(),
            numNfv: '0',
            tipNfs: 1,
            codEdc: '55',
            // tnsPro: baixaFiltrada.codTns.toString(),
            tnsPro: '5949',
            datEmi: format(new Date(), 'dd/MM/yyyy'),
            codCli: baixaFiltrada.codCli.toString(),
            codCpg: '001',
            obsNfv: 'Nota Não Fiscal - Baixa de Estoque',
            produtos: [
              {
                seqIpv: 0,
                // tnsPro: baixaFiltrada.codTns.toString(),
                tnsPro: '5949',
                filPed: 0,
                numPed: 0,
                seqIpd: 0,
                codPro: produtoFiltrado.codPro,
                codDer: produtoFiltrado.codDer,
                codDep: depositoFiltrado.codDep,
                qtdFat: this.Quantidade.toString(),
                preUni: produtoFiltrado.preUni.toString(),
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
      console.log(input);
      
      this.dataService.setInputs(input);
    }
    console.log(this.dataService.getInputs());
    
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
