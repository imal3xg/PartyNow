
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Person } from "../models/person.model";
import { Paginated } from "../models/paginated.model";
import { Party } from "../models/party.model";

export interface PaginatedRaw<T> {
    first: number
    prev: number|null
    next: number|null
    last: number
    pages: number
    items: number
    data: T[]
  };

  export interface PartyRaw {
    id: string
    nombre: string
    country:string
    minAge?:number
    date:string
    city: string
    price: number
    description: string
    personId: string
}
@Injectable({
    providedIn:'root'
})
export class MyPartyService{

    private apiUrl:string = "http://localhost:3000/parties"
    constructor(
        private http:HttpClient
    ){

    }

    getAll(page:number, pageSize:number): Observable<Paginated<Party>> {
        return this.http.get<PaginatedRaw<PartyRaw>>(`${this.apiUrl}/?_page=${page}&_per_page=${pageSize}`).pipe(map(res=>{
            return {page:page, pageSize:pageSize, pages:res.pages, data:res.data.map<Party>((d:PartyRaw)=>{
                return {
                    id:d.id, 
                    name:d.nombre,
                    country:d.country,
                    minAge:d.minAge,
                    date:d.date,
                    city:d.city,
                    price:d.price,
                    description:d.description,
                    personId:d.personId
                };
            })};
        }))
    }
}
