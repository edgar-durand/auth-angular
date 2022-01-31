import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { LawsService } from '../../laws.service';
import { Article } from '../../models/article.interface';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-article-autocomplete',
  templateUrl: './article-autocomplete.component.html',
  styleUrls: ['./article-autocomplete.component.scss'],
})
export class ArticleAutocompleteComponent implements OnInit {
  @Input() relatedArticles!: string[];
  @Input() commentId!: string;
  @Input() isListInSync = false;

  @Output() onUpdateArticles = new EventEmitter<string[]>();
  @Output() onSyncArticles = new EventEmitter<string[]>();

  articleControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  availableArticles: Article[] = [];
  filteredOptions!: Observable<Article[]>;
  initRelatedValues: string[] = [];
  @ViewChild('articleInput') articleInput!: ElementRef<HTMLInputElement>;

  constructor(
    private lawService: LawsService,
    private articleService: ArticleService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.availableArticles = [...this.lawService.currentArticles];
    if (!this.relatedArticles) {
      this.relatedArticles = [];
    }
    this.removeRelatedArticlesFromAvailable();

    // Subscribe till destroy
    this.filteredOptions = this.articleControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value)),
    );

    if (!this.relatedArticles) {
      this.relatedArticles = [];
      this.initRelatedValues = [];
    } else {
      this.initRelatedValues = Array.from(this.relatedArticles);
    }
  }

  /**
   * Use the hole list of articles and removes the one already rleated
   */
  removeRelatedArticlesFromAvailable(): void {
    this.relatedArticles?.forEach((relatedArticle) => {
      const articleIndex = this.availableArticles.findIndex((article) =>
        article.number.includes(relatedArticle),
      );
      // Remove related article from available list
      if (articleIndex >= 0) {
        this.availableArticles.splice(articleIndex, 1);
      }
    });
  }

  addNewChip(event: MatChipInputEvent): void {
    const articleId = (event.value || '').trim();
    this.addArticle(articleId);
  }

  addArticle(articleId: string): void {
    // Add the article
    if (articleId) {
      const article = this.lawService.currentArticles.find((art) =>
        art.number.includes(articleId),
      );
      if (article) {
        this.relatedArticles?.push(articleId);
        this.updatePossibleArticleList(article, 'remove');
      } else {
        throw new Error(`No article`);
      }
    }

    this.clearInput();
    this.onUpdateArticles.emit(this.relatedArticles);
  }

  removeArticle(articleId: string): void {
    if (this.relatedArticles) {
      const index = this.relatedArticles.findIndex(
        (article) => article.toLowerCase() === articleId.toLowerCase(),
      );

      if (index >= 0) {
        this.relatedArticles.splice(index, 1);
        const finded = this.lawService.currentArticles.find((element) => {
          const number = element.number.slice(1);
          return number.toLowerCase() === articleId.toLowerCase();
        });
        if (finded !== undefined) {
          this.isListInSync = false;
          this.availableArticles.push(finded);
          this.updatePossibleArticleList(finded, 'add');
        }
      }
    }
  }

  updatePossibleArticleList(article: Article, action: string): void {
    const newCurrentArticles = [...this.availableArticles];
    if (action === 'add') {
      newCurrentArticles.push(article);
    } else {
      const articleIndex = newCurrentArticles.findIndex(
        (c) => c.id === article.id,
      );
      if (articleIndex >= 0) {
        newCurrentArticles.splice(articleIndex, 1);
      } else {
        console.log('No article index');
      }
    }
    this.availableArticles = newCurrentArticles;
  }

  private filter(value: string): Article[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.availableArticles.filter((article) =>
        article.number.toLowerCase().includes(filterValue.toLowerCase()),
      );
    } else {
      return this.availableArticles.slice();
    }
  }

  handleSelectArticle(event: MatAutocompleteSelectedEvent): void {
    const articleId = event.option.viewValue;
    this.addArticle(articleId);
    this.clearInput();
  }

  clearInput(): void {
    this.articleInput.nativeElement.value = '';
    this.articleControl.setValue(null);
  }

  async handleSyncArticleList(): Promise<void> {
    const array = this.initRelatedValues.map((number) => {
      return this.relatedArticles.includes(number);
    });

    const correct = array.includes(false);
    if (!correct) {
      this.onSyncArticles.emit(this.relatedArticles);
    } else {
      //Open Modal
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          title: '¿Desea eliminar relaciones?',
        },
      });
      dialogRef.afterClosed().subscribe(async (res) => {
        if (res?.save) {
          this.onSyncArticles.emit(this.relatedArticles);
          this.initRelatedValues = [...this.relatedArticles];
          this.isListInSync = true;
        }
      });
    }
  }
}
