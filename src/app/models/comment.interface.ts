import { EntityBase } from 'src/app/models/entity-base.interface';

export interface Comment extends EntityBase {
  content: string;
  /**
   * Artículos IDs relacionados con este artículo
   */
  relatedArticles: string[];
}
