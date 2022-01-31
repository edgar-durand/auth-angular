import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

import { Highlight } from 'src/app/models/highlight.interface';
import { HighlightTextService } from 'src/app/services/highlight-text.service';

import { Article } from 'src/app/laws/models/article.interface';
import { ArticleContent } from 'src/app/laws/models/article-content.interface';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog } from "@angular/material/dialog";
import { ArticleDifComponent } from "../../../components/article-dif/article-dif.component";
import { ArticleService } from "../../../services/article.service";
import { AlertService } from "../../../services/alert.service";

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss'],
})
export class ArticleItemComponent implements OnInit, OnDestroy {
  // Artículo a mostrar
  @Input() article = {} as Article;

  // Listado de contenidos del artículo
  destroyed$: Subject<boolean> = new Subject<boolean>();
  articleContents$ = new BehaviorSubject([] as ArticleContent[]);
  selections: Highlight[] = [];

  areTherePending: boolean = false;

  constructor(
    private highlightTextService: HighlightTextService,
    private matIconRegistry: MatIconRegistry,
    private articleService: ArticleService,
    private domSanitizer: DomSanitizer,
    private alertService: AlertService,
    public dialog: MatDialog,
  ) {
    this.matIconRegistry.addSvgIcon(
      `dif`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/compare.svg')
    );
  }

  handleEdit(content: string){
    this.showDif(false, content);
  }

  showDif(isNewRevision?: boolean, contentId?: string){

    let prevIndex = 0;
    //Find the first that not has textOk
    const afterLastTextOk = this.article.versions.find((content, index) => {
      prevIndex = index -1 >= 0 ? index -1 : 0;
      return isNewRevision ? content?.textOk : content.id === contentId;
    })
    console.log('Without text ok (currentVersion)', afterLastTextOk);
    console.log('With text ok (previousVersion)', this.article.versions[prevIndex]);
    const dialogRef = this.dialog.open(ArticleDifComponent, {
      data: {
        currentVersion: this.article.versions[prevIndex],
        previousVersion: afterLastTextOk ?? this.article.versions[prevIndex + 1],
        isNewRevision
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        //TODO: confirm dialog
        const versionResult = dialogRef.componentInstance.versionResult;
        this.article.versions[prevIndex].textOk = versionResult;
        await this.articleService.update({ ...this.article });
        this.mapContents();
        this.alertService.alert('Articulo actualizado correctamente.');
      }
    });


  }

  ngOnInit(): void {
    // Se rellena el listado de contenidos del artículo recuperando por cada
    // contenido su listado de textos sobresaltados
    this.highlightTextService?.highlights$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((highlights) => {
        this.selections = highlights;
      });
    this.mapContents()
    this.areTherePending = this.article.versions.some((content) => !content.textOk)

  }

  mapContents(){
    this.articleContents$.next(
      this.article?.versions?.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .map((content: ArticleContent) => {
        return {
          ...content,
          selections:
            this.selections.filter(
              (highlightText: Highlight) =>
                highlightText.articleContentId === content.id,
            ) ?? [],
        };
      }) ?? []
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.unsubscribe();
  }
}
