export interface Staff {
  id: string;
  first_name?: string;
  last_name_1?: string;
  last_name_2?: string;
  full_name: string;
  email: string;
  cellphone: string;
  management_name: string;
  department_name: string;
  birth_date: string;
  is_active: boolean;
  staff_type?: string;
  position_id?: string;
  org_unit_id?: string;
}

export interface StaffParams {
  offset?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  is_active?: boolean;
  org_unit_id?: string;
}
