import { PacienteService } from './../../../_service/paciente.service';
import { Observable } from 'rxjs';
import { Paciente } from './../../../_model/paciente';
import { Signos } from './../../../_model/signos';
import { SignosService } from './../../../_service/signos.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit} from '@angular/core';
import { map } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean = false;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  myControlPaciente: FormControl = new FormControl();

  pacienteSeleccionado: Paciente;

  pacientesFiltrados: Observable<any[]>;
  pacientes: Paciente[] = [];

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private signosService : SignosService,
    private pacienteService : PacienteService
  ) { }

  ngOnInit() {
    
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'paciente' : new FormControl(''),
      'fecha' : new FormControl(''),
      'temperatura': new FormControl(0),
      'pulso': new FormControl(0),
      'ritmoRespiratorio': new FormControl(0)
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
      
      this.listarPacientes();
      this.pacientesFiltrados = this.form.controls['paciente'].valueChanges.pipe(map(val => this.filtrarPacientes(val)));
  }


  initForm(){
    if(this.edicion){
      this.signosService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSignos),
          'paciente': new FormControl(data.paciente),
          'fecha': new FormControl(data.fecha),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmoRespiratorio': new FormControl(data.ritmoRespiratorio)
        });
        //almacenando el vaor de paiene obtenido
        this.pacienteSeleccionado = data.paciente;
      });
      this.listarPacientes();
      this.pacientesFiltrados = this.form.controls['paciente'].valueChanges.pipe(map(val => this.filtrarPacientes(val)));
    }
  }

  get f() { return this.form.controls; }

  operar(){

    //TE ASEGURAS QUE EL FORM ESTE VALIDO PARA PROSEGUIR
    if(this.form.invalid){
      return;
    }

    let signo = new Signos();
    signo.idSignos = this.form.value['id'];
    signo.paciente = this.form.value['paciente'];
    signo.fecha = this.form.value['fecha'];
    signo.temperatura = this.form.value['temperatura'];
    signo.pulso = this.form.value['pulso'];
    signo.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    //seteando el valor de paciente obtenido
    signo.paciente = this.pacienteSeleccionado;

    console.log(signo);

    if(this.edicion){
      //servicio de edicion
      this.signosService.modificar(signo).subscribe( () => {
        this.signosService.listar().subscribe(data => {
          this.signosService.signosCambio.next(data);
          this.signosService.mensajeCambio.next('SE MODIFICO');
        });
      });
    }else{
      //servicio de registro
      this.signosService.registrar(signo).subscribe( () => {
        this.signosService.listar().subscribe(data => {
          this.signosService.signosCambio.next(data);
          this.signosService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }
    this.router.navigate(['signos']);
  }

  mostrarPaciente(val : Paciente){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  filtrarPacientes(val : any){    
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

}
