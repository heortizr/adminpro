import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

@Injectable()
export class MedicoService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos() {
    const url = URL_SERVICIOS + `/medico`;
    return this.http.get( url );
  }

  buscarMedicos( termino: string ) {
    const url = URL_SERVICIOS + `/busqueda/coleccion/medico/${termino}`;
    return this.http.get( url )
    .map( (resp: any) => resp.medico );
  }

  cargarMedico( id: string ) {

    const url = URL_SERVICIOS + `/medico/${id}`;
    return this.http.get( url )
    .map( (resp: any) => resp.medico );

  }

  borrarMedico( id: string ) {
    const url = URL_SERVICIOS + `/medico/${id}?token=${this._usuarioService.token}`;
    return this.http.delete( url )
    .map( resp => {
      swal('Medico borrado', 'El Medico ha sido eliminado correctamente', 'success');
      return true;
    });
  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + `/medico`;

    if ( medico._id ) {

      // actualizar
      url += `/${medico._id}?token=${this._usuarioService.token}`;
      return this.http.put( url, medico )
      .map( (resp: any) => {
        swal('Medico actualizado', resp.medico.nombre, 'success');
        return resp.medico;
      });

    } else {

      // nuevo
      url += `?token=${this._usuarioService.token}`;
      return this.http.post( url, medico )
      .map( (resp: any) => {
        swal('Medico creado', resp.medico.nombre, 'success');
        return resp.medico;
      });

    }

  }

}
