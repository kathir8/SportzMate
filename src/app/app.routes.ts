import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'other-details',
    loadComponent: () =>
      import('./features/other-details/other-details.component').then(m => m.OtherDetailsComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/dashboard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./features/dashboard/chat/chat.component').then(m => m.ChatComponent)
      },
      {
        path: 'invites',
        loadComponent: () =>
          import('./features/dashboard/invites/invites.component').then(m => m.InvitesComponent)
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/dashboard/events/events.component').then(m => m.EventsComponent)
      },
      {
        path: 'mate-detail/:id',
        loadComponent: () =>
          import('./features/dashboard/home/mate-stuff/mate-detail/mate-detail.component').then(m => m.MateDetailComponent)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
