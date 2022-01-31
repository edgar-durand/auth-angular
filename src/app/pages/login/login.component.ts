import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { IUser } from '../../interfaces/user.model';
import { handleRejectionMessage } from '../../utils/handle-rejections';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  loginError = '';
  loginForm: FormGroup;
  loading = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public authService: AuthService,
    private alertService: AlertService,
  ) {
    this.loginForm = this.formBuilder.group({
      user: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }

    try {
      const response = await this.authService.login(
        this.loginForm.value.user,
        this.loginForm.value.password,
      );
      if (response.result === 'error') {
        this.loginError = response.data
          ? `${response.message}, ${response.data}`
          : response.message;
        this.alertService.alert(this.loginError);
      } else if (response.result === 'success') {
        this.alertService.alert(`Bienvenido ${this.loginForm.value.user}`);
        this.resetForm();
        this.router.navigate(['']);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      const errorProps = handleRejectionMessage(error);
      this.alertService.alert(`${errorProps.message} ${errorProps.data}`);
      this.loginForm.controls.password.reset();
      this.loginForm.clearValidators();
    }
  }

  resetForm(): void {
    this.loginForm.reset();
  }
  public hasError = (controlName: string, errorName: string): boolean => {
    return this.loginForm.get(controlName)?.hasError(errorName) ?? false;
  };

  ngOnInit(): void {
    document.body.classList.add('logged-out');
    const token = JSON.parse(<string>localStorage.getItem('USER_DATA'));
    if (token) {
      this.authService.initUser(token).then(() => this.router.navigate(['']));
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('logged-out');
  }

  ngAfterViewInit(): void {
  }
}
