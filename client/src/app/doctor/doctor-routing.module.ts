import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RoleGuard } from '../guards/role.guard';
import { ScheduleComponent } from './components/schedule/schedule.component';

const routes: Routes = [
  {
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full'
},
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuard]
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: [RoleGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule {}
