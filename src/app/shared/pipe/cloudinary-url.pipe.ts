import { Pipe, PipeTransform } from '@angular/core';

export type CloudinaryPreset = 'thumb' | 'card' | 'modal' | 'zoom';

export const CLOUDINARY_PRESETS: Record<CloudinaryPreset, string> = {
  thumb: 'w_100,h_100,c_fill,g_auto,f_auto,q_auto', // Tablas, avatares y selectores compactos
  card: 'w_400,h_400,c_limit,f_auto,q_auto',        // Catálogos, tarjetas y cuadrícula de galería
  modal: 'w_800,h_800,c_limit,f_auto,q_auto',       // Modal de detalle y previsualización
  zoom: 'w_1600,c_limit,f_auto,q_auto'              // Inspección a pantalla completa
};

@Pipe({
  name: 'clUrl',
  standalone: true
})
export class CloudinaryUrlPipe implements PipeTransform {
  transform(url: string | null | undefined, preset: CloudinaryPreset = 'card'): string {
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return '';
    }

    const trimmedUrl = url.trim();

    // Solo transformar si es una URL de Cloudinary que incluya el segmento /upload/
    if (!trimmedUrl.includes('res.cloudinary.com') || !trimmedUrl.includes('/upload/')) {
      return trimmedUrl;
    }

    // Idempotencia: evitar duplicar parámetros si la URL ya contiene transformaciones previas
    if (
      trimmedUrl.includes('/upload/w_') ||
      trimmedUrl.includes('/upload/c_') ||
      trimmedUrl.includes('/upload/f_auto') ||
      trimmedUrl.includes('/upload/q_auto')
    ) {
      return trimmedUrl;
    }

    const params = CLOUDINARY_PRESETS[preset] || CLOUDINARY_PRESETS.card;
    return trimmedUrl.replace('/upload/', `/upload/${params}/`);
  }
}

