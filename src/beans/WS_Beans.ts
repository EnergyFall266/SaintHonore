import { AxiosRequestConfig } from 'axios';

export const ws_beans_header: AxiosRequestConfig<string> = {
  headers: {
    encryptionType: '0',
    Authorization: '',
    'Content-Type': 'application/json',
  },
};

export interface G5Response {
  codRet?: number;
  msgRet?: string;
  qtdReg?: number;
  erroExecucao?: ErroExecucao;

  servicos?: Servicos[];

  errorType?: string;
  errorCode?: string;
  errorMessage?: string;
  stackTrace?: string;
}

export interface Servicos {
  codFam?: string
  codSer?: string
  codOri?: string
  desSer?: string
  desFam?: string
  cpfSer?: string
  desOri?: string
}


interface ErroExecucao {
  'xsi:nil': boolean;
  'xmlns:xsi': string;
}