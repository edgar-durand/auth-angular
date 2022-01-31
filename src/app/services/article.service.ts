import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Article } from '../laws/models/article.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  baseUrl = `/api/article`;
  constructor(private apiService: ApiService) {}

  /**
   * Actualiza la información de un artículo en la base de datos
   * @param article Artículo a actualizar
   */
  async update(article: Article): Promise<void> {
    await this.apiService
      .put<Article>(`${this.baseUrl}/${article.id}`, article)
      .toPromise();
  }
}
