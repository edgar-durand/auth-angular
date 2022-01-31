import { EntityBase } from 'src/app/models/entity-base.interface';
import { Highlight } from 'src/app/models/highlight.interface';

export interface ArticleContent extends EntityBase {
  /**
   * Contenido del artículo en un versión determinada
   */
  text: string;

  /**
   * Contenido del artículo en un versión determinada luego de su revision
   */
  textOk: string;

  /**
   * Fecha del artículo
   */
  date: string;

  /**
   * Nombre del archivo
   */
  filename: string;

  /**
   * Listado de textos subrayados
   */
  selections: Highlight[];
}
