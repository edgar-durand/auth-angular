import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { AuthService } from '../../services/auth.service';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  providers: [AuthService],
})
export class ForgotPasswordModule {}
