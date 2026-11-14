export interface RoundQueryParams {
  offset?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export type RoundStatus =
  | 'ACTIVE'
  | 'IN_RECOVERY'
  | 'NEAR_BREAKEVEN'
  | 'RECOVERED'
  | 'LIQUIDATED'
  | 'CLOSED';

export interface CommerceRound {
  id: string;
  code: string;
  name: string;
  disbursement_date?: string | null;
  capital_invested: number;
  currency: string;
  status: string;
  observations?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface RoundCreatePayload {
  code?: string | null;
  name: string;
  disbursement_date?: string | null;
  capital_invested?: number;
  currency?: string;
  status?: string;
  observations?: string | null;
}

export interface RoundUpdatePayload {
  code?: string | null;
  name?: string;
  disbursement_date?: string | null;
  currency?: string;
  observations?: string | null;
}

export interface RoundStatusInfo {
  label: string;
  badgeClass: string;
  dotClass: string;
  icon: string;
  description: string;
}

export function getRoundStatusInfo(status: string): RoundStatusInfo {
  const norm = (status || '').toUpperCase();
  switch (norm) {
    case 'ACTIVE':
      return {
        label: 'Activa (Inicial)',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        dotClass: 'bg-blue-500',
        icon: 'pi pi-clock',
        description: 'Ronda recién creada. Sin ventas registradas aún.'
      };
    case 'IN_RECOVERY':
      return {
        label: 'En Recuperación (<80%)',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
        dotClass: 'bg-sky-500',
        icon: 'pi pi-chart-line',
        description: 'Recuperando capital invertido a través de ventas de lotes.'
      };
    case 'NEAR_BREAKEVEN':
      return {
        label: 'Próximo a Break-Even (≥80%)',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        dotClass: 'bg-amber-500',
        icon: 'pi pi-exclamation-circle',
        description: 'Próximo a alcanzar el punto de equilibrio financiero.'
      };
    case 'RECOVERED':
      return {
        label: 'Break-Even (≥100%)',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dotClass: 'bg-emerald-500',
        icon: 'pi pi-check-circle',
        description: 'Punto de equilibrio alcanzado. Toda venta posterior es ganancia neta.'
      };
    case 'LIQUIDATED':
      return {
        label: 'Liquidada / Concluida',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
        dotClass: 'bg-purple-500',
        icon: 'pi pi-lock',
        description: 'Break-even alcanzado y todo el inventario de lotes vendido.'
      };
    case 'CLOSED':
      return {
        label: 'Cerrada',
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
        dotClass: 'bg-gray-400',
        icon: 'pi pi-lock',
        description: 'Ronda cerrada administrativamente.'
      };
    default:
      return {
        label: status || 'Activa',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        dotClass: 'bg-blue-500',
        icon: 'pi pi-info-circle',
        description: 'Estado financiero de la ronda.'
      };
  }
}
