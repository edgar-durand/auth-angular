import { Component, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, filter, switchMap } from "rxjs/operators";

import { ColorPickerService } from "src/app/services/color-picker.service";
import { HighlightTextService } from "src/app/services/highlight-text.service";

import { LawsService } from "../laws.service";
import { Law } from "../models/law.interface";
import { CommentService } from "../../services/comment.service";
import { ALL_OPTION_VALUE } from "../laws-utils";
import { Article } from "../models/article.interface";
import { FormServiceService } from "../../services/form-service.service";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-law-detail",
  templateUrl: "./law-detail.component.html",
  styleUrls: ["./law-detail.component.scss"]
})
export class LawDetailComponent implements OnInit, OnDestroy {
  allOptions = ALL_OPTION_VALUE;
  // Objeto con los datos de la ley
  law$: Observable<Law> = of({} as Law);
  public articles: Article[] = [];

  public paginator: { page: number; perPage: number; articles: Article[]; listLength: number; totalOfPages:number } = {
    page: 1,
    perPage: 20,
    articles: this.articles,
    listLength: this.articles.length,
    totalOfPages: 1
  };


  pageEvent!: PageEvent;

  constructor(
    private activatedRoute: ActivatedRoute,
    public colorPickerService: ColorPickerService,
    private highlightTextService: HighlightTextService,
    public lawsService: LawsService,
    public commentService: CommentService,
    private formService: FormServiceService
  ) {
  }

  handlePage(event: any): void {
    this.pageEvent = event;
    this.paginator.perPage = event.pageSize;
    this.goToPage(event.pageIndex +1)
    console.log(event);
  }

  // next(): void {
  //   if (this.paginator.page < this.paginator.totalOfPages) {
  //     this.paginator.page++;
  //     this.updateArticlesPagination();
  //   }
  //   console.log(this.paginator.page);
  // }
  //
  // prev(): void {
  //   if (this.paginator.page > 1) {
  //     this.paginator.page--;
  //     this.updateArticlesPagination();
  //   }
  //   console.log(this.paginator.page);
  // }

  goToPage(page: number) {
    this.paginator.page = page;
    this.updateArticlesPagination();
  }

  updateArticlesPagination() {
    this.articles = this.paginator.articles.slice().splice(this.paginator.perPage * (this.paginator.page - 1), this.paginator.perPage);
  }

  hasText(versions: any[]): boolean {
    return this.lawsService.selectedLawVersion$.value === ALL_OPTION_VALUE ||
      versions.some((art) => art.date === this.lawsService.selectedLawVersion$.value);
  }

  ngOnInit(): void {
    this.formService.showTools$.next(true);
    // Se busca la ley por el id que viene en la url
    this.law$ = this.activatedRoute.paramMap.pipe(
      filter((params: ParamMap) => params.get("id") !== null),
      switchMap((params: ParamMap) =>
        this.lawsService.findById(String(params.get("id")))
      ),
      catchError((error) => {
        console.error(error);
        return of({} as Law);
      })
    );

    // Si al inicializar este componente no están los contenidos de artículos cargados se cargan
    if (this.highlightTextService.highlights$.value.length === 0) {
      this.highlightTextService
        .init()
        .catch(() =>
          console.error("error al cargar los contenidos de los artículos")
        );
    }
    setTimeout(() => {
      this.law$.subscribe((law) => {
        this.articles = law.articles.sort((a, b): number => {
          if (a.order > b.order) {
            return 1;
          } else if (b.order > a.order) {
            return -1;
          } else {
            return 0;
          }
        });
        this.paginator = {
          page: this.paginator.page,
          perPage: this.paginator.perPage,
          articles: this.articles,
          listLength: this.articles.length,
          totalOfPages: Math.ceil(this.articles.length / this.paginator.perPage)
        };
        this.updateArticlesPagination();
      });
    }, 1000);

  }

  /**
   * Actualiza la opción (versión) seleccionada por el usuario
   *
   * @param version Opción seleccionada
   */
  onSelectVersion(version: string): void {
    this.goToPage(1);
    this.lawsService.setLawVersion(version);
  }

  /**
   * Actualiza el color guardado en el servicio
   *
   * @param selected Color seleccionado
   */
  onSelectColor(selected: string): void {
    this.colorPickerService.selectedColor$.next(selected);
    this.colorPickerService.activedSelectionMode$.next(true);
  }

  ngOnDestroy(): void {
    this.formService.showTools$.next(false);
  }

}
