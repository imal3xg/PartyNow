import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";
import { Party } from "../../models/party.model";

export interface PartyRaw {
    id: string
    nombre: string
    country: string,
    minAge: number,
    date: string,
    city:string,
    price:number,
    description:string
}
@Injectable({
    providedIn: 'root'
  })
  export class PartyMappingJsonServer implements IBaseMapping<Party> {
    setAdd(data: Party) {
        throw new Error("Method not implemented.");
    }
    setUpdate(data: any) {
        throw new Error("Method not implemented.");
    }
    getPaginated(page:number, pageSize: number, pages:number, data:PartyRaw[]): Paginated<Party> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Party>((d:PartyRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: PartyRaw):Party {
        return {
            id:data.id, 
            name:data.nombre, 
            country:data.country,
            minAge:data.minAge,
            date:data.date,
            city:data.city,
            price:data.price,
            description:data.description
        };
    }
    getAdded(data: any):Party {
        throw new Error("Method not implemented.");
    }
    getUpdated(data: any):Party {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: any):Party {
        throw new Error("Method not implemented.");
    }
  }
  