export interface MenuPermission {
    module_slug: string;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_read: boolean;
    scope_all: boolean;
}

export interface MenuModule {
  name: string;
  slug: string;
  route: string;
  sort_order: number;
  permissions: MenuPermission;
}

export interface MenuGroup {
  group_name: string;
  slug: string;
  sort_order: number;
  modules: MenuModule[];
}
