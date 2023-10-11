import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  mostrarOverlay: boolean = false;
  constructor(private dataService: DataService) {}
  confirmacao() {
    this.mostrarOverlay = true;
  }
  emitirNota(){

    console.log(this.dataService.getInputs());
    
  }
}
