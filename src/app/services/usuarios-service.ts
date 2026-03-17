import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator-service';
import { ErrorsService } from './tools/errors-service';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegistroUser {
  first_name: string;
  last_name: string;
  user_id: string;
  email: string;
  password: string;
  confirm_password: string;
  curp: string;
  rfc: string;
  grado_estudios: string;
  direccion: string;
  estado: string;
  telefono: string;
  ciudad: string;
  edad: number | null;
  terminos_condiciones: boolean;
}

export interface PerfilUsuarioUI {
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  estado: string;
  ciudad: string;
  edad: number | null;

  // extras para UI
  codigo?: string;
  fecha_registro?: string; // ISO
  photoUrl?: string;
  rolEtiqueta?: string; // ej. "DOCENTE BUAP"
}

export type RegistroErrors = Partial<Record<keyof RegistroUser, string>>;

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  constructor(
    private readonly http: HttpClient,
    private validadorService: ValidatorService,
    private errorsService: ErrorsService
  ) {}

  /* =========================================================
     1) ESQUEMA (modelo base)
     ========================================================= */
  public esquemaUser(): RegistroUser {
    return {
      first_name: '',
      last_name: '',
      user_id: '',
      email: '',
      password: '',
      confirm_password: '',
      curp: '',
      rfc: '',
      grado_estudios: '',
      direccion: '',
      estado: '',
      telefono: '',
      ciudad: '',
      edad: null,
      terminos_condiciones: false
    };
  }

  /* =========================================================
     2) VALIDACIÓN (centralizada)
     ========================================================= */

  public validarUsuario(user: RegistroUser): RegistroErrors {
    const errors: RegistroErrors = {};

    if (!user.first_name?.trim()) {
      errors.first_name = 'El nombre es obligatorio.';
    } else if (!this.validadorService.lettersNoSpaces(user.first_name)) {
      errors.first_name = 'El nombre solo permite letras sin espacios.';
    }

    if (!user.last_name?.trim()) {
      errors.last_name = 'Los apellidos son obligatorios.';
    } else if (!this.validadorService.lettersNoSpaces(user.last_name)) {
      errors.last_name = 'Los apellidos solo permiten letras sin espacios.';
    }

    if (!user.user_id?.trim()) {
      errors.user_id = 'El ID de usuario es obligatorio.';
    } else if (!this.validadorService.alphanumericNoSpaces(user.user_id)) {
      errors.user_id = 'El ID de usuario solo permite letras y números, sin espacios.';
    } else if (!this.validadorService.lenBetween(user.user_id, 8, 8)) {
      errors.user_id = 'El ID de usuario debe tener exactamente 8 caracteres.';
    }

    if (!user.email?.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!this.validadorService.noSpaces(user.email)) {
      errors.email = 'El correo electrónico no permite espacios.';
    } else if (!this.validadorService.email(user.email)) {
      errors.email = 'El correo electrónico no tiene un formato válido.';
    }

    if (!user.password?.trim()) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (!this.validadorService.noSpaces(user.password)) {
      errors.password = 'La contraseña no permite espacios.';
    } else if (user.password.trim().length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (!user.confirm_password?.trim()) {
      errors.confirm_password = 'Debe confirmar la contraseña.';
    } else if (user.confirm_password !== user.password) {
      errors.confirm_password = 'Las contraseñas no coinciden.';
    }

    if (!user.curp?.trim()) {
      errors.curp = 'La CURP es obligatoria.';
    } else if (!this.validadorService.alphanumericNoSpaces(user.curp)) {
      errors.curp = 'La CURP solo permite letras y números, sin espacios.';
    } else if (!this.validadorService.curp(user.curp)) {
      errors.curp = 'La CURP no tiene un formato válido.';
    }

    if (!user.rfc?.trim()) {
      errors.rfc = 'El RFC es obligatorio.';
    } else if (!this.validadorService.alphanumericNoSpaces(user.rfc)) {
      errors.rfc = 'El RFC solo permite letras y números, sin espacios.';
    } else if (!this.validadorService.rfc(user.rfc)) {
      errors.rfc = 'El RFC no tiene un formato válido.';
    }

    if (!user.grado_estudios?.trim()) {
      errors.grado_estudios = 'Seleccione un grado de estudios.';
    }

    if (!user.direccion?.trim()) {
      errors.direccion = 'La dirección es obligatoria.';
    } else if (!this.validadorService.lettersNoSpaces(user.direccion)) {
      errors.direccion = 'La dirección solo permite letras sin espacios.';
    }

    if (!user.estado?.trim()) {
      errors.estado = 'Seleccione un estado.';
    }

    if (!user.telefono?.trim()) {
      errors.telefono = 'El teléfono es obligatorio.';
    } else if (!this.validadorService.noSpaces(user.telefono)) {
      errors.telefono = 'El teléfono no permite espacios.';
    } else if (!this.validadorService.phoneMX(user.telefono)) {
      errors.telefono = 'El teléfono debe contener 10 dígitos.';
    }

    if (!user.ciudad?.trim()) {
      errors.ciudad = 'La ciudad es obligatoria.';
    } else if (!this.validadorService.lettersNoSpaces(user.ciudad)) {
      errors.ciudad = 'La ciudad solo permite letras sin espacios.';
    }

    if (user.edad === null || user.edad === undefined) {
      errors.edad = 'Seleccione una edad.';
    }

    // Importante: esta validación la pide su UI
    if (!user.terminos_condiciones) {
      errors.terminos_condiciones = 'Debe aceptar los términos y condiciones.';
    }
    return errors;
  }

  /* =========================================================
     3) HTTP: REGISTRO DE USUARIO
     - Registro va aquí (no en Facade)
     - Tipado: recibe RegistroUser
     - Devuelve Observable para usar subscribe()
     ========================================================= */

  public registrarUser(user: RegistroUser): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${environment.url_api}/users/`, user, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Ajuste fino según cómo responda su API
          const message =
            (typeof error.error === 'string' ? error.error : error.error?.message) ||
            error.message ||
            'No se pudo registrar el usuario.';

          return throwError(() => new Error(message));
        })
      );
  }

  /* =========================================================
     4) UI: PERFIL DUMMY (solo maquetación)
     ========================================================= */
  public getPerfilDummy(): PerfilUsuarioUI {
    return {
      first_name: 'Luis Yael',
      last_name: 'Méndez Sánchez',
      email: 'luis.mendezsanchez@correo.buap.mx',
      telefono: '2211908923',
      estado: 'Puebla',
      ciudad: 'Puebla',
      edad: 30,

      codigo: 'CARDUC-2026-LYMS-001',
      fecha_registro: '2026-02-09T12:00:00.000Z',
      photoUrl: 'assets/images/avatar.png',
      rolEtiqueta: 'DOCENTE BUAP',
    };
  }
}
