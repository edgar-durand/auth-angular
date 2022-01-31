import { EntityBase } from 'src/app/models/entity-base.interface';

export interface Highlight extends EntityBase {
  // Identificador del contenido del artículo
  articleContentId?: string;

  // Color de la selección
  color: string;

  // Posición donde termina la selección
  end: number;

  // Posición donde comienza la selección
  start: number;

  // Texto seleccionado
  text: string;
}
