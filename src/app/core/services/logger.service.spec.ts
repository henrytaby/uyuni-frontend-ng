import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpies: {
    debug: jest.SpyInstance;
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    service = new LoggerService();
    
    // Spy on console methods
    consoleSpies = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
  });

  afterEach(() => {
    // Restore all spies
    jest.restoreAllMocks();
  });

  describe('LogLevel enum', () => {
    it('should have correct numeric values for log levels', () => {
      expect(LogLevel.DEBUG).toBe(0);
      expect(LogLevel.INFO).toBe(1);
      expect(LogLevel.WARN).toBe(2);
      expect(LogLevel.ERROR).toBe(3);
      expect(LogLevel.NONE).toBe(4);
    });
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have default minLevel as DEBUG', () => {
      expect(service.getMinLevel()).toBe(LogLevel.DEBUG);
    });
  });

  describe('setMinLevel', () => {
    it('should set minimum log level', () => {
      service.setMinLevel(LogLevel.WARN);
      expect(service.getMinLevel()).toBe(LogLevel.WARN);
    });

    it('should allow setting to ERROR level', () => {
      service.setMinLevel(LogLevel.ERROR);
      expect(service.getMinLevel()).toBe(LogLevel.ERROR);
    });

    it('should allow setting to NONE level', () => {
      service.setMinLevel(LogLevel.NONE);
      expect(service.getMinLevel()).toBe(LogLevel.NONE);
    });
  });

  describe('setMinLevelFromString', () => {
    it('should set level from lowercase string', () => {
      service.setMinLevelFromString('debug');
      expect(service.getMinLevel()).toBe(LogLevel.DEBUG);
    });

    it('should set level from uppercase string', () => {
      service.setMinLevelFromString('INFO');
      expect(service.getMinLevel()).toBe(LogLevel.INFO);
    });

    it('should set level from mixed case string', () => {
      service.setMinLevelFromString('WaRn');
      expect(service.getMinLevel()).toBe(LogLevel.WARN);
    });

    it('should not change level for invalid string', () => {
      service.setMinLevel(LogLevel.ERROR);
      service.setMinLevelFromString('invalid');
      expect(service.getMinLevel()).toBe(LogLevel.ERROR);
    });

    it('should handle undefined string', () => {
      service.setMinLevel(LogLevel.INFO);
      service.setMinLevelFromString(undefined as unknown as string);
      expect(service.getMinLevel()).toBe(LogLevel.INFO);
    });

    it('should handle empty string', () => {
      service.setMinLevel(LogLevel.WARN);
      service.setMinLevelFromString('');
      expect(service.getMinLevel()).toBe(LogLevel.WARN);
    });
  });

  describe('debug', () => {
    it('should log debug message when level is DEBUG', () => {
      service.setMinLevel(LogLevel.DEBUG);
      service.debug('Test message');
      expect(consoleSpies.debug).toHaveBeenCalled();
    });

    it('should include context in message', () => {
      service.setMinLevel(LogLevel.DEBUG);
      service.debug('Test message', undefined, 'TestContext');
      expect(consoleSpies.debug).toHaveBeenCalledWith('[TestContext] Test message', '');
    });

    it('should include data in log', () => {
      service.setMinLevel(LogLevel.DEBUG);
      const data = { key: 'value' };
      service.debug('Test message', data);
      expect(consoleSpies.debug).toHaveBeenCalledWith(' Test message', data);
    });

    it('should not log when level is INFO', () => {
      service.setMinLevel(LogLevel.INFO);
      service.debug('Test message');
      expect(consoleSpies.debug).not.toHaveBeenCalled();
    });

    it('should not log when level is NONE', () => {
      service.setMinLevel(LogLevel.NONE);
      service.debug('Test message');
      expect(consoleSpies.debug).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should log info message when level is INFO', () => {
      service.setMinLevel(LogLevel.INFO);
      service.info('Test message');
      expect(consoleSpies.info).toHaveBeenCalled();
    });

    it('should log info message when level is DEBUG', () => {
      service.setMinLevel(LogLevel.DEBUG);
      service.info('Test message');
      expect(consoleSpies.info).toHaveBeenCalled();
    });

    it('should not log when level is WARN', () => {
      service.setMinLevel(LogLevel.WARN);
      service.info('Test message');
      expect(consoleSpies.info).not.toHaveBeenCalled();
    });

    it('should include context and data', () => {
      service.setMinLevel(LogLevel.INFO);
      const data = { userId: 123 };
      service.info('User logged in', data, 'AuthService');
      expect(consoleSpies.info).toHaveBeenCalledWith('[AuthService] User logged in', data);
    });
  });

  describe('warn', () => {
    it('should log warn message when level is WARN', () => {
      service.setMinLevel(LogLevel.WARN);
      service.warn('Test warning');
      expect(consoleSpies.warn).toHaveBeenCalled();
    });

    it('should log warn message when level is DEBUG', () => {
      service.setMinLevel(LogLevel.DEBUG);
      service.warn('Test warning');
      expect(consoleSpies.warn).toHaveBeenCalled();
    });

    it('should not log when level is ERROR', () => {
      service.setMinLevel(LogLevel.ERROR);
      service.warn('Test warning');
      expect(consoleSpies.warn).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log error message when level is ERROR', () => {
      service.setMinLevel(LogLevel.ERROR);
      service.error('Test error');
      expect(consoleSpies.error).toHaveBeenCalled();
    });

    it('should log error message when level is DEBUG', () => {
      service.setMinLevel(LogLevel.DEBUG);
      service.error('Test error');
      expect(consoleSpies.error).toHaveBeenCalled();
    });

    it('should not log when level is NONE', () => {
      service.setMinLevel(LogLevel.NONE);
      service.error('Test error');
      expect(consoleSpies.error).not.toHaveBeenCalled();
    });

    it('should log error object', () => {
      service.setMinLevel(LogLevel.ERROR);
      const error = new Error('Test error');
      service.error('Operation failed', error, 'HttpInterceptor');
      expect(consoleSpies.error).toHaveBeenCalledWith('[HttpInterceptor] Operation failed', error);
    });
  });

  describe('group', () => {
    let consoleGroupSpy: jest.SpyInstance;
    let consoleGroupEndSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
      consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();
    });

    it('should create console group when level is DEBUG', () => {
      service.setMinLevel(LogLevel.DEBUG);
      const fn = jest.fn();
      service.group('Test Group', fn);
      expect(consoleGroupSpy).toHaveBeenCalledWith('Test Group');
      expect(consoleGroupEndSpy).toHaveBeenCalled();
      expect(fn).toHaveBeenCalled();
    });

    it('should not create console group when level is INFO', () => {
      service.setMinLevel(LogLevel.INFO);
      const fn = jest.fn();
      service.group('Test Group', fn);
      expect(consoleGroupSpy).not.toHaveBeenCalled();
      expect(fn).toHaveBeenCalled();
    });

    it('should call groupEnd even if function throws', () => {
      service.setMinLevel(LogLevel.DEBUG);
      const fn = () => { throw new Error('Test error'); };
      expect(() => service.group('Test Group', fn)).toThrow('Test error');
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });
  });

  describe('time', () => {
    let consoleTimeSpy: jest.SpyInstance;
    let consoleTimeEndSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleTimeSpy = jest.spyOn(console, 'time').mockImplementation();
      consoleTimeEndSpy = jest.spyOn(console, 'timeEnd').mockImplementation();
    });

    it('should time async function when level is DEBUG', async () => {
      service.setMinLevel(LogLevel.DEBUG);
      const result = await service.time('Test Timer', () => Promise.resolve('result'));
      expect(consoleTimeSpy).toHaveBeenCalledWith('Test Timer');
      expect(consoleTimeEndSpy).toHaveBeenCalledWith('Test Timer');
      expect(result).toBe('result');
    });

    it('should not time async function when level is INFO', async () => {
      service.setMinLevel(LogLevel.INFO);
      const result = await service.time('Test Timer', () => Promise.resolve('result'));
      expect(consoleTimeSpy).not.toHaveBeenCalled();
      expect(consoleTimeEndSpy).not.toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should call timeEnd even if async function rejects', async () => {
      service.setMinLevel(LogLevel.DEBUG);
      const error = new Error('Async error');
      const promise = service.time('Test Timer', () => Promise.reject(error));
      await expect(promise).rejects.toThrow('Async error');
      expect(consoleTimeEndSpy).toHaveBeenCalledWith('Test Timer');
    });
  });

  describe('log level filtering', () => {
    it('should only log errors when level is ERROR', () => {
      service.setMinLevel(LogLevel.ERROR);
      
      service.debug('debug');
      service.info('info');
      service.warn('warn');
      service.error('error');
      
      expect(consoleSpies.debug).not.toHaveBeenCalled();
      expect(consoleSpies.info).not.toHaveBeenCalled();
      expect(consoleSpies.warn).not.toHaveBeenCalled();
      expect(consoleSpies.error).toHaveBeenCalled();
    });

    it('should log warn and error when level is WARN', () => {
      service.setMinLevel(LogLevel.WARN);
      
      service.debug('debug');
      service.info('info');
      service.warn('warn');
      service.error('error');
      
      expect(consoleSpies.debug).not.toHaveBeenCalled();
      expect(consoleSpies.info).not.toHaveBeenCalled();
      expect(consoleSpies.warn).toHaveBeenCalled();
      expect(consoleSpies.error).toHaveBeenCalled();
    });

    it('should log info, warn and error when level is INFO', () => {
      service.setMinLevel(LogLevel.INFO);
      
      service.debug('debug');
      service.info('info');
      service.warn('warn');
      service.error('error');
      
      expect(consoleSpies.debug).not.toHaveBeenCalled();
      expect(consoleSpies.info).toHaveBeenCalled();
      expect(consoleSpies.warn).toHaveBeenCalled();
      expect(consoleSpies.error).toHaveBeenCalled();
    });

    it('should log everything when level is DEBUG', () => {
      service.setMinLevel(LogLevel.DEBUG);
      
      service.debug('debug');
      service.info('info');
      service.warn('warn');
      service.error('error');
      
      expect(consoleSpies.debug).toHaveBeenCalled();
      expect(consoleSpies.info).toHaveBeenCalled();
      expect(consoleSpies.warn).toHaveBeenCalled();
      expect(consoleSpies.error).toHaveBeenCalled();
    });

    it('should log nothing when level is NONE', () => {
      service.setMinLevel(LogLevel.NONE);
      
      service.debug('debug');
      service.info('info');
      service.warn('warn');
      service.error('error');
      
      expect(consoleSpies.debug).not.toHaveBeenCalled();
      expect(consoleSpies.info).not.toHaveBeenCalled();
      expect(consoleSpies.warn).not.toHaveBeenCalled();
      expect(consoleSpies.error).not.toHaveBeenCalled();
    });
  });
});
