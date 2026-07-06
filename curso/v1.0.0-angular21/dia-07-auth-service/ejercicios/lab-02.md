# Lab 02: Roles y Menús

## Objetivo
Implementar gestión de roles y menús dinámicos en AuthService.

## Ejercicios
1. Implementar fetchRoles()
2. Implementar setActiveRole()
3. Implementar fetchMenu()
4. Crear método hasRole()

## Código Base

```typescript
// Agregar a AuthService
private rolesSignal = signal<UserRole[]>([]);
private activeRoleSignal = signal<UserRole | null>(null);
private menuSignal = signal<MenuGroup[]>([]);

readonly currentRoles = this.rolesSignal.asReadonly();
readonly activeRole = this.activeRoleSignal.asReadonly();
readonly currentMenu = this.menuSignal.asReadonly();

fetchRoles(): void {
  // TODO: Implementar
}

setActiveRole(role: UserRole, navigate = true): void {
  // TODO: Implementar
}

fetchMenu(roleSlug: string): void {
  // TODO: Implementar
}

hasRole(roleName: string): boolean {
  // TODO: Implementar
}
```

## Solución Paso a Paso

### Paso 1: Implementar fetchRoles()

```typescript
fetchRoles(): void {
  this.loadingRolesSignal.set(true);
  
  this.http.get<UserRole[]>(`${this.configService.apiUrl}/auth/me/roles`).subscribe({
    next: (roles) => {
      this.rolesSignal.set(roles);
      this.logger.debug('Roles fetched', { count: roles.length });

      if (roles.length > 0) {
        const storedSlug = localStorage.getItem('active_role_slug');
        const matchedRole = roles.find(r => r.slug === storedSlug);

        if (matchedRole) {
          this.setActiveRole(matchedRole, false);
        } else {
          this.setActiveRole(roles[0], false);
        }
      } else {
        this.activeRoleSignal.set(null);
      }
      
      this.loadingRolesSignal.set(false);
    },
    error: (err) => {
      this.logger.error('Error fetching roles', err);
      this.loadingRolesSignal.set(false);
    }
  });
}
```

### Paso 2: Implementar setActiveRole()

```typescript
setActiveRole(role: UserRole, navigate = true): void {
  this.activeRoleSignal.set(role);
  localStorage.setItem('active_role_slug', role.slug);
  this.fetchMenu(role.slug);
  
  this.logger.info('Active role changed', { role: role.name });

  if (navigate) {
    this.router.navigate(['/']);
  }
}
```

### Paso 3: Implementar fetchMenu()

```typescript
fetchMenu(roleSlug: string): void {
  this.http.get<MenuGroup[]>(`${this.configService.apiUrl}/auth/me/menu/${roleSlug}`).subscribe({
    next: (menu) => {
      this.menuSignal.set(menu);
      this.logger.debug('Menu fetched', { roleSlug, items: menu.length });
    },
    error: (err) => {
      this.logger.error('Error fetching menu', err);
      this.menuSignal.set([]);
    }
  });
}
```

### Paso 4: Implementar hasRole()

```typescript
hasRole(roleName: string): boolean {
  return this.rolesSignal().some(role => role.name === roleName);
}
```

## Uso en Componentes

### Verificar Rol

```typescript
// En componente
canAccessAdmin = computed(() => this.authService.hasRole('admin'));

// En template
@if (canAccessAdmin()) {
  <button>Panel de Admin</button>
}
```

### Cambiar Rol

```typescript
// En header component
onRoleChange(role: UserRole) {
  this.authService.setActiveRole(role);
}
```

### Mostrar Menú

```typescript
// En sidebar component
menuItems = this.authService.currentMenu;

// En template
@for (group of menuItems()) {
  <div class="menu-group">
    <h3>{{ group.title }}</h3>
    @for (item of group.items) {
      <a [routerLink]="item.path">{{ item.label }}</a>
    }
  </div>
}
```

## Testing

```typescript
// Test de hasRole
it('should return true when user has role', () => {
  service.rolesSignal.set([{ id: 1, name: 'admin', slug: 'admin' }]);
  
  expect(service.hasRole('admin')).toBe(true);
  expect(service.hasRole('user')).toBe(false);
});
```

---

*Lab 02 - Día 7*
