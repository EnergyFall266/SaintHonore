import { Injectable } from '@angular/core';
import { th } from 'date-fns/locale';
import { Subject } from 'rxjs';
import { VP_BPM } from 'src/beans/VP_BPM';
import { user } from '@seniorsistemas/senior-platform-data';
import { ws_beans_header } from 'src/beans/WS_Beans';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private capturaAcao = new Subject<string>();
  acao$ = this.capturaAcao.asObservable();
  private token: any;

  public vp: VP_BPM = new VP_BPM();
  usuario: any;
  constructor() {
    //pegar o token do usuário
    user
      .getToken()
      .then((retorno) => {
        this.token = retorno;

        const user = this.token.username.split('@');
        this.usuario = user[0];
        this.capturaAcao.next(this.token.access_token);
      })
      .catch((error) => {
        alert(
          'Não foi possível obter token. Verifique se a tela está sendo acessada pela plataforma Senior X.'
        );
      });
  }

  async loadTipoDespesas() {
    const axios = require('axios');
    let data = JSON.stringify({
      codEmp: '',
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sh.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.dadosgerais&port=TipoDespesa',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + this.token.access_token,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);

      return response.data.dadosGerais;
    } catch (error: any) {
      throw error;
    }
  }

  async loadProdutosDeposito() {
    const axios = require('axios');
    let data = JSON.stringify({
      codEmp: '1',
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sh.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.prisma.dadosgerais&port=ConsultarProduto',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + this.token.access_token,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  async gerarNota(body: any) {
    const axios = require('axios');
    let data = JSON.stringify(body);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sh.prismainformatica.com.br:8181/SXI/G5Rest?server=http://localhost:8080&module=sapiens&service=com.senior.g5.co.mcm.ven.notafiscal&port=GravarNotasFiscaisSaida_13',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + this.token.access_token,
      },
      data: data,
    };
    try {
      const response = await axios.request(config);

      return response.data.retornosNotasSaida;
    } catch (error: any) {
      throw error;
    }
  }
}
