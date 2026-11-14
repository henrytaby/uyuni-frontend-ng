import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { SKIP_LOADER_HEADER } from '@core/interceptors/loading.interceptor';
import { LoggerService } from '@core/services/logger.service';

import {
  AssistantProvidersResponse,
  ChatAssistantRequest,
  ChatAssistantResponse
} from '../models/assistant.model';

@Injectable({
  providedIn: 'root'
})
export class CommerceAssistantService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/commerce/assistant`;
  }

  /**
   * Envía un mensaje al Asistente Comercial IA con contexto e historial.
   * Utiliza 'X-Skip-Loader' para no bloquear la interfaz global con la pantalla oscura.
   */
  sendMessage(payload: ChatAssistantRequest): Observable<ChatAssistantResponse> {
    this.logger.info(
      'Sending message to Commerce AI Assistant',
      { provider: payload.provider, includeStock: payload.include_stock_data },
      'CommerceAssistantService'
    );
    return this.http.post<ChatAssistantResponse>(`${this.baseUrl}/chat`, payload, {
      headers: { [SKIP_LOADER_HEADER]: 'true' }
    });
  }

  /**
   * Obtiene la lista de proveedores IA configurados en el backend de forma silenciosa.
   */
  getProviders(): Observable<AssistantProvidersResponse> {
    this.logger.debug('Fetching configured AI Assistant providers', null, 'CommerceAssistantService');
    return this.http.get<AssistantProvidersResponse>(`${this.baseUrl}/providers`, {
      headers: { [SKIP_LOADER_HEADER]: 'true' }
    });
  }
}
