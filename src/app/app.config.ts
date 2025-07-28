import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './_core/Interceptor/token.interceptor';
import {
  RECAPTCHA_V3_SITE_KEY,
  RecaptchaV3Module, // Import RecaptchaV3Module
  RecaptchaLoaderService, // Often useful to import if directly injecting, but typically handled by the module
  ReCaptchaV3Service
} from 'ng-recaptcha';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideHttpClient(withFetch(),withInterceptors([AuthInterceptor])),
    provideAnimations(),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      })
    ),
     ReCaptchaV3Service, // This typically makes ReCaptchaV3Service available
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: "6LcVd44rAAAAACGim4Lov0toCQXWllvM2y7K7VI9" // Use your actual v3 site key here
    },
    
  ],
};
