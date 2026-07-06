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
            50: '#e6f6f5',
            100: '#cceae7',
            200: '#9ad9d3',
            300: '#6ac8bf',
            400: '#46c0b7',
            500: '#36bfb7',
            600: '#2ea8a1',
            700: '#248c86',
            800: '#1b706b',
            900: '#135450',
            950: '#0b3835'
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
