import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy{
  forgotForm: FormGroup;
  loading = false;
  forgotError = '';
  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    private alertService: AlertService,
  ) {
    this.forgotForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  async onSubmit(): Promise<any> {
    // stop here if form is invalid
    if (this.forgotForm.invalid) {
      return;
    }
    this.loading = true;
    const email = this.forgotForm.value.email;
    try {
      const response = await this.authService.resetPassword(email);
      if (response.result === 'error') {
        this.forgotError = response.message;
        this.alertService.alert(this.forgotError);
      } else if (response.result === 'success') {
        this.alertService.alert(response.message);
        history.back();
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  public hasError = (controlName: string, errorName: string): boolean => {
    return this.forgotForm.get(controlName)?.hasError(errorName) ?? false;
  };

  ngOnDestroy(): void {
    document.body.classList.remove('logged-out');
  }

  ngOnInit(): void {
    document.body.classList.add('logged-out');
  }
}
