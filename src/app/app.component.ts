import { LoadingService } from './services/loading.service';
import { HighlightTextService } from 'src/app/services/highlight-text.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorPickerService } from './services/color-picker.service';
import { takeUntil } from 'rxjs/operators';
import { CommentService } from './services/comment.service';
import { Subject } from 'rxjs';
import { AuthService } from './services/auth.service';
import { FormServiceService } from './services/form-service.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isCommentSectionOpen = false;
  public isLoading: Subject<boolean> = new Subject<boolean>();
  isEraseSectionOpen = false;

  destroyed$: Subject<boolean> = new Subject<boolean>();
  constructor(
    public colorPickerService: ColorPickerService,
    public commentService: CommentService,
    public loadingSer: LoadingService,
    public highlightService: HighlightTextService,
    public auth: AuthService,
    public formService: FormServiceService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon(
      'eraser',
      sanitizer.bypassSecurityTrustResourceUrl('../assets/erase_text.svg'),
    );
  }

  ngOnInit(): void {
    this.commentService.isCommentSectionOpen$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (isCommentSectionOpen) =>
          (this.isCommentSectionOpen = isCommentSectionOpen),
      );
    this.loadingSer.isLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((load) => {
        this.isLoading.next(load);
      });
    this.highlightService.isEraseSectionOpen$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => (this.isEraseSectionOpen = value));
  }
  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.unsubscribe();
  }
}
