export interface EntityBase {
  /**
   * Identificador de la entidad
   */
  id: string;

  /**
   * Fecha en que se creó la entidad
   */
  createdAt: Date | string;

  /**
   * Fecha de última actualización de la entidad
   */
  updatedAt: Date | string;
}
