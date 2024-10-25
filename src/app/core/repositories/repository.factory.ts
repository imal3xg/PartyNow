// src/app/repositories/repository.factory.ts
import { FactoryProvider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepositoryHttpService } from './impl/base-repository-http.service';
import { IBaseRepository } from './interfaces/base-repository';
import { Person } from '../models/person.model';
import { PARTY_API_URL_TOKEN, PARTY_REPOSITORY_MAPPING_TOKEN, PARTY_REPOSITORY_TOKEN, PARTY_RESOURCE_NAME_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_REPOSITORY_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN } from './repository.tokens';
import { BaseRespositoryLocalStorageService } from './impl/base-repository-local-storage.service';
import { Model } from '../models/base.model';
import { IBaseMapping } from './interfaces/base-mapping';
import { JsonServerRepositoryService } from './impl/json-server-repository.service';
import { Party } from '../models/party.model';
// Importa otros modelos según sea necesario

export function createHttpRepository<T extends Model>(http: HttpClient, apiUrl: string, resource:string, mapping:IBaseMapping<T>): IBaseRepository<T> {
  return new BaseRepositoryHttpService<T>(http, apiUrl, resource, mapping);
}

export function createLocalStorageRepository<T extends Model>(resource: string, mapping:IBaseMapping<T>): IBaseRepository<T> {
  return new BaseRespositoryLocalStorageService<T>(resource, mapping);
}

export function createJsonServerRepository<T extends Model>(http: HttpClient, apiUrl: string, resource:string, mapping:IBaseMapping<T>): IBaseRepository<T> {
  return new JsonServerRepositoryService<T>(http, apiUrl, resource, mapping);
}

// Ejemplo de configuración para People
export const PeopleRepositoryFactory: FactoryProvider = {
  provide: PEOPLE_REPOSITORY_TOKEN,
  useFactory: (http: HttpClient, apiURL:string, resource:string, mapping:IBaseMapping<Person>) => {
    // Aquí puedes decidir qué implementación usar
    // Por ejemplo, usar Firebase:
    //return createHttpRepository<Person>(http, apiURL);
    //return createLocalStorageRepository<Person>(resource, mapping);
    return createJsonServerRepository<Person>(http, apiURL, resource, mapping);
  },
  deps: [HttpClient, PEOPLE_API_URL_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN]
};


// Ejemplo de configuración para People
export const PartyRepositoryFactory: FactoryProvider = {
  provide: PARTY_REPOSITORY_TOKEN,
  useFactory: (http: HttpClient, apiURL:string, resource:string, mapping:IBaseMapping<Party>) => {
    // Aquí puedes decidir qué implementación usar
    // Por ejemplo, usar Firebase:
    //return createHttpRepository<Person>(http, apiURL);
    //return createLocalStorageRepository<Person>(resource, mapping);
    return createJsonServerRepository<Party>(http, apiURL, resource, mapping);
  },
  deps: [HttpClient, PARTY_API_URL_TOKEN, PARTY_RESOURCE_NAME_TOKEN, PARTY_REPOSITORY_MAPPING_TOKEN]
};

// Repite esto para otros modelos como Usuario, etc.