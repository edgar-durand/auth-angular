import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

import { Law } from './models/law.interface';
import { ALL_OPTION_VALUE } from './laws-utils';
import { Article /* , ArticleType */ } from './models/article.interface';

@Injectable({
  providedIn: 'root',
})
export class LawsService {
  // Listado de leyes
  laws$: BehaviorSubject<Law[]> = new BehaviorSubject<Law[]>([]);
  selectedLawVersion$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ALL_OPTION_VALUE,
  );

  // Url base para consumir los enpoints de las leyes de la API
  lawsBaseUrl = `/api/laws`;

  currentArticles: Article[] = [];

  constructor(private apiService: ApiService) {}

  /**
   * Carga todas las leyes y actualiza el listado de leyes (BehaviorSubject)
   */
  async init(): Promise<void> {
    const laws = await this.findAllLaws().toPromise();
    this.laws$.next(laws);
  }

  /**
   * Devuelve el listado de todas las leyes
   */
  findAllLaws(): Observable<Law[]> {
    return this.apiService.get<Law[]>(this.lawsBaseUrl);
  }

  /**
   * Obtiene una ley a partir del id
   *
   * @param id Id de la ley
   */
  findById(id: string): Observable<Law> {
    let law;
    // Si el listado de leyes tiene elementos se busca en él, sino se hace la petición a la API.
    if (this.laws$.value.length) {
      law = this.laws$.value.find((law) => law.id === id);

      // Como se cargó el listado completo de leyes si no hay ley con el id dado se lanza un error
      if (!law) {
        throw new Error(`No se encontro la ley, ID: ${id}`);
      }
      this.currentArticles = law.articles;
      return of<Law>(law);
    } else {
      law = this.apiService.get<Law>(`${this.lawsBaseUrl}/${id}`);
      law.subscribe((data) => (this.currentArticles = data.articles));
      return law;
    }
  }

  /**
   * Sets the current law version
   * @param version Value to use for the current version
   */
  setLawVersion(version: string): void {
    this.selectedLawVersion$.next(version);
  }
}
