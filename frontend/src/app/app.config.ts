import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { TitleStrategy, provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { TranslatedTitleStrategy } from '@core/i18n/translated-title-strategy';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withViewTransitions({ skipInitialTransition: true })
    ),
    provideHttpClient(withFetch()),
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
    provideClientHydration(),
  ],
};

