import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import swal from 'sweetalert';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  usuario_id: string;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  renuevaToken() {

    const url = URL_SERVICIOS + `/login/renuevatoken?token=${this.token}`;
    return this.http.post( url, null )
    .map( (resp: any) => {
      this.token = resp.token;
      localStorage.setItem('token', this.token);
      return true;
    })
    .catch( err => {
      this.router.navigate(['/login']);
      swal('No se pudo renovar el token', 'No fue posible renovar el usuario', 'error');
      return Observable.throw( err );
    });

  }

  logOut() {

    this.usuario = null;
    this.usuario_id = '';
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.usuario_id = id;
    this.token = token;
    this.menu = menu;
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario_id = localStorage.getItem('id');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario_id = '';
      this.usuario = null;
      this.menu = null;
    }
  }

  loginGoogle( token: string ) {

    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
    .map( (resp: any) => {
      console.log('===================================');
      console.log(resp);
      console.log('===================================');
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    });

  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario)
    .map( (resp: any) => {
      this.guardarStorage(
        resp.id,
        resp.token,
        resp.usuario,
        resp.menu
      );
      return true;
    })
    .catch( err => {
      swal('Error en el login', err.error.message, 'error');
      return Observable.throw( err );
    });

  }

  crearUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
    .map( (resp: any) => {
      swal('Usuario creado', usuario.email, 'success');
      return resp.usuario;
    })
    .catch( err => {
      console.log(err);
      swal(err.error.message, err.error.errs.message, 'error');
      return Observable.throw( err );
    });

  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
    .map( (resp: any) => {

      // solamente se actualiza el storage si es el
      // usuario logueago quien se modifica, es decir
      // si se ha modificado el perfil
      if ( usuario._id === this.usuario._id ) {
        this.guardarStorage(resp.usuario._id, this.token, resp.usuario, this.menu);
      }

      swal('Usuario actualizado', usuario.nombre, 'success');
      return resp.usuario;
    })
    .catch( err => {
      console.log(err);
      swal(err.error.message, err.error.errs.message, 'error');
      return Observable.throw( err );
    });

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id)
    .then( (resp: any) => {

      this.usuario.img = resp.usuario.img;
      swal('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage( id, this.token, this.usuario, this.menu);

    })
    .catch(resp => {
      console.log(resp);
    });
  }

  cargarUsuarios( desde: number = 0 ) {

    const url = URL_SERVICIOS + `/usuario?desde=${desde}`;
    return this.http.get( url );

  }

  buscarUsuarios( termino: string ) {

    const url = URL_SERVICIOS + `/busqueda/coleccion/usuario/${termino}`;
    return this.http.get( url )
    .map( (resp: any) => resp.usuario );

  }

  borrarUsuario(id: string) {

    const url = URL_SERVICIOS + `/usuario/${id}?token=${this.token}`;
    return this.http.delete( url )
    .map( resp => {
      swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
      return true;
    });

  }
}
