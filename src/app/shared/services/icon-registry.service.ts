import { inject, Injectable } from '@angular/core';

import { LucideIconData } from '@lucide/angular';
import {
  LucideBuilding,
  LucideCircleDot,
  LucideHouse,
  LucidePackage,
  LucideSettings,
  LucideShield,
  LucideUser,
  LucideUsers,
} from '@lucide/angular';

import { LoggerService } from '@core/services/logger.service';

export interface IconRegistryEntry {
  key: string;
  resolved: boolean;
  source: 'slug' | 'fallback';
  count: number;
}

@Injectable({ providedIn: 'root' })
export class IconRegistryService {
  private readonly logger = inject(LoggerService);

  private readonly _accessLog = new Map<string, { count: number; source: IconRegistryEntry['source'] }>();

  private readonly SLUG_TO_ICON = new Map<string, LucideIconData>([
    ['configuration', LucideSettings.icon],
    ['institution', LucideBuilding.icon],
    ['fixed-assets', LucidePackage.icon],
    ['home', LucideHouse.icon],
    ['admin', LucideShield.icon],
    ['administration', LucideShield.icon],
    ['user', LucideUser.icon],
    ['manager', LucideSettings.icon],
    ['viewer', LucideUsers.icon],
  ]);

  private readonly FALLBACK = LucideCircleDot.icon;

  get(key: string): LucideIconData {
    if (!key) return this.FALLBACK;

    const slugIcon = this.SLUG_TO_ICON.get(key);
    if (slugIcon) {
      this._trackAccess(key, 'slug');
      return slugIcon;
    }

    this._trackAccess(key, 'fallback');
    this.logger.warn(`IconRegistry: slug "${key}" no encontrado, usando fallback`);
    return this.FALLBACK;
  }

  has(key: string): boolean {
    return this.SLUG_TO_ICON.has(key);
  }

  register(slug: string, icon: LucideIconData): void {
    this.SLUG_TO_ICON.set(slug, icon);
  }

  private _trackAccess(key: string, source: IconRegistryEntry['source']): void {
    const existing = this._accessLog.get(key);
    if (existing) {
      existing.count++;
    } else {
      this._accessLog.set(key, { count: 1, source });
    }
  }

  getDiagnostics(): IconRegistryEntry[] {
    return Array.from(this._accessLog.entries()).map(([key, { count, source }]) => ({
      key,
      resolved: source !== 'fallback',
      source,
      count,
    }));
  }

  getMissingSlugs(): string[] {
    return this.getDiagnostics()
      .filter(e => !e.resolved)
      .map(e => e.key);
  }

  printDiagnostics(): void {
    const entries = this.getDiagnostics();
    const resolved = entries.filter(e => e.resolved);
    const missing = entries.filter(e => !e.resolved);

    const group = (label: string, items: IconRegistryEntry[], color: string) => {
      const style = `color: ${color}; font-weight: bold`;
      console.groupCollapsed(`%c${label} (${items.length})`, style);
      items.forEach(e => console.log(`  "${e.key}" → ${e.source} (×${e.count})`));
      console.groupEnd();
    };

    console.log('%c🔍 IconRegistry Diagnostics', 'font-size: 14px; font-weight: bold');
    console.log(`   Total queries: ${entries.reduce((s, e) => s + e.count, 0)}`);
    console.log(`   Unique keys: ${entries.length}`);
    console.log('');

    if (missing.length > 0) {
      group('❌ FALTANTES (necesitan mapeo)', missing, '#ef4444');
      console.log(
        '%c💡 Para agregar, añade a SLUG_TO_ICON en icon-registry.service.ts:',
        'color: #3b82f6',
      );
      missing.forEach(e => {
        console.log(`   ['${e.key}', Lucide<Icon>.icon],`);
      });
    }

  group('✅ Slugs resueltos', resolved.filter(e => e.source === 'slug'), '#22c55e');

    console.log('');
    console.log('%cUsá iconRegistry.printDiagnostics() para ver este reporte otra vez', 'color: #6b7280');
  }
}
