import { ActivatedRoute } from '@angular/router';
import { SignosService } from './../../_service/signos.service';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { Signos } from './../../_model/signos';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  cantidad: number = 0;
  dataSource: MatTableDataSource<Signos>;
  displayedColumns = ['idSignos', 'paciente', 'fecha', 'temperatura','pulso','ritmo_respiratorio','acciones'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //Cuando trabajar pageable no es necesario el MatPaginator con ViewChield

  constructor(private signosService : SignosService, private snack : MatSnackBar,public route: ActivatedRoute) { }

  ngOnInit() {
    this.signosService.signosCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signosService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.signosService.listarPageable(0, 10).subscribe(data => {
      //console.log(data);
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idPaciente: number) {
    this.signosService.eliminar(idPaciente).subscribe(() => {
      this.signosService.listar().subscribe(data => {
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next('SE ELIMINO');

      });
    });
  }

  mostrarMas(e: any){
    this.signosService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      console.log(data);
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });
  }

}
