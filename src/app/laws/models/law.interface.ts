import { EntityBase } from 'src/app/models/entity-base.interface';

import { Article } from './article.interface';

export interface Law extends EntityBase {
  /**
   * Nombre de la ley
   */
  name: string;

  /**
   * Ruta del archivo que contiene la ley
   */
  path: string;

  /**
   * Versión actual del documento
   */
  currentVersion: string;

  /**
   * Listado de todas las versiones que ha tenido la ley, incluye la versión actual
   */
  versions: string[];

  /**
   * Listado de artículos que pertenecen a la ley
   */
  articles: Article[];
}
