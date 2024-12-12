// src/app/app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationServiceFactory, AuthMappingFactory, MediaServiceFactory, PartyMappingFactory, PartyRepositoryFactory, PeopleMappingFactory, PeopleRepositoryFactory } from './core/repositories/repository.factory';
import { PeopleService } from './core/services/impl/people-service.service';
import { AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, PARTY_API_URL_TOKEN, PARTY_REPOSITORY_MAPPING_TOKEN, PARTY_RESOURCE_NAME_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN } from './core/repositories/repository.tokens';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { PartyService } from './core/services/impl/party-service.service';
import { PersonModalComponent } from './components/modals/person-modal/person-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PartyModalComponent } from './components/modals/party-modal/party-modal.component';
import { PriceInputComponent } from './components/control-value-accesor/price-input/price-input.component';
import { environment } from 'src/environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PersonModalComponent,
    PartyModalComponent,
    PriceInputComponent,
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    { provide: BACKEND_TOKEN, useValue: 'strapi' },
    { provide: PEOPLE_RESOURCE_NAME_TOKEN, useValue: 'people' },
    { provide: PARTY_RESOURCE_NAME_TOKEN, useValue: 'parties' },
    { provide: PEOPLE_API_URL_TOKEN, useValue: environment.apiUrl+'/api' },
    { provide: PARTY_API_URL_TOKEN, useValue: environment.apiUrl+'/api' },
    { provide: AUTH_SIGN_IN_API_URL_TOKEN, useValue: environment.apiUrl+'/api/auth/local' },
    { provide: AUTH_SIGN_UP_API_URL_TOKEN, useValue: environment.apiUrl+'/api/auth/local/register' },
    { provide: AUTH_ME_API_URL_TOKEN, useValue: environment.apiUrl+'/api/users/me' },
    { provide: UPLOAD_API_URL_TOKEN, useValue: environment.apiUrl+'/api/upload' },

    PeopleMappingFactory,
    PartyMappingFactory,
    AuthMappingFactory,
    PeopleRepositoryFactory,
    PartyRepositoryFactory,
    {
      provide: 'PeopleService',
      useClass: PeopleService
    },
    {
      provide: 'PartyService',
      useClass: PartyService
    },
    AuthenticationServiceFactory,
    MediaServiceFactory

    // ... otros proveedores],

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}