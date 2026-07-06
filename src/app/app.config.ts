import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler,inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import { provideLucideConfig } from '@lucide/angular';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { ConfigService } from '@core/config/config.service';
import { GlobalErrorHandler } from '@core/handlers/global-error-handler';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { loadingInterceptor } from '@core/interceptors/loading.interceptor';

import { routes } from './app.routes';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eef2ff',
            100: '#dbe4ff',
            200: '#bfcfff',
            300: '#97b0ff',
            400: '#6b8cfc',
            500: '#4464e8',
            600: '#334dc0',
            700: '#293d99',
            800: '#1f2e72',
            900: '#16204d',
            950: '#0e1433'
        }
    },
    components: {
        button: {
            root: {
                paddingX: '0.75rem',
                paddingY: '0.375rem'
            }
        },
        inputtext: {
            root: {
                paddingX: '0.75rem',
                paddingY: '0.275rem'
            }
        },
        select: {
            root: {
                paddingX: '0.75rem',
                paddingY: '0.275rem'
            }
        },
        datatable: {
            headerCell: {
                padding: '0.25rem 0.5rem'
            },
            bodyCell: {
                padding: '0.25rem 0.5rem'
            }
        },
        paginator: {
            navButton: {
                width: '28px',
                height: '28px'
            }
        }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    //provideAnimations(),
    providePrimeNG({
        ripple: true,
        theme: {
            preset: MyPreset,
            options: {
                darkModeSelector: '.dark', // Sincroniza con el switch de TailAdmin
                cssLayer: {
                    name: 'primeng',
                    order: 'base, primeng, components, utilities'
                }
            }
        }
    }),
    provideAppInitializer(() => {
        const configService = inject(ConfigService);
        return configService.loadConfig();
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideLucideConfig({ strokeWidth: 1.5 })
  ]
};
