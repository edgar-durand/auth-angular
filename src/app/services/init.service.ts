import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LawsService } from '../laws/laws.service';
import { HighlightTextService } from './highlight-text.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  /**
   * Indica si la app ya cargó toda la información que necesita
   */
  appReady$ = new BehaviorSubject(false);

  constructor(
    private lawsService: LawsService,
    private highlightTextService: HighlightTextService,
  ) {
    Promise.all([this.lawsService.init(), this.highlightTextService.init()])
      .catch(() => {
        this.lawsService.laws$.next([]);
        this.highlightTextService.highlights$.next([]);
      })
      .finally(() => this.appReady$.next(true));
  }
}
