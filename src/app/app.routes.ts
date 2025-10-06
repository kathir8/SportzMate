import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        // loadComponent: () =>
        //   import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'signup',
        component:SignupComponent,
        // loadComponent: () =>
        //   import('./features/auth/signup/signup.component').then(m => m.SignupComponent),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component:DashboardComponent
    // loadComponent: () =>
    //   import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
