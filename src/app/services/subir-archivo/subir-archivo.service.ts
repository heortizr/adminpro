import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable()
export class SubirArchivoService {

  constructor() { }

  subirArchivo( archivo: File, tipo: string, id: string ) {

    return new Promise( (resolve, reject) => {

      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      const url = URL_SERVICIOS + `/upload/${tipo}/${id}`;

      formData.append( 'imagen', archivo, archivo.name );

      xhr.onreadystatechange = function () {
        if ( xhr.readyState === 4 ) {
          if ( xhr.status === 200 ) {
            console.log('imagen subida');
            resolve( JSON.parse(xhr.response) );
          } else {
            console.log('fallo la subida');
            reject( JSON.parse(xhr.response) );
          }
        }
      };

      xhr.open('PUT', url, true);
      xhr.send( formData );
    });

  }
}
