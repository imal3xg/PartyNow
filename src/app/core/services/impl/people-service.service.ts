// src/app/services/impl/people.service.ts
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { IPeopleService } from '../interfaces/people-service.service';
import { Person } from '../../models/person.model';
import { PEOPLE_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IPeopleRepository } from '../../repositories/interfaces/people-repository';

@Injectable({
  providedIn: 'root'
})
export class PeopleService extends BaseService<Person> implements IPeopleService {
  constructor(
    @Inject(PEOPLE_REPOSITORY_TOKEN) repository: IPeopleRepository
  ) {
    super(repository);
  }

  // Implementa métodos específicos si los hay
}