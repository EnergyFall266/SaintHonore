import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private sharedData: any[] = [];
  //usado pra passar os dados entre os componentes
  constructor() {}

  setInputs(data: any) {
    this.sharedData.push(data);
  }

  getInputs() {
    return this.sharedData;
  }
  updateInputs(data: any) {
    this.sharedData = data;
  }

  clearInputs() {
    this.sharedData = [];
  }
}
