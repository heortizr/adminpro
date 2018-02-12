import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  progreso: number = 50;

  constructor() { }

  ngOnInit() {
  }

  cambiarValor( valor ) {

    if ( this.progreso >= 100 ) {
      return;
    }

    if ( this.progreso <= 0 ) {
      return;
    }

    this.progreso = this.progreso + valor;
  }

}
