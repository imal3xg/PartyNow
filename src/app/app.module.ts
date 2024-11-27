// src/app/app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationServiceFactory, AuthMappingFactory, PartyMappingFactory, PartyRepositoryFactory, PeopleMappingFactory, PeopleRepositoryFactory } from './core/repositories/repository.factory';
import { PeopleService } from './core/services/impl/people-service.service';
import { AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, PARTY_API_URL_TOKEN, PARTY_REPOSITORY_MAPPING_TOKEN, PARTY_RESOURCE_NAME_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN } from './core/repositories/repository.tokens';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { PeopleLocalStorageMapping } from './core/repositories/impl/people-mapping-local-storage.service';
import { PeopleMappingJsonServer } from './core/repositories/impl/people-mapping-json-server.service';
import { PartyMappingJsonServer } from './core/repositories/impl/party-mapping-json-server.service';
import { PartyService } from './core/services/impl/party-service.service';
import { PersonModalComponent } from './components/person-modal/person-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './pages/login/login.page';
import { PartyModalComponent } from './components/party-modal/party-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    PersonModalComponent,
    PartyModalComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    { provide: BACKEND_TOKEN, useValue: 'strapi' },
    { provide: PEOPLE_RESOURCE_NAME_TOKEN, useValue: 'people' },
    { provide: PARTY_RESOURCE_NAME_TOKEN, useValue: 'parties' },
    { provide: PEOPLE_API_URL_TOKEN, useValue: 'http://localhost:1337/api' },
    { provide: PARTY_API_URL_TOKEN, useValue: 'http://localhost:1337/api' },
    { provide: AUTH_SIGN_IN_API_URL_TOKEN, useValue: 'http://localhost:1337/api/auth/local' },
    { provide: AUTH_SIGN_UP_API_URL_TOKEN, useValue: 'http://localhost:1337/api/auth/local/register' },
    { provide: AUTH_ME_API_URL_TOKEN, useValue: 'http://localhost:1337/api/users/me' },
    { provide: UPLOAD_API_URL_TOKEN, useValue: 'http://localhost:1337/api/upload' },

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

    // ... otros proveedores],

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}