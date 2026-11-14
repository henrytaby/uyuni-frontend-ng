import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  model,
  OnInit,
  output,
  signal,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import {
  LucideBot,
  LucideCheck,
  LucideCopy,
  LucideExternalLink,
  LucideMaximize2,
  LucideMinimize2,
  LucidePackage,
  LucideRotateCcw,
  LucideShield,
  LucideSparkles
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

import {
  ChatMessage,
  MatchedProduct
} from '../../models/assistant.model';
import { CommerceAssistantService } from '../../services/assistant.service';

interface ProviderOption {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-commerce-assistant-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Drawer,
    Button,
    Select,
    Textarea,
    ToggleSwitch,
    Tooltip,
    LucideBot,
    LucideCheck,
    LucideCopy,
    LucideExternalLink,
    LucideMaximize2,
    LucideMinimize2,
    LucidePackage,
    LucideRotateCcw,
    LucideShield,
    LucideSparkles
  ],
  templateUrl: './commerce-assistant-drawer.component.html',
  styleUrl: './commerce-assistant-drawer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommerceAssistantDrawerComponent implements OnInit {
  private readonly assistantService = inject(CommerceAssistantService);
  private readonly messageService = inject(MessageService);
  private readonly logger = inject(LoggerService);

  @ViewChild('chatScrollContainer') chatScrollContainer?: ElementRef<HTMLDivElement>;

  // Two-way bindings
  readonly visible = model<boolean>(false);

  // Outputs
  readonly openProduct = output<number>();

  // State
  readonly messages = signal<ChatMessage[]>([]);
  readonly userInput = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly selectedProvider = signal<string>('groq');
  readonly includeStock = signal<boolean>(true);
  readonly isMaximized = signal<boolean>(false);
  readonly copiedProductId = signal<number | null>(null);

  readonly providerOptions = signal<ProviderOption[]>([
    { label: '⚡ Groq (1.1s)', value: 'groq', icon: 'zap' },
    { label: '🛡️ Mistral', value: 'mistral', icon: 'shield' },
    { label: '✨ Gemini', value: 'gemini', icon: 'sparkles' }
  ]);

  readonly quickPrompts = [
    { label: 'Stock disponible', prompt: '¿Qué productos tienen unidades disponibles en stock hoy?' },
    { label: 'Mayor margen regateo', prompt: '¿Cuáles son los productos con mayor margen de ganancia para regateo?' },
    { label: 'Productos agotados', prompt: '¿Qué productos están actualmente agotados o sin existencias?' },
    { label: 'Cargadores y cables', prompt: '¿Tenemos cargadores tipo C, inalámbricos o accesorios de celular?' },
    { label: 'Proyectores y TV', prompt: '¿Qué proyectores o equipos multimedia tenemos disponibles?' }
  ];

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.assistantService.getProviders().subscribe({
      next: res => {
        if (res.default_provider) {
          this.selectedProvider.set(res.default_provider);
        }
        if (res.configured_providers && res.configured_providers.length > 0) {
          const opts: ProviderOption[] = res.configured_providers.map(p => {
            if (p === 'groq') return { label: '⚡ Groq (1.1s)', value: 'groq', icon: 'zap' };
            if (p === 'mistral') return { label: '🛡️ Mistral', value: 'mistral', icon: 'shield' };
            if (p === 'gemini') return { label: '✨ Gemini', value: 'gemini', icon: 'sparkles' };
            return { label: p.toUpperCase(), value: p, icon: 'bot' };
          });
          this.providerOptions.set(opts);
        }
      },
      error: err => {
        this.logger.warn('Could not load AI providers, using default', err, 'CommerceAssistantDrawerComponent');
      }
    });
  }

  sendMessage(customPrompt?: string): void {
    const text = (customPrompt || this.userInput()).trim();
    if (!text || this.isLoading()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    // Agregar mensaje del usuario a la lista
    this.messages.update(prev => [...prev, userMsg]);
    this.userInput.set('');
    this.isLoading.set(true);
    this.scrollToBottom();

    // Preparar historial conversacional para el backend (máximo últimos 8)
    const historyPayload = this.messages()
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-8)
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

    this.assistantService
      .sendMessage({
        message: text,
        history: historyPayload,
        provider: this.selectedProvider() || null,
        include_stock_data: this.includeStock()
      })
      .subscribe({
        next: resp => {
          this.logger.info(
            'Assistant reply received',
            { provider: resp.provider_used, matches: resp.matched_products?.length },
            'CommerceAssistantDrawerComponent'
          );

          const assistantMsg: ChatMessage = {
            id: `ast-${Date.now()}`,
            role: 'assistant',
            content: resp.reply,
            timestamp: new Date(),
            matchedProducts: resp.matched_products || [],
            providerUsed: resp.provider_used,
            modelUsed: resp.model_used,
            fallbackOccurred: resp.fallback_occurred
          };

          this.messages.update(prev => [...prev, assistantMsg]);
          this.isLoading.set(false);
          this.scrollToBottom();
        },
        error: err => {
          this.logger.error('Error from AI Assistant', err, 'CommerceAssistantDrawerComponent');

          const errorDetail = err?.error?.detail || 'No se pudo contactar al asistente. Verifique la conexión o claves de API.';

          const errorMsg: ChatMessage = {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ **Error en Asistente IA:** ${errorDetail}`,
            timestamp: new Date()
          };

          this.messages.update(prev => [...prev, errorMsg]);
          this.isLoading.set(false);
          this.scrollToBottom();

          this.messageService.add({
            severity: 'error',
            summary: 'Error del Asistente',
            detail: errorDetail
          });
        }
      });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages.set([]);
    this.messageService.add({
      severity: 'info',
      summary: 'Conversación Reiniciada',
      detail: 'El historial del asistente ha sido limpiado.'
    });
  }

  toggleMaximize(): void {
    this.isMaximized.update(v => !v);
  }

  closeDrawer(): void {
    this.visible.set(false);
  }

  handleOpenProduct(itemNumber: number): void {
    this.openProduct.emit(itemNumber);
  }

  copyProductSummary(prod: MatchedProduct): void {
    if (!navigator?.clipboard) return;

    const summary = [
      `[#${prod.item_number}] ${prod.name}`,
      `• Marca/Modelo: ${prod.brand || 'N/A'} ${prod.model || ''}`,
      `• Precio Oficial: Bs. ${prod.official_price.toFixed(2)}`,
      `• Precio Mínimo Protegido: Bs. ${prod.minimum_price.toFixed(2)}`,
      `• Stock Físico Disponible: ${prod.available_stock} unidad(es)`,
      prod.description ? `• Info: ${prod.description}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      this.copiedProductId.set(prod.item_number);
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado al Portapapeles',
        detail: `Ficha #${prod.item_number} lista para compartir.`
      });
      setTimeout(() => {
        if (this.copiedProductId() === prod.item_number) {
          this.copiedProductId.set(null);
        }
      }, 2000);
    });
  }

  /**
   * Formatea de manera segura el Markdown devuelto por el LLM evitando inyecciones HTML.
   * Soporta tablas completas, encabezados (h1-h3), blockquotes/notas, listas y formato inline.
   */
  formatMarkdown(content: string): string {
    if (!content) return '';

    // 1. Quitar encabezado redundante si viene del LLM ("Respuesta:" o "**Respuesta:**")
    const raw = content.replace(/^(\*\*Respuesta:\*\*|Respuesta:)\s*/i, '').trim();

    // 2. Procesar bloques por líneas
    const lines = raw.split(/\r?\n/);
    const htmlBlocks: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Línea vacía
      if (!trimmed) {
        i++;
        continue;
      }

      // 1. TABLA MARKDOWN: detecta líneas con pipes '|'
      if (trimmed.startsWith('|') && trimmed.endsWith('|') && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        // Verifica si la siguiente línea es el separador de tabla |---|---|
        if (nextLine.startsWith('|') && /^\|[\s\-:|]+\|$/.test(nextLine)) {
          const headerCells = trimmed
            .slice(1, -1)
            .split('|')
            .map(c => this.formatInline(c.trim()));

          i += 2; // saltar header y separador
          const rowLines: string[][] = [];

          while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
            const dataRow = lines[i]
              .trim()
              .slice(1, -1)
              .split('|')
              .map(c => this.formatInline(c.trim()));
            rowLines.push(dataRow);
            i++;
          }

          // Construir HTML de la tabla con diseño de alta densidad ERP
          let tableHtml = '<div class="overflow-x-auto my-3 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-900 shadow-2xs">';
          tableHtml += '<table class="w-full text-left text-xs border-collapse">';
          tableHtml += '<thead><tr class="bg-gray-50/90 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">';
          for (const h of headerCells) {
            tableHtml += `<th class="px-3 py-2 font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">${h}</th>`;
          }
          tableHtml += '</tr></thead><tbody>';

          for (const row of rowLines) {
            tableHtml += '<tr class="border-b border-gray-100 dark:border-gray-800/80 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">';
            for (let cellContent of row) {
              cellContent = cellContent || '';
              // Si la celda es un identificador de catálogo como #215, estilizar como badge interactivo
              if (/^#\d+$/.test(cellContent.trim())) {
                cellContent = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">${cellContent.trim()}</span>`;
              }
              tableHtml += `<td class="px-3 py-2 text-gray-800 dark:text-gray-300">${cellContent}</td>`;
            }
            tableHtml += '</tr>';
          }

          tableHtml += '</tbody></table></div>';
          htmlBlocks.push(tableHtml);
          continue;
        }
      }

      // 2. ENCABEZADOS (H1, H2, H3)
      const hMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
      if (hMatch) {
        const level = hMatch[1].length;
        const text = this.formatInline(hMatch[2]);
        if (level === 1) {
          htmlBlocks.push(`<h2 class="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mt-3 mb-1.5">${text}</h2>`);
        } else if (level === 2) {
          htmlBlocks.push(`<h3 class="text-xs sm:text-sm font-bold text-brand-700 dark:text-brand-300 mt-3 mb-1.5">${text}</h3>`);
        } else {
          htmlBlocks.push(`<h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 mt-2 mb-1">${text}</h4>`);
        }
        i++;
        continue;
      }

      // 3. BLOCKQUOTE / NOTA (> Nota: ...)
      if (trimmed.startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
          i++;
        }
        const quoteText = quoteLines.map(l => this.formatInline(l)).join(' ');
        htmlBlocks.push(
          `<div class="border-l-3 border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 px-3.5 py-2.5 rounded-r-xl my-2.5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">${quoteText}</div>`
        );
        continue;
      }

      // 4. LISTAS DESORDENADAS (Viñetas - o • o *)
      if (/^[•\-*]\s+/.test(trimmed)) {
        let listHtml = '<ul class="list-disc pl-5 my-2 space-y-1">';
        while (i < lines.length && /^[•\-*]\s+/.test(lines[i].trim())) {
          const itemText = this.formatInline(lines[i].trim().replace(/^[•\-*]\s+/, ''));
          listHtml += `<li class="text-gray-700 dark:text-gray-300 leading-relaxed">${itemText}</li>`;
          i++;
        }
        listHtml += '</ul>';
        htmlBlocks.push(listHtml);
        continue;
      }

      // 5. LISTAS NUMERADAS (1. Item)
      if (/^\d+\.\s+/.test(trimmed)) {
        let listHtml = '<ol class="list-decimal pl-5 my-2 space-y-1">';
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          const itemText = this.formatInline(lines[i].trim().replace(/^\d+\.\s+/, ''));
          listHtml += `<li class="text-gray-700 dark:text-gray-300 leading-relaxed">${itemText}</li>`;
          i++;
        }
        listHtml += '</ol>';
        htmlBlocks.push(listHtml);
        continue;
      }

      // 6. PÁRRAFO NORMAL
      htmlBlocks.push(`<p class="my-1.5 leading-relaxed text-gray-800 dark:text-gray-200">${this.formatInline(trimmed)}</p>`);
      i++;
    }

    return htmlBlocks.join('');
  }

  /**
   * Sanitiza y formatea elementos inline (negrita, cursiva, código, enlaces)
   */
  formatInline(text: string): string {
    if (!text) return '';

    // 1. Sanitizar entidades HTML para seguridad XSS
    let s = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 2. Negrita **bold** o __bold__
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>');
    s = s.replace(/__(.*?)__/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>');

    // 3. Cursiva *italic* o _italic_
    s = s.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    s = s.replace(/_(.*?)_/g, '<em class="italic">$1</em>');

    // 4. Código inline `code`
    s = s.replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[11px] text-brand-700 dark:text-brand-300 border border-gray-200 dark:border-gray-700">$1</code>'
    );

    // 5. Enlaces [label](url)
    s = s.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 hover:underline font-medium">$1</a>'
    );

    return s;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatScrollContainer?.nativeElement) {
        this.chatScrollContainer.nativeElement.scrollTop =
          this.chatScrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
