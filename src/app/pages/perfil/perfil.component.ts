import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario : string;
  roles : string[];
  constructor() { }

  ngOnInit() {
    const helper = new JwtHelperService();
    let access_token = sessionStorage.getItem(environment.TOKEN_NAME);
    let decodedToken = helper.decodeToken(access_token);
    console.log(decodedToken);
    this.usuario = decodedToken.user_name;
    this.roles = decodedToken.authorities;
  }

}
