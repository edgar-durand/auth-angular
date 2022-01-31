import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  url = environment.apiBaseUrl;
  userImage: string | undefined = this.authService.currentUserValue?.img;
  showUploadBtn = false;

  formChangePassword: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
  ) {
    this.formChangePassword = this.formBuilder.group(
      {
        oldPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(25),
          ]),
        ],
        newPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(25),
          ]),
        ],
        confirm_password: ['', Validators.required],
      },
      { validator: this.checkPasswords },
    );
  }

  checkPasswords(group: FormGroup): any {
    const pass = group.controls.newPassword.value;
    const confirmPass = group.controls.confirm_password.value;

    return pass === confirmPass
      ? null
      : group.controls.confirm_password.setErrors({ notsame: true });
  }

  handleUpload(): void {
    if (this.userImage !== this.authService.currentUserValue?.img)
      this.authService.changeImage(<string>this.userImage).then((res) => {
        this.alertService.alert(res.message);
      });
    this.showUploadBtn = false;
  }

  handleSelect(event: any): void {
    const image = event.target?.files[0];
    if (image) {
      this.showUploadBtn = true;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        this.userImage = <string>reader.result;
      };
    } else {
      this.userImage = this.authService.currentUserValue?.img;
      this.showUploadBtn = false;
    }
  }

  changePassword(): void {
    if (this.formChangePassword.valid) {
      const oldPassword = this.formChangePassword.value.oldPassword;
      const newPassword = this.formChangePassword.value.newPassword;
      this.authService.changePassword(oldPassword, newPassword).then((res) => {
        if (res.result === 'success') {
          this.alertService.alert(res.message);
          this.formChangePassword.reset();
          this.formChangePassword.clearValidators();
        } else {
          this.alertService.alert(res.message);
        }
      });
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formChangePassword.get(controlName)?.hasError(errorName);
  };
}
