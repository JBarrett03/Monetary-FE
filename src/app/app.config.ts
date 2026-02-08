import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * The appConfig object is an ApplicationConfig that provides configuration for the Angular application. It includes providers for global error listeners and the router, which is configured with the defined routes for the application.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
