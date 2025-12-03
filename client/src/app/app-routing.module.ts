import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstPageComponent } from './first-page/first-page.component';
import { AlreadyLoggedInGuard } from './guards/already-logged-in.guard';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [AlreadyLoggedInGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('./doctor/doctor.module').then((m) => m.DoctorModule),
  },
  { path: '', component: FirstPageComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
