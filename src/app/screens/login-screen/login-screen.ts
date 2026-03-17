import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router } from '@angular/router';
import { ValidatorService } from '../../services/tools/validator-service';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
  ],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss',
})
export class LoginScreen implements OnInit {

  public username: string = "";
  public password: string = "";
  public errors:any = {};
  //Para la contraseña
  public hide_1: boolean = false;
  public inputType_1: string = 'password';

  constructor(
    private router: Router,
    private validatorService: ValidatorService
  ) { }

  ngOnInit(): void {
  }

  public showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public login(){
    this.errors = {};

    if (!this.username?.trim()) {
      this.errors.username = 'El correo electrónico es obligatorio.';
    } else if (!this.validatorService.noSpaces(this.username)) {
      this.errors.username = 'El correo electrónico no permite espacios.';
    } else if (!this.validatorService.email(this.username)) {
      this.errors.username = 'El correo electrónico no tiene un formato válido.';
    }

    if (!this.password?.trim()) {
      this.errors.password = 'La contraseña es obligatoria.';
    } else if (!this.validatorService.noSpaces(this.password)) {
      this.errors.password = 'La contraseña no permite espacios.';
    } else if (this.password.length < 6) {
      this.errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (Object.keys(this.errors).length > 0) return;

    this.router.navigate(['app', 'home']);
  }

  public recuperarPwd(){

  }

  public goRegistro(){
    this.router.navigate(["registro"]);
  }

  public onEmailInput(): void {
    this.username = (this.username ?? '').replace(/\s/g, '').toLowerCase();
  }

  public onPasswordInput(): void {
    this.password = (this.password ?? '').replace(/\s/g, '');
  }



}
