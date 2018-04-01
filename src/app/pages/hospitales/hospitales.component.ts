import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  cargando: boolean = false;
  hospitales: Hospital[] = [];
  totalRegistros: number = 0;
  desde: number = 0;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService,
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe( resp => {
      this.cargarHospitales();
    });
  }

  cargarHospitales() {

    this.cargando = true;

    this._hospitalService.cargarHospitales( this.desde )
    .subscribe( (resp: any) => {

      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;

    });

  }

  nuevoHospital() {
    swal('Nuevo Hospital', {
      content: 'input',
    })
    .then((value: string) => {

      if ( !value || value.length === 0 ) {
        return;
      }

      this._hospitalService.crearHospital( value )
      .subscribe( (resp: any) => {
        this.cargarHospitales();
      });
    });
  }

  cambiarDesde( valor: number ) {

    const nuevoDesde = this.desde + valor;

    if ( nuevoDesde >= this.totalRegistros ) {
      return;
    }

    if ( nuevoDesde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  borrarHospital( hospital: Hospital ) {

    swal({
      title: 'Esta seguro?',
      text: `Esta a punto de borrar ${hospital.nombre}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then( (borrar: any) => {
      if (borrar) {
        this._hospitalService.borrarHospital( hospital._id )
        .subscribe( (borrado: boolean) => {
          this.cargarHospitales();
        });
      }
    });

  }

  editarHospital( hospital: Hospital) {
    this._hospitalService.actualizarHospital( hospital )
    .subscribe();
  }

  mostrarModalImagen( id: string ) {
    this._modalUploadService.mostrarModal( 'hospitales', id );
  }

  buscarHospital( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospital( termino )
    .subscribe( (hospitales: Hospital[]) => {

      this.hospitales = hospitales;
      this.totalRegistros = hospitales.length;
      this.cargando = false;

    });

  }

}
