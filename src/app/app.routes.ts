import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/home',
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
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/other-details/other-details.component').then(m => m.OtherDetailsComponent)
  },
  {
    path: 'dashboard',
    // canActivate: [AuthGuard],
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
        path: 'chat-list',
        loadComponent: () =>
          import('./features/dashboard/chat-list/chat-list.component').then(m => m.ChatListComponent)
      },
      {
        path: 'chat/:id',
        loadComponent: () =>
          import('./features/dashboard/chat-list/chat/chat.component').then(m => m.ChatComponent)
      },
      {
        path: 'invites',
        loadComponent: () =>
          import('./features/dashboard/invites/invites.component').then(m => m.InvitesComponent)
      },
      {
        path: 'invites/group/:id',
        loadComponent: () =>
          import('./features/dashboard/invites/my-group-list/group-invite/group-invite.component').then(m => m.GroupInviteComponent)
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/dashboard/events/events.component').then(m => m.EventsComponent)
      },
      {
        path: 'mate-detail/:id',
        loadComponent: () =>
          import('./features/dashboard/home/mate-stuff/mate-detail-container/mate-detail-container.component').then(m => m.MateDetailContainerComponent)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
