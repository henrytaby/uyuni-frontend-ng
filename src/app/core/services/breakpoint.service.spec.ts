import { BreakpointObserver, Breakpoints,BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import { BreakpointService } from './breakpoint.service';

describe('BreakpointService', () => {
  let service: BreakpointService;
  let mockBreakpointObserver: { observe: jest.Mock };
  let observeSubject: Subject<BreakpointState>;

  beforeEach(() => {
    // Creamos un Subject para poder emitir cambios de resolución asíncronamente
    observeSubject = new Subject<BreakpointState>();
    
    // Mockeamos el método observe del CDK para que escuche a nuestro Subject
    mockBreakpointObserver = {
      observe: jest.fn().mockReturnValue(observeSubject.asObservable())
    };

    TestBed.configureTestingModule({
      providers: [
        BreakpointService,
        { provide: BreakpointObserver, useValue: mockBreakpointObserver }
      ]
    });
  });

  it('should be created', () => {
    service = TestBed.inject(BreakpointService);
    expect(service).toBeTruthy();
    // Validamos que se llamó al observe pasándole los custom breakpoints requeridos
    expect(mockBreakpointObserver.observe).toHaveBeenCalledWith([
      '(min-width: 1280px)', // isXl
      '(min-width: 1024px)', // isLg
      '(min-width: 768px)',  // isMd
      Breakpoints.Handset
    ]);
  });

  describe('Initial / Undefined State', () => {
    it('should return safe default values when observer has not emitted', () => {
      service = TestBed.inject(BreakpointService);
      // toSignal inicia como undefined, lo cual manejamos con ?? false
      expect(service.isDesktop()).toBe(false);
      expect(service.isMobile()).toBe(true);  // !isDesktop() === !false === true
      expect(service.isMedium()).toBe(false);
    });
  });

  describe('Desktop Layout (>= 1280px)', () => {
    it('should identify desktop screens and set isMobile to false', () => {
      service = TestBed.inject(BreakpointService);
      
      // Emitimos el estado colapsado (Pantalla Grande)
      observeSubject.next({
        matches: true,
        breakpoints: {
          '(min-width: 1280px)': true,
          '(min-width: 1024px)': true,
          '(min-width: 768px)': true,
          [Breakpoints.Handset]: false
        }
      });
      
      expect(service.isDesktop()).toBe(true);
      expect(service.isMobile()).toBe(false);
      expect(service.isMedium()).toBe(true);
    });
  });

  describe('Tablet Layout (>= 768px && < 1280px)', () => {
    it('should identify medium screens', () => {
      service = TestBed.inject(BreakpointService);
      
      // Emitimos estado Tablet
      observeSubject.next({
        matches: true,
        breakpoints: {
          '(min-width: 1280px)': false,
          '(min-width: 1024px)': true, // Opcional para este test, pero la simulación es real
          '(min-width: 768px)': true,
          [Breakpoints.Handset]: false
        }
      });
      
      expect(service.isDesktop()).toBe(false);
      expect(service.isMobile()).toBe(true);
      expect(service.isMedium()).toBe(true);
    });
  });

  describe('Mobile Layout (< 768px)', () => {
    it('should identify handset screens', () => {
      service = TestBed.inject(BreakpointService);
      
      // Emitimos estado Móvil Nativo
      observeSubject.next({
        matches: true,
        breakpoints: {
          '(min-width: 1280px)': false,
          '(min-width: 1024px)': false,
          '(min-width: 768px)': false,
          [Breakpoints.Handset]: true
        }
      });
      
      expect(service.isDesktop()).toBe(false);
      expect(service.isMobile()).toBe(true);
      expect(service.isMedium()).toBe(false);
    });
  });
});
