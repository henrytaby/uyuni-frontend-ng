import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigService } from '@core/config/config.service';

import {
  UserChangePasswordPayload,
  UserProfileResponse,
  UserProfileUpdatePayload
} from '../models/profile.model';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  const mockConfigService = {
    apiUrl: 'http://localhost:8000/api'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService }
      ]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch my profile via GET /api/auth/me', () => {
    const mockProfile: UserProfileResponse = {
      id: 'usr-1',
      username: 'novalabs',
      email: 'nova@empresa.com',
      first_name: 'Nova',
      last_name: 'Labs',
      is_verified: true,
      is_active: true
    };

    service.getMyProfile().subscribe(profile => {
      expect(profile).toEqual(mockProfile);
      expect(profile.username).toBe('novalabs');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
  });

  it('should update profile via PATCH /api/auth/me', () => {
    const payload: UserProfileUpdatePayload = {
      first_name: 'Nova Updated',
      city: 'Santa Cruz'
    };

    const mockResponse: UserProfileResponse = {
      id: 'usr-1',
      username: 'novalabs',
      email: 'nova@empresa.com',
      first_name: 'Nova Updated',
      city: 'Santa Cruz',
      is_verified: true,
      is_active: true
    };

    service.updateMyProfile(payload).subscribe(res => {
      expect(res.first_name).toBe('Nova Updated');
      expect(res.city).toBe('Santa Cruz');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/auth/me');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should change password via POST /api/auth/me/change-password', () => {
    const payload: UserChangePasswordPayload = {
      current_password: 'oldPassword123',
      new_password: 'newPassword456'
    };

    service.changeMyPassword(payload).subscribe(res => {
      expect(res.message).toBe('Contraseña actualizada exitosamente');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/auth/me/change-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ message: 'Contraseña actualizada exitosamente' });
  });

  it('should upload avatar via POST /api/core/media/upload?folder=avatars', () => {
    const mockFile = new File(['dummy-content'], 'test.webp', { type: 'image/webp' });
    const mockUploadResponse = {
      url: 'https://res.cloudinary.com/novalabs-bo/image/upload/v123/avatar.webp',
      public_id: 'uyuni/avatars/avatar_123',
      format: 'webp',
      bytes: 12345,
      width: 400,
      height: 400
    };

    service.uploadAvatar(mockFile).subscribe(res => {
      expect(res.url).toBe(mockUploadResponse.url);
      expect(res.format).toBe('webp');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/core/media/upload?folder=avatars');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush(mockUploadResponse);
  });

  it('should delete avatar via DELETE /api/auth/me/avatar', () => {
    const mockResponse: UserProfileResponse = {
      id: 'usr-1',
      username: 'novalabs',
      email: 'nova@empresa.com',
      avatar_url: null,
      is_verified: true,
      is_active: true
    };

    service.deleteAvatar().subscribe(res => {
      expect(res.avatar_url).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8000/api/auth/me/avatar');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});

