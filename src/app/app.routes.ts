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
        path: 'requests',
        loadComponent: () =>
          import('./features/dashboard/requests/requests.component').then(m => m.RequestsComponent)
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/dashboard/events/events.component').then(m => m.EventsComponent)
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./features/dashboard/events/my-event/my-event.component').then(m => m.MyEventComponent)
      },
      {
        path: 'match/:eventId',
        loadComponent: () =>
          import('./features/dashboard/mate-detail/mate-detail.component').then(m => m.MateDetailComponent)
      },
    ]
  },
   {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/profile-view/profile-view.component').then(m => m.ProfileViewComponent)
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
