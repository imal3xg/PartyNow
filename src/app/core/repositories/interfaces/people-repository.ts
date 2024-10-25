// src/app/core/repositories/interfaces/people-repository.interface.ts
import { Person } from "../../models/person.model";
import { IBaseRepository } from "./base-repository";

export interface IPeopleRepository extends IBaseRepository<Person>{

}