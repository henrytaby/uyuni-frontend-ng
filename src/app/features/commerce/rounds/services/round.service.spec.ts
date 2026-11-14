import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigService } from '@core/config/config.service';

import { CommerceRound, RoundCreatePayload, RoundUpdatePayload } from '../models/round.model';
import { RoundService } from './round.service';

describe('RoundService', () => {
  let service: RoundService;
  let httpMock: HttpTestingController;

  const mockConfigService = {
    apiUrl: 'http://localhost:8000/api'
  };

  const sampleRound: CommerceRound = {
    id: 'rnd-1',
    code: 'RONDA-01',
    name: 'Ronda Piloto',
    disbursement_date: '2026-08-01',
    capital_invested: 1650.0,
    currency: 'BOB',
    status: 'RECOVERED',
    observations: 'Prueba piloto'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoundService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: mockConfigService }
      ]
    });

    service = TestBed.inject(RoundService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch investment rounds', () => {
    service.getRounds({ offset: 0, limit: 10 }).subscribe(res => {
      expect(res).toEqual([sampleRound]);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/rounds/?offset=0&limit=10');
    expect(req.request.method).toBe('GET');
    req.flush([sampleRound]);
  });

  it('should get count of investment rounds', () => {
    service.getRoundsCount('piloto').subscribe(count => {
      expect(count).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/rounds/count?search=piloto');
    expect(req.request.method).toBe('GET');
    req.flush({ total: 1 });
  });

  it('should create an investment round', () => {
    const payload: RoundCreatePayload = {
      name: 'Ronda Nueva',
      code: 'RONDA-04'
    };

    service.createRound(payload).subscribe(res => {
      expect(res).toEqual(sampleRound);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/rounds/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(sampleRound);
  });

  it('should update an investment round', () => {
    const payload: RoundUpdatePayload = {
      name: 'Ronda Modificada'
    };

    service.updateRound('rnd-1', payload).subscribe(res => {
      expect(res).toEqual(sampleRound);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/rounds/rnd-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(sampleRound);
  });

  it('should delete an investment round', () => {
    service.deleteRound('rnd-1').subscribe(res => {
      expect(res.message).toBe('deleted');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/rounds/rnd-1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'deleted' });
  });

  it('should recalculate an investment round', () => {
    service.recalculateRound('rnd-1').subscribe(res => {
      expect(res).toEqual(sampleRound);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/commerce/rounds/rnd-1/recalculate');
    expect(req.request.method).toBe('POST');
    req.flush(sampleRound);
  });
});
