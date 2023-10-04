import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sharedData: any[] = [];;
  
  constructor() { }

  setInputs(data: any) {
    this.sharedData.push(data);
  }

  getInputs() {
    return this.sharedData;
  }

}
