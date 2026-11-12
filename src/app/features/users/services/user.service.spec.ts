import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigService } from '@core/config/config.service';
import { LoggerService } from '@core/services/logger.service';

import { User, UserCreatePayload, UserUpdatePayload } from '../models/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockConfigService = {
    apiUrl: 'http://localhost:8000/api'
  };

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user list with query params', () => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@uyuni.com',
        is_active: true,
        is_verified: true,
        is_superuser: true
      }
    ];

    service.getUser({ offset: 0, limit: 15, search: 'admin' }).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/core/users/?offset=0&limit=15&search=admin');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should create a new user', () => {
    const payload: UserCreatePayload = {
      username: 'new_user',
      email: 'new@uyuni.com',
      password: 'password123',
      role_slugs: ['admin']
    };

    const mockCreatedUser: User = {
      id: '2',
      username: 'new_user',
      email: 'new@uyuni.com',
      is_active: true,
      is_verified: false,
      is_superuser: false,
      role_slugs: ['admin']
    };

    service.createUser(payload).subscribe(user => {
      expect(user).toEqual(mockCreatedUser);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/core/users/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockCreatedUser);
  });

  it('should update an existing user', () => {
    const payload: UserUpdatePayload = {
      first_name: 'Updated Name',
      role_slugs: ['admin', 'manager']
    };

    const mockUpdatedUser: User = {
      id: '1',
      username: 'admin',
      email: 'admin@uyuni.com',
      first_name: 'Updated Name',
      is_active: true,
      is_verified: true,
      is_superuser: true,
      role_slugs: ['admin', 'manager']
    };

    service.updateUser('1', payload).subscribe(user => {
      expect(user).toEqual(mockUpdatedUser);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/core/users/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUpdatedUser);
  });

  it('should fetch login history for user', () => {
    const mockLogs = [
      {
        id: 'log-1',
        created_at: '2026-11-11T10:00:00',
        ip_address: '192.168.1.1',
        host_info: 'Chrome on Linux',
        is_successful: true
      }
    ];

    service.getLoginHistory('1', 0, 10).subscribe(logs => {
      expect(logs).toEqual(mockLogs);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/core/users/1/logins?offset=0&limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockLogs);
  });

  it('should fetch roles catalog', () => {
    const mockCatalog = [
      { value: 'admin', label: 'Administrador' }
    ];

    service.getRolesCatalog().subscribe(catalog => {
      expect(catalog).toEqual(mockCatalog);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/catalogs/roles');
    expect(req.request.method).toBe('GET');
    req.flush(mockCatalog);
  });
});
