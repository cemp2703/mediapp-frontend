import { PacienteService } from './../../../../_service/paciente.service';
import { MatDialogRef } from '@angular/material';
import { Paciente } from './../../../../_model/paciente';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente : Paciente;
  pacientes : Paciente[] = [];

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    private pacienteService : PacienteService
    ) { }

  ngOnInit() {
    this.paciente = new Paciente();
  }

  operar() {
  this.pacienteService.registrar(this.paciente).subscribe((data) => {
    this.pacientes[0] = data;
    this.pacienteService.pacienteCambio.next(this.pacientes);
    this.pacienteService.mensajeCambio.next('SE REGISTRO');
  });

  this.dialogRef.close();
  }

  cancelar() {
    this.dialogRef.close();
  }

}
