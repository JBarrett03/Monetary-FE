import { bootstrapApplication } from '@angular/platform-browser';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, {
  providers: [
    provideAuth0({
      domain: 'dev-fw76viejfwagyrle.us.auth0.com',
      clientId: '5Q2AtBgriPCbUamsas4MnFrjDQdGbmPj',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    provideHttpClient(),
    appConfig.providers
  ]
}).catch(() => {});
