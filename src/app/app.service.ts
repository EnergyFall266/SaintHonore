import { Injectable } from '@angular/core';
import { th } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  async loadTipoDespesas() {
    const axios = require('axios');
    let data = JSON.stringify({
      codEmp: '',
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sh.prismainformatica.com.br:8181/SXI-API/G5Rest?server=https://localhost:8181&module=sapiens&service=com.prisma.dadosgerais&port=TipoDespesa',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer HLYnlpeevIloZQlLszUQ2yGhignXF42g',
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
      url: 'https://sh.prismainformatica.com.br:8181/SXI-API/G5Rest?server=https://localhost:8181&module=sapiens&service=com.prisma.dadosgerais&port=ConsultarProduto',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer HLYnlpeevIloZQlLszUQ2yGhignXF42g',
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
}
