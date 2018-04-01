import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HospitalService, MedicoService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[];
  medico = new Medico('', '', '', '', '');
  hospital = new Hospital('');

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService,
    public router: Router
  ) {

    activatedRoute.params.subscribe( params => {
      const id = params['id'];
      if ( id !== 'nuevo' ) {
        this.cargarMedico( id );
      }
    });

  }

  ngOnInit() {

    this._hospitalService.cargarHospitales()
    .subscribe( (resp: any) => this.hospitales = resp.hospitales );

    this._modalUploadService.notificacion
    .subscribe( resp => {
      this.medico.img = resp.medico.img;
    });

  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal( 'medicos', this.medico._id);
  }

  cargarMedico( id: string ) {
    this._medicoService.cargarMedico( id )
    .subscribe( (medico: Medico) => {
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      this.cambioHospital( this.medico.hospital );
    });
  }

  guardarMedico( f: NgForm ) {

    this._medicoService.guardarMedico( this.medico )
    .subscribe( (resp: Medico) => {
      this.medico = resp;
      this.router.navigate(['/medico', resp._id]);
    });

  }

  cambioHospital( id: string ) {

    this._hospitalService.obtenerHospital( id )
    .subscribe( (resp: any) => this.hospital = resp.hospital );

  }

}
