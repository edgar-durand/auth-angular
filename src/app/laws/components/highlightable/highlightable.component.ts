import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';

import { ColorPickerService } from 'src/app/services/color-picker.service';
import { Highlight } from 'src/app/models/highlight.interface';
import { HighlightTextService } from 'src/app/services/highlight-text.service';
import { CommentService } from '../../../services/comment.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-highlightable',
  templateUrl: './highlightable.component.html',
  styleUrls: ['./highlightable.component.scss'],
})
export class HighlightableComponent implements OnInit, OnChanges, OnDestroy {
  // Texto con subcadenas sobresaltadas
  highlightedValue$: BehaviorSubject<SafeHtml> = new BehaviorSubject<SafeHtml>(
    '',
  );
  public isEraseSectionOpen = false;
  /* currentHighLight$: BehaviorSubject<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined); */
  public currentHighLight: string | undefined;

  seleccionados: Highlight[] = [];
  // Texto original de entrada
  @Input() text = '';
  @Input() articleContentId = '';

  // Se emite cuando se selecciona un texto
  @Output() selectedText = new EventEmitter<Highlight>();

  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public colorPickerService: ColorPickerService,
    private sanitizer: DomSanitizer,
    private highlightTextService: HighlightTextService,
    private commentService: CommentService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    //Inicializando el observable que contiene el id del highlight seleccionado
    this.commentService.currentHighlight$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((current) => {
        this.currentHighLight = current;
        this.handleSelectionsChange();
      });
    this.highlightTextService.isEraseSectionOpen$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        this.isEraseSectionOpen = value;
      });
    this.highlightTextService.highlights$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((highlights) => {
        this.seleccionados = highlights.filter(
          (highlightText: Highlight) =>
            highlightText.articleContentId === this.articleContentId,
        );
        this.handleSelectionsChange();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selections': {
            this.handleSelectionsChange();
          }
        }
      }
    }
  }

  handleSelectionsChange(): void {
    // Inicializando el observable que contiene el texto con los tags html para resaltar las selecciones
    const highlightedValue = this.sanitizer.bypassSecurityTrustHtml(
      this.highlightTextService.highlightText(
        this.text,
        this.seleccionados,
        this.currentHighLight,
      ),
    );
    this.highlightedValue$.next(highlightedValue);
  }

  /**
   * Emite un evento y envía como payload un objeto de tipo Highlight con información de la selección
   */
  async onMouseUp(): Promise<void> {
    const selection = document.getSelection();
    console.log('Selection', selection);
    // Si solo se seleccionó un rango (sin Ctrl) y hay caracteres seleccionados (al dar click sin seleccionar
    // ningún texto la api devuelve que hay un rango, pero los offsets son iguales) y está el modo de selección
    // activado
    if (
      selection?.rangeCount === 1 &&
      selection?.anchorOffset !== selection?.focusOffset &&
      this.colorPickerService.activedHighlightMode$.value
    ) {
      // Se emite un nuevo valor (texto subrayado) con las posiciones ordenadas correctamente (start es el menor
      // y end el mayor)
      const highlight = {
        start: selection.anchorOffset,
        end: selection.focusOffset,
        color: this.colorPickerService.selectedColor$.value,
        text: selection.toString(),
      } as Highlight;
      const highlightRelative = this.highlightTextService.getRootRelativeRange(
        highlight,
      );
      this.selectedText.emit(highlightRelative);

      // Se quita el resaltado que hace el navegador para que se vea rapidamente el que hizo el usuario
      selection.collapseToEnd();

      // Se desactiva la opción de marcado
      this.colorPickerService.activedHighlightMode$.next(false);
    } else {
      /* console.log(
        `Invalid selection attempt,
          selection?.rangeCount === 1: ${
            selection?.rangeCount === 1
          } selection?.anchorOffset !== selection?.focusOffset: ${
          selection?.anchorOffset !== selection?.focusOffset
        } this.colorPickerService.activedSelectionMode$.value: ${
          this.colorPickerService.activedSelectionMode$.value
        }`,
      ); */
      if (selection) {
        const highlightClicked = this.highlightTextService.checkIfHighlightIsClicked(
          this.seleccionados,
          selection.anchorOffset,
        );
        if (this.isEraseSectionOpen && highlightClicked) {
          const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: {
              title: '¿Desea eliminar el highlight?',
              reference: 'highlights',
            },
          });
          dialogRef.afterClosed().subscribe(async (res) => {
            if (res?.save) {
              await this.highlightTextService.destroyHighlightText(
                highlightClicked.id,
              );
            }
          });
        } else if (highlightClicked) {
          await this.commentService.setHighlight(highlightClicked.id);
        }
      }
    }
  }
}
