import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';
import {
  authGuardCanActivate,
  authGuardCanMatch,
} from './auth/guards/auth.guard';
import { publicGuardCanActivate, publicGuardCanMatch } from './auth/guards/public.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [publicGuardCanActivate],
    canMatch: [publicGuardCanMatch]
  },
  {
    path: 'heores',
    loadChildren: () =>
      import('./heroes/heroes.module').then((m) => m.HeroesModule),
    canActivate: [authGuardCanActivate],
    canMatch: [authGuardCanMatch],
  },
  {
    path: '404',
    component: NotFoundPageComponent,
  },
  {
    path: '',
    redirectTo: 'heores',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
