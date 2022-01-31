import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    LoginRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [AlertService],
})
export class LoginModule {}
