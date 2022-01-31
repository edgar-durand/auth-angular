import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Highlight } from 'src/app/models/highlight.interface';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { CommentService } from './comment.service';

@Injectable({
  providedIn: 'root',
})
export class HighlightTextService {
  // Listado de leyes
  highlights$: BehaviorSubject<Highlight[]> = new BehaviorSubject<Highlight[]>(
    [],
  );
  public isEraseSectionOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  // Url base para consumir los enpoints de los textos seleccionados de la API
  highlightsBaseUrl = `/api/highlights`;

  // Tag html con el que se va a envolver (wrap) las selecciones
  highlightWrapperTag = 'span';

  constructor(
    private apiService: ApiService,
    private commentService: CommentService,
  ) {}

  /**
   * Carga todos los textos seleccionados y actualiza el listado (BehaviorSubject)
   */
  async init(): Promise<void> {
    this.highlights$.next(await this.findAllHighlights().toPromise());
  }

  toggleEraseSectionOpen(): void {
    this.isEraseSectionOpen$.next(!this.isEraseSectionOpen$.value);
  }
  /**
   * Devuelve el listado de todos los textos seleccionados
   */
  findAllHighlights(): Observable<Highlight[]> {
    return this.apiService.get<Highlight[]>(this.highlightsBaseUrl);
  }

  /**
   * Devuelve el rango con las posiciones relativas al elemento raíz del componente
   *
   * @param selection Rango a analizar
   */
  getRootRelativeRange(selection: Highlight) {
    return {
      ...selection,
      start: Math.min(selection.start, selection.end),
      end: Math.max(selection.start, selection.end),
    };
  }

  /**
   * Devuelve un texto con parte de él destacado. Pone color de fondo a parte del texto que comprende
   * el rango especificado
   *
   * @param text Texto completo que contiene la información a destacar
   * @param selections Listado de rangos a resaltar
   * @param currentHighLigth
   */
  highlightText(
    text: string,
    selections: Highlight[],
    currentHighLigth: string | undefined,
  ): string {
    // Se itera por las selecciones ordenas para modificar el texto dado desde atrás hacia delante y
    // así las posiciones
    return this.sortSelections(selections)
      .reduce(
      (htmlText: string, { id, start, end, color }: Highlight) => {
        if (id === currentHighLigth)
          this.commentService.isCommentSectionOpen$.next(true);
        const highLightSelectedStyle =
          id === currentHighLigth ? 'text-decoration: underline;' : '';
        const highlighted = `<${
          this.highlightWrapperTag
        } style="background-color: ${color}; ${highLightSelectedStyle}">${htmlText.substring(
          start,
          end,
        )}</${this.highlightWrapperTag}>`;

        return `${text.substring(0, start)}${highlighted}${htmlText.substring(
          end,
        )}`;
      },
      text,
    );
  }

  /**
   * Guarda el texto subrayado en la base de datos
   *
   * @param highligthText Texto subrayado
   */
  saveHighlightText(highligthText: Highlight): Observable<Highlight[]> {
    return this.apiService.post<Highlight[]>(
      this.highlightsBaseUrl,
      highligthText,
    );
  }

  /**
   * Devuelve el arreglo del rangos ordenados de forma desendente por la posición inicial
   *
   * @param selections Listado de rangos
   */
  sortSelections(selections: Highlight[]) {
    return selections.sort((sr1: Highlight, sr2: Highlight) =>
      sr1.start < sr2.start ? 1 : -1,
    );
  }

  checkIfHighlightIsClicked(
    highlights: Highlight[],
    position: number,
  ): Highlight | undefined {
    return highlights.find((h) => {
      return h.start <= position && h.end >= position;
    });
  }

  async destroyHighlightText(id: string): Promise<void> {
    try {
      const url = `${this.highlightsBaseUrl}/${id}`;
      await this.apiService.delete<string>(url).toPromise();
      const highlightOld = [...this.highlights$.value];
      this.highlights$.next(
        highlightOld.filter((highlight) => highlight.id !== id),
      );
    } catch (error) {
      throw new Error(`Error ${error}`);
    }
  }
}
