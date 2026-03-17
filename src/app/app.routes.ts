import { Routes } from '@angular/router';
import { LoginScreen } from './screens/login-screen/login-screen';
import { RegistroScreen } from './screens/registro-screen/registro-screen';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./screens/login-screen/login-screen').then(m => m.LoginScreen),
  },
  {
    path: 'registro',
    loadComponent: () => import('./screens/registro-screen/registro-screen').then(m => m.RegistroScreen),
  },
];
