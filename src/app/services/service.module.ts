import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  SettingsService,
  SidebarService,
  SharedService,
  LoginGuardGuard,
  SubirArchivoService,
  HospitalService,
  MedicoService,
  ModalUploadService,
  AdminGuard,
  UsuarioService
} from './service.index';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    LoginGuardGuard,
    SubirArchivoService,
    UsuarioService,
    HospitalService,
    MedicoService,
    AdminGuard,
    ModalUploadService
  ],
  declarations: []
})
export class ServiceModule { }
