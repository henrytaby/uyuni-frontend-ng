import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  model,
  signal,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import { LucideCode, LucideEye } from '@lucide/angular';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, Textarea, Tooltip, LucideEye, LucideCode],
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownEditorComponent implements AfterViewInit {
  readonly value = model<string>('');
  readonly label = input<string>('Especificaciones y Viñetas Técnicas');
  readonly placeholder = input<string>(
    '• **Resolución**: 1080p Nativo\n• **Conectividad**: HDMI, USB\n• **Voltaje**: 220V'
  );
  readonly rows = input<number>(6);

  readonly mode = signal<'visual' | 'raw'>('visual');
  @ViewChild('visualEditor') visualEditorRef?: ElementRef<HTMLDivElement>;

  constructor() {
    effect(() => {
      const val = this.value();
      if (this.mode() === 'visual' && this.visualEditorRef?.nativeElement) {
        const currentHtmlMd = this.htmlToMarkdown(this.visualEditorRef.nativeElement.innerHTML);
        if (currentHtmlMd !== (val || '').trim()) {
          this.visualEditorRef.nativeElement.innerHTML = this.markdownToHtml(val || '');
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.mode() === 'visual') {
      this.syncToVisualEditor();
    }
  }

  switchMode(newMode: 'visual' | 'raw'): void {
    if (newMode === 'visual') {
      this.mode.set('visual');
      this.syncToVisualEditor();
    } else {
      this.syncFromVisualEditor();
      this.mode.set('raw');
    }
  }

  syncToVisualEditor(): void {
    setTimeout(() => {
      if (this.visualEditorRef?.nativeElement) {
        this.visualEditorRef.nativeElement.innerHTML = this.markdownToHtml(this.value());
      }
    }, 0);
  }

  syncFromVisualEditor(): void {
    if (this.visualEditorRef?.nativeElement) {
      const html = this.visualEditorRef.nativeElement.innerHTML;
      this.value.set(this.htmlToMarkdown(html));
    }
  }

  onVisualEditorInput(): void {
    this.syncFromVisualEditor();
  }

  execFormat(command: string, val: string | null = null): void {
    if (this.visualEditorRef?.nativeElement) {
      this.visualEditorRef.nativeElement.focus();
    }
    try {
      document.execCommand(command, false, val ?? undefined);
    } catch {
      if (val && !val.startsWith('<')) {
        document.execCommand(command, false, `<${val}>`);
      }
    }
    this.syncFromVisualEditor();
  }

  insertMarkdownSnippet(type: 'bold' | 'italic' | 'bullet' | 'number' | 'heading'): void {
    const current = this.value() || '';
    let addition = '';
    switch (type) {
      case 'bold':
        addition = '**texto en negrita**';
        break;
      case 'italic':
        addition = '*texto en cursiva*';
        break;
      case 'bullet':
        addition = current.endsWith('\n') || current === '' ? '• ' : '\n• ';
        break;
      case 'number':
        addition = current.endsWith('\n') || current === '' ? '1. ' : '\n1. ';
        break;
      case 'heading':
        addition = current.endsWith('\n') || current === '' ? '### ' : '\n### ';
        break;
    }
    this.value.set(current + addition);
  }

  private nodeToMd(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    let inner = '';
    for (const child of Array.from(el.childNodes)) {
      inner += this.nodeToMd(child);
    }

    switch (tag) {
      case 'strong':
      case 'b':
        return inner.trim() ? `**${inner.trim()}**` : '';
      case 'em':
      case 'i':
        return inner.trim() ? `*${inner.trim()}*` : '';
      case 'li': {
        const parentTag = el.parentElement?.tagName.toLowerCase();
        const trimmed = inner.trim();
        if (!trimmed) return '';
        if (parentTag === 'ol') {
          let idx = 1;
          let prev = el.previousElementSibling;
          while (prev) {
            if (prev.tagName.toLowerCase() === 'li') idx++;
            prev = prev.previousElementSibling;
          }
          return `${idx}. ${trimmed}\n`;
        }
        return `• ${trimmed}\n`;
      }
      case 'ul':
      case 'ol':
        return inner ? `${inner}\n` : '';
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return inner.trim() ? `### ${inner.trim()}\n\n` : '';
      case 'p':
      case 'div':
        return inner.trim() ? `${inner.trim()}\n` : '';
      case 'br':
        return '\n';
      default:
        return inner;
    }
  }

  htmlToMarkdown(html: string): string {
    if (!html || !html.trim()) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return this.nodeToMd(div)
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  markdownToHtml(md: string): string {
    if (!md || !md.trim()) {
      return '<ul><li><br></li></ul>';
    }

    const lines = md.split(/\r?\n/);
    let html = '';
    let inUl = false;
    let inOl = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inUl) {
          html += '</ul>';
          inUl = false;
        }
        if (inOl) {
          html += '</ol>';
          inOl = false;
        }
        continue;
      }

      const hMatch = trimmed.match(/^#{1,4}\s+(.*)$/);
      if (hMatch) {
        if (inUl) {
          html += '</ul>';
          inUl = false;
        }
        if (inOl) {
          html += '</ol>';
          inOl = false;
        }
        html += `<h4>${this.inlineMdToHtml(hMatch[1])}</h4>`;
        continue;
      }

      const bulletMatch = trimmed.match(/^[•\-*]\s+(.*)$/);
      if (bulletMatch) {
        if (inOl) {
          html += '</ol>';
          inOl = false;
        }
        if (!inUl) {
          html += '<ul>';
          inUl = true;
        }
        html += `<li>${this.inlineMdToHtml(bulletMatch[1])}</li>`;
        continue;
      }

      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        if (inUl) {
          html += '</ul>';
          inUl = false;
        }
        if (!inOl) {
          html += '<ol>';
          inOl = true;
        }
        html += `<li>${this.inlineMdToHtml(numMatch[2])}</li>`;
        continue;
      }

      if (inUl) {
        html += '</ul>';
        inUl = false;
      }
      if (inOl) {
        html += '</ol>';
        inOl = false;
      }
      html += `<p>${this.inlineMdToHtml(trimmed)}</p>`;
    }

    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';
    return html || '<ul><li><br></li></ul>';
  }

  private inlineMdToHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
}
