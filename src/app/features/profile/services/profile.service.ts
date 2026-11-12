import { HttpClient } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';

import {
  MediaUploadResponse,
  UserChangePasswordPayload,
  UserProfileResponse,
  UserProfileUpdatePayload
} from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  private get authUrl(): string {
    return `${this.configService.apiUrl}/auth`;
  }

  private get mediaUrl(): string {
    return `${this.configService.apiUrl}/core/media`;
  }

  /**
   * 1. Consultar Mi Perfil (GET /api/auth/me)
   */
  getMyProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.authUrl}/me`);
  }

  /**
   * 2. Actualizar Mis Datos Personales (PATCH /api/auth/me)
   */
  updateMyProfile(payload: UserProfileUpdatePayload): Observable<UserProfileResponse> {
    return this.http.patch<UserProfileResponse>(`${this.authUrl}/me`, payload);
  }

  /**
   * 3. Cambiar Contraseña (POST /api/auth/me/change-password)
   */
  changeMyPassword(payload: UserChangePasswordPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.authUrl}/me/change-password`, payload);
  }

  /**
   * 4. Subir Avatar a Cloudinary (POST /api/core/media/upload?folder=avatars)
   */
  uploadAvatar(file: File | Blob, filename = 'avatar.webp'): Observable<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, filename);
    return this.http.post<MediaUploadResponse>(`${this.mediaUrl}/upload?folder=avatars`, formData);
  }

  /**
   * 5. Eliminar Foto de Perfil (DELETE /api/auth/me/avatar)
   */
  deleteAvatar(): Observable<UserProfileResponse> {
    return this.http.delete<UserProfileResponse>(`${this.authUrl}/me/avatar`);
  }
}
