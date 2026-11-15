/**
 * Contrato base para elementos de galería multimedia en la aplicación.
 * Compatible con fotografías de Catálogo (Fichas Maestras) y fotografías Reales (Productos Físicos).
 */
export interface MediaGalleryItem {
  id: string;
  url: string;
  title?: string | null;
  original_filename?: string | null;
  file_size_bytes?: number | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  sort_order: number;
}

export interface MediaGalleryReorderEvent<T extends MediaGalleryItem = MediaGalleryItem> {
  previousIndex: number;
  currentIndex: number;
  items: T[];
}
