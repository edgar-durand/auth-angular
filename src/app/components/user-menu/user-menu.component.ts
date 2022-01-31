import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  username = '';
  constructor(public authService: AuthService, private router: Router) {
  }
  handleProfile(): void {
    this.router.navigate(['laws/user/profile']);
  }
  logout(): void {
    this.authService.logout();
  }
}
