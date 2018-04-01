import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  totalRegistros: number = 0;
  cargando: boolean = false;

  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  nuevoMedico() {

  }

  borrarMedico( medico: Medico) {

    this._medicoService.borrarMedico( medico._id )
    .subscribe( resp => this.cargarMedicos() );

  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos()
    .subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.medicos = resp.medicos;
      this.cargando = false;
    });
  }

  buscarMedico( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;
    this._medicoService.buscarMedicos( termino )
    .subscribe( (medicos: Medico[]) => {
      this.medicos = medicos;
      this.totalRegistros = medicos.length;
      this.cargando = false;
    });
  }

}
