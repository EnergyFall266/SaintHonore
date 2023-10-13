import { Injectable } from '@angular/core';
import { VP_BPM } from 'src/beans/VP_BPM';
import { environment } from 'src/environments/environment';
import * as gedf from 'prisma_prismafunctions';
import * as wsb from 'src/beans/WS_Beans';
import { ResponseLoadData } from 'src/beans/VP_BPM';
import { exportaG5 } from 'src/functions/WS_Axios';



@Injectable({
  providedIn: 'root'
})

export class AppService {
  constructor() { }

  async loadTipoDespesas() {
  const axios = require('axios');
  let data = JSON.stringify({
    "codEmp": ""
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://sh.prismainformatica.com.br:8181/SXI-API/G5Rest?server=https://localhost:8181&module=sapiens&service=com.prisma.dadosgerais&port=TipoDespesa',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer Svvdb7AJmQqYXZHhVnUdK3NJ1D7THHG6', 
      'Cookie': 'ASP.NET_SessionId=klagenaxhisjv1zgys0dq5qg'
    },
    data : data,
  };
  
  try {
    const response = await axios.request(config);
    
  return response.data.dadosGerais
    
  } catch (error: any) {
    console.log(error);
    ;
  }
  
  }

  async loadProdutosDeposito() {
    const axios = require('axios');
let data = JSON.stringify({
  "codEmp": "1"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://sh.prismainformatica.com.br:8181/SXI-API/G5Rest?server=https://localhost:8181&module=sapiens&service=com.prisma.dadosgerais&port=ConsultarProduto',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer Svvdb7AJmQqYXZHhVnUdK3NJ1D7THHG6', 
    'Cookie': 'ASP.NET_SessionId=klagenaxhisjv1zgys0dq5qg'
  },
  data : data
};

try {
  const response = await axios.request(config);
  
return response.data;

  
} catch (error: any) {
  console.log(error);
  ;
}
  }
}


