import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorRoutingModule } from './doctor-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [DashboardComponent, ScheduleComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    DoctorRoutingModule,
    ReactiveFormsModule
  ]
})
export class DoctorModule {}
