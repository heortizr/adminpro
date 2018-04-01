import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Hospital } from '../../models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class HospitalService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarHospitales(desde: number = 0) {

    const url = URL_SERVICIOS + `/hospital?desde=${desde}`;
    return this.http.get( url );

  }

  obtenerHospital( id: string ) {

    const url = URL_SERVICIOS + `/hospital/${id}`;
    return this.http.get( url );

  }

  borrarHospital( id: string ) {

    const url = URL_SERVICIOS + `/hospital/${id}?token=${this._usuarioService.token}`;
    return this.http.delete( url )
    .map( resp => {
      swal('Hospital borrado', 'El hospital ha sido borrado exitosamente!', 'success');
      return true;
    });

  }

  crearHospital( nombre: string ) {

    const hospital = new Hospital( nombre );
    const url = URL_SERVICIOS + `/hospital?token=${this._usuarioService.token}`;
    return this.http.post( url, hospital );

  }

  buscarHospital( termino: string ) {

    const url = URL_SERVICIOS + `/busqueda/coleccion/hospital/${termino}`;
    console.log(url);
    return this.http.get( url )
    .map( (resp: any) => resp.hospital );

  }

  actualizarHospital( hospital: Hospital ) {

    const url = URL_SERVICIOS + `/hospital/${hospital._id}?token=${this._usuarioService.token}`;
    return this.http.put( url, hospital )
    .map( (resp: any) => {
      swal('Hospital actualizado', hospital.nombre, 'success');
      return resp.hospital;
    });

  }

}
