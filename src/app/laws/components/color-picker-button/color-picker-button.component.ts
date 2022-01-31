import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ColorPickerDirective } from 'ngx-color-picker';
import { of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ColorPickerService } from 'src/app/services/color-picker.service';

@Component({
  selector: 'app-color-picker-button',
  templateUrl: './color-picker-button.component.html',
  styleUrls: ['./color-picker-button.component.scss'],
})
export class ColorPickerButtonComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void> = new Subject<void>();
  // Clase css para mostrar activado o desactivado el botón
  activeClass$ = of('');

  @ViewChild(ColorPickerDirective)
  colorPicker: ColorPickerDirective | null = null;

  currentColor!: string;

  constructor(public colorPickerService: ColorPickerService) {}

  ngOnInit(): void {
    this.activeClass$ = this.colorPickerService.activedSelectionMode$.pipe(
      map((active: boolean) =>
        active ? 'color-picker-button active' : 'color-picker-button',
      ),
    );
    this.colorPickerService.selectedColor$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((color) => {
        if (color) {
          this.currentColor = color;
        } else {
          this.currentColor = '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }

  /**
   * Emite un evento donde el payload es el color seleccionado
   *
   * @param selected Color seleccionado
   */
  onSelectColor(selected: string): void {
    this.colorPickerService.onSelectColor(selected);
    this.colorPickerService.activedSelectionMode$.next(false);
    this.colorPickerService.activedHighlightMode$.next(true);
  }

  /**
   * resetear si se cancela
   */
  onCancel(): void {
    this.colorPickerService.resetColor();
  }

  /**
   * Muestra el dialogo de los colores
   */
  openColorPicker(): void {
    this.colorPicker?.openDialog();
  }
}
