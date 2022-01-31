import { EntityBase } from 'src/app/models/entity-base.interface';

import { ArticleContent } from './article-content.interface';

/**
 * Tipos de artículos
 */
export enum ArticleType {
  Article = 'articulo',
  Na = 'na',
}

export interface Article extends EntityBase {
  /**
   * Número del artículo (puede tener letras)
   */
  number: string;

  /**
   * Tipo del artículo
   */
  type: string;

  /**
   * Numero de orden en que aparece el articulo en la ley
   */
  order: number;

  /**
   * Versiones del contenido del artículo.
   * Un artículo puede ser modificado varias veces y cada modificación
   * constituye una actualización
   */
  versions: ArticleContent[];
}
