// src/app/repositories/repository.tokens.ts
import { InjectionToken } from '@angular/core';
import { IBaseRepository } from './interfaces/base-repository';
import { IPeopleRepository } from './interfaces/people-repository';
import { IBaseMapping } from './interfaces/base-mapping';
import { Person } from '../models/person.model';

export const RESOURCE_NAME_TOKEN = new InjectionToken<string>('ResourceName');
export const PEOPLE_RESOURCE_NAME_TOKEN = new InjectionToken<string>('PeopleResourceName');
export const PARTY_RESOURCE_NAME_TOKEN = new InjectionToken<string>('PartyResourceName');
export const REPOSITORY_TOKEN = new InjectionToken<IBaseRepository<any>>('REPOSITORY_TOKEN');
export const PEOPLE_REPOSITORY_TOKEN = new InjectionToken<IPeopleRepository>('IPeopleRepository');
export const PARTY_REPOSITORY_TOKEN = new InjectionToken<IPeopleRepository>('IPartyRepository');

export const API_URL_TOKEN = new InjectionToken<string>('ApiUrl');
export const PEOPLE_API_URL_TOKEN = new InjectionToken<string>('PeopleApiUrl');
export const PARTY_API_URL_TOKEN = new InjectionToken<string>('PartyApiUrl');

export const REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<any>>('IBaseRepositoryMapping');
export const PEOPLE_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Person>>('IPeopleRepositoryMapping');
export const PARTY_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Person>>('IPartyRepositoryMapping');