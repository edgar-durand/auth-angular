import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColorPickerService {
  // Indica si el modo de selección de colorestá activado
  public activedSelectionMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  // Indica si la opción de highlight está activada
  public activedHighlightMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  // Guarda el color seleccionado para destacar el texto
  public selectedColor$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor() {}

  /**
   * Actualiza el color guardado en el servicio
   *
   * @param selected Color seleccionado
   */
  onSelectColor(selected: string): void {
    this.selectedColor$.next(selected);
    this.activedSelectionMode$.next(true);
  }

  resetColor(): void {
    this.selectedColor$.next(null);
    this.activedSelectionMode$.next(false);
    this.activedHighlightMode$.next(false);
  }
}
