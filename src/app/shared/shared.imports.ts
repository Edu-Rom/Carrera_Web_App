import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Elementos de angular material
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';

/* Formularios */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

/* =========================
   ngx-mask (inputs de código)
   ========================= */
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

/**
 * SHARED_IMPORTS
 * ---------------------------------------------------------
 * Colección de módulos/directivas reutilizables en
 * componentes standalone.
 *
 * Se importa así:
 * imports: [...SHARED_IMPORTS, HeaderApp, FooterApp]
 */
export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,

  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatCheckboxModule,

  /* Third-party */
  NgxMaskDirective,
  NgxMaskPipe,
]as const;
