import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private matSnackBar: MatSnackBar) {}

  alert(message: string, action = 'OK', duration = 2000): void {
    this.matSnackBar.open(message, action, {
      duration,
    });
  }
}
