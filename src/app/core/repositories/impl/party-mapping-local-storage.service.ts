import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Party } from "../../models/party.model";

interface PartyRaw {
  id: string;
  name: string;
  country: string;
  minAge: number;
  date: string;
  city: string;
  price: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupsMappingLocalStorageService implements IBaseMapping<Party> {

  setAdd(data: Party) {
    throw new Error("Method not implemented.");
  }

  setUpdate(data: any) {
    throw new Error("Method not implemented.");
  }

  getPaginated(page: number, pageSize: number, pages: number, data: PartyRaw[]): Paginated<Party> {
    return {
      page: page,
      pageSize: pageSize,
      pages: pages,
      data: data.map<Party>((d: PartyRaw) => {
        return this.getOne(d);
      })
    };
  }

  getOne(data: PartyRaw): Party {
    return {
      id: data.id,
      name: data.name,
      country: data.country,
      minAge: data.minAge,
      date: data.date,
      city:data.city,
      price:data.price,
      description:data.description
    };
  }

  getAdded(data: PartyRaw): Party {
    return this.getOne(data);
  }

  getUpdated(data: PartyRaw): Party {
    return this.getOne(data);
  }

  getDeleted(data: PartyRaw): Party {
    return this.getOne(data);
  }
}
