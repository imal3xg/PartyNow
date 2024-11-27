import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Party } from "../../models/party.model";

export interface PartyRaw {
    data: Data
    meta: Meta
  }
  
export interface Data {
    id: number
    attributes: PartyAttributes
}
export interface PartyData {
    data: PartyAttributes;
}

export interface PartyAttributes {
    name: string
    country: string
    minAge?: number
    dayDate: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class PartyMappingStrapiService implements IBaseMapping<Party> {
    setAdd(data: Party):PartyData {
        return {
            data:{
                name:data.name,
                country:data.country,
                minAge:data.minAge,
                dayDate:data.date
            }
        };
    }
    setUpdate(data: Party):PartyData {
        let toReturn: any = {
            data: {}
        };
        Object.keys(data).forEach(key=>{
            switch(key){
                case 'name': toReturn.data['name']=data[key];
                break;
                case 'country': toReturn.data['country']=data[key];
                break;
                case 'minAge': toReturn.data['minAge']=data[key];
                break;
                case 'date': toReturn.data['date']=data[key];
                break;
                default:
            }
        });
        return toReturn;
    }
    getPaginated(page:number, pageSize: number, pages:number, data:Data[]): Paginated<Party> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Party>((d:Data)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: Data | PartyRaw): Party {
        const isGroupRaw = (data: Data | PartyRaw): data is PartyRaw => 'meta' in data;
        
        const attributes = isGroupRaw(data) ? data.data.attributes : data.attributes;
        const id = isGroupRaw(data) ? data.data.id : data.id;

        return {
            id: id.toString(),
            name: attributes.name,
            country: attributes.country,
            minAge: attributes.minAge,
            date: attributes.dayDate
        };
    }
    getAdded(data: PartyRaw):Party {
        return this.getOne(data.data);
    }
    getUpdated(data: PartyRaw):Party {
        return this.getOne(data.data);
    }
    getDeleted(data: PartyRaw):Party {
        return this.getOne(data.data);
    }
  }
  