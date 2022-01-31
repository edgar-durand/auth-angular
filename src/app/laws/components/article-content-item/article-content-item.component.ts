import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';

import { Highlight } from 'src/app/models/highlight.interface';
import { HighlightTextService } from 'src/app/services/highlight-text.service';

import { ArticleContent } from 'src/app/laws/models/article-content.interface';
import { ALL_OPTION_VALUE } from 'src/app/laws/laws-utils';
import { CommentService } from '../../../services/comment.service';
import { LawsService } from '../../laws.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-article-content-item',
  templateUrl: './article-content-item.component.html',
  styleUrls: ['./article-content-item.component.scss'],
})
export class ArticleContentItemComponent implements OnInit, OnDestroy {
  // Valor para indicar que todas las versiones deben mostrarse
  SHOW_ALL_VERSIONS = ALL_OPTION_VALUE;

  // Contenido del artículo
  @Input() articleContent = {} as ArticleContent;
  @Input() hasMoreVersions = false;
  @Input() hasPreviousVersions = false;
  @Output() editRevision: EventEmitter<string> = new EventEmitter<string>();

  // Listado de los textos subrayados hechos en el contenido que se está mostrando
  selections$ = new BehaviorSubject<Highlight[]>([]);

  destroyed$: Subject<boolean> = new Subject<boolean>();

  show = false;

  constructor(
    private highlightTextService: HighlightTextService,
    public commentService: CommentService,
    public lawService: LawsService,
  ) {}

  edit(event: Event): void {
    event.stopPropagation();
    this.editRevision.emit(this.articleContent.id)
  }

  ngOnInit(): void {
    this.selections$.next(this.articleContent.selections);
    this.lawService.selectedLawVersion$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((currentLawVersion: string) => {
        this.show =
          this.articleContent.date === currentLawVersion ||
          currentLawVersion === ALL_OPTION_VALUE;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  /**
   * Al seleccionar un texto se guarda en base de datos
   *
   * @param highlight Nuevo texto subrayado
   */
  onSelectedText(highlight: Highlight): void {
    this.highlightTextService
      .saveHighlightText({
        ...highlight,
        articleContentId: this.articleContent.id,
      })
      .subscribe((savedSelections: Highlight[]) => {
        // TODO No es necesario devolver todos los highlights solo el nuevo
        // Se actualizan las selecciones con la respuesta de la api
        this.selections$.next(savedSelections);
        this.highlightTextService.highlights$.next(
          this.highlightTextService.highlights$.value.filter(
            (hl) => hl.articleContentId !== this.articleContent.id,
          ),
        );
        this.highlightTextService.highlights$.next(
          this.highlightTextService.highlights$.value.concat(savedSelections),
        );
      });
  }

  toggleArticleComments(): void {
    this.commentService.toggleCommentSectionOpenStatus();
  }
}
