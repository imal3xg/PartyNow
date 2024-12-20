// src/app/services/impl/people.service.ts
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { IPeopleService } from '../interfaces/people-service.interface';
import { Person } from '../../models/person.model';
import { PARTY_REPOSITORY_TOKEN, PEOPLE_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IPeopleRepository } from '../../repositories/interfaces/people-repository.interface';
import { IPartyService } from '../interfaces/party-service.interface';
import { Party } from '../../models/party.model';
import { IPartyRepository } from '../../repositories/interfaces/party-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class PartyService extends BaseService<Party> implements IPartyService {
  constructor(
    @Inject(PARTY_REPOSITORY_TOKEN) repository: IPartyRepository
  ) {
    super(repository);
  }

  // Implementa métodos específicos si los hay
}