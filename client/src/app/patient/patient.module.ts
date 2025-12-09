import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientRoutingModule } from './patient-routing.module';
import { AppointmentComponent } from './components/appointment/appointment.component';



@NgModule({
  declarations: [
    SidebarComponent,
    DashboardComponent,
    AppointmentComponent
  ],
  imports: [
    CommonModule,
    PatientRoutingModule
  ]
})
export class PatientModule { }
