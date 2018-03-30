import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

// import 'rxjs/add/operator/map';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  usuario_id: string;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  logOut() {

    this.usuario = null;
    this.usuario_id = '';
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.usuario_id = id;
    this.token = token;
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario_id = localStorage.getItem('id');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario_id = '';
      this.usuario = null;
    }
  }

  loginGoogle( token: string ) {

    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
    .map( (resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario);
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
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return true;
    });

  }

  crearUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
    .map( (resp: any) => {
      swal('Usuario creado', usuario.email, 'success');
      return resp.usuario;
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
        this.guardarStorage(resp.usuario._id, this.token, resp.usuario);
      }

      swal('Usuario actualizado', usuario.nombre, 'success');
      return resp.usuario;
    });

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id)
    .then( (resp: any) => {

      this.usuario.img = resp.usuario.img;
      swal('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage( id, this.token, this.usuario );

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
