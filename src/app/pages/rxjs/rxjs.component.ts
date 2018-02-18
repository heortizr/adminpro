import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit {

  constructor() {


    this.regresaObs.retry(2).subscribe(
      numero => {
        console.log('subs: ', numero);
      }, error => {
        console.log('error', error);
      }, () => {
        console.log('termino');
      }
    );

  }

  ngOnInit() {
  }

  regresaObs() {

    return new Observable( oberserver => {

      let contador = 0;

      let intervalo = setInterval( () => {

        contador += 1;
        oberserver.next(contador);
        if ( contador === 3 ) {
          clearInterval(intervalo);
          oberserver.complete();
        }

        if ( contador === 2 ) {
          oberserver.error();
        }

      }, 1000);
    });

  }
}
