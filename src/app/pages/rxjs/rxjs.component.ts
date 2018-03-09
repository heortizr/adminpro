import { Component, OnInit, OnDestroy } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    this.subscription = this.regresaObservable().subscribe(
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( observer => {
      let contador = 0;
      const intervalo = setInterval( () => {

        contador += 1;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        // if ( contador === 3 ) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // if ( contador === 2 ) {
        //   observer.error();
        // }

      }, 500);
    })
    .retry(2)
    .map( (respuesta: any) => {
      return respuesta.valor;
    })
    .filter( (valor, index) => {
      if ( (valor % 2) === 1 ) {
        // impar
        return true;
      } else {
        // par
        return false;
      }
    });
  }
}
