import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router } from '@angular/router';
import { RegistroUser, UsuariosService } from '../../services/usuarios-service';

@Component({
  selector: 'app-registro-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-screen.html',
  styleUrl: './registro-screen.scss',
})
export class RegistroScreen implements OnInit {

  /* =========================
     Estado
     ========================= */
  public user: RegistroUser = {} as RegistroUser;
  public errors: any = {};
  public isLoading = false;

  /* Password */
  public hide_1 = true;
  public inputType_1: 'password' | 'text' = 'password';

  public hide_2 = true;
  public inputType_2: 'password' | 'text' = 'password';

  /* Edades */
  public edades: Array<{ value: number }> = [];
  public gradosEstudio: Array<{ value: string; label: string }> = [
    { value: 'Preparatoria', label: 'Preparatoria' },
    { value: 'Licenciatura', label: 'Licenciatura' },
    { value: 'Maestría', label: 'Maestría' },
    { value: 'Doctorado', label: 'Doctorado' },
  ];

  public estadosRepublica: string[] = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Ciudad de México',
    'Coahuila',
    'Colima',
    'Durango',
    'Estado de México',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
  ];

  constructor(
    private readonly router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    // Initialization logic here
    //Vincular el esquema de usuario del servicio para inicializar el objeto user con las propiedades necesarias para el formulario de registro.
    // Esto asegura que el objeto user tenga la estructura correcta y facilita la validación posterior.
    this.user = this.usuariosService.esquemaUser();

    // Se inia el array de edades para el select del formulario de registro.
    this.llenarArrayEdades();
  }

  private llenarArrayEdades(): void {
    // Igual a su lógica original (18..80)
    this.edades = Array.from({ length: 63 }, (_, i) => ({ value: i + 18 }));
  }

  public terminosCondiciones(): void {
    // Aquí puede abrir modal / navegar / etc.
    alert('Aquí se mostrarán los Términos y Condiciones.');
  }

  public registrar(): void {
    // Lógica de registro aquí
    if (this.isLoading) return;

    // 1) Validación centralizada en UsuariosService
    this.errors = this.usuariosService.validarUsuario(this.user);

    // 2) Sin jQuery: si hay errores, se detiene
    if (Object.keys(this.errors).length > 0) return;

    // 3) Registro
    this.isLoading = true;

    //TODO: Aquí se llamaría al método de registro del servicio, pasando el objeto user.
    //TODO: Luego, se manejaría la respuesta (éxito o error) para mostrar mensajes al usuario o navegar a otra pantalla.

  }

  public goLogin(): void {
    this.router.navigate(['']); // ajuste según su app
  }

  public showPassword(): void {
    this.hide_1 = !this.hide_1;
    this.inputType_1 = this.hide_1 ? 'password' : 'text';
  }

  public showConfirmPassword(): void {
    this.hide_2 = !this.hide_2;
    this.inputType_2 = this.hide_2 ? 'password' : 'text';
  }

  public onLettersInput(field: 'first_name' | 'last_name' | 'ciudad' | 'direccion'): void {
    const currentValue = this.user[field] ?? '';
    this.user[field] = currentValue
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z]/g, '');
  }

  public onAlphaNumericInput(field: 'user_id' | 'curp' | 'rfc'): void {
    const currentValue = this.user[field] ?? '';
    this.user[field] = currentValue.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  public onEmailInput(): void {
    this.user.email = (this.user.email ?? '').replace(/\s/g, '').toLowerCase();
  }

  public onPhoneInput(): void {
    this.user.telefono = (this.user.telefono ?? '').replace(/\D/g, '').slice(0, 10);
  }

  public onPasswordInput(field: 'password' | 'confirm_password'): void {
    this.user[field] = (this.user[field] ?? '').replace(/\s/g, '');
  }

}
