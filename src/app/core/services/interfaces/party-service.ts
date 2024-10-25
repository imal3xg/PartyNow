// src/app/services/interfaces/people.service.interface.ts
import { Party } from '../../models/party.model';
import { Person } from '../../models/person.model';
import { IBaseService } from './base-service.service';

export interface IPartyService extends IBaseService<Party> {
  // Métodos específicos si los hay
}