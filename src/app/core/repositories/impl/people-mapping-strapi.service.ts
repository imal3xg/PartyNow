import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";
import { PartyRaw } from "./party-mapping-json-server.service";
import { StrapiMedia } from "../../services/impl/strapi-media.service";

interface MediaRaw{
    data: StrapiMedia
}

interface UserRaw{
    data: UserData
}

interface UserData{
    id: number
    attributes: UserAttributes
}

interface UserAttributes {
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
}

export interface PersonRaw {
    data: Data
    meta: Meta
}
  
export interface Data {
    id: number
    attributes: PersonAttributes
}

export interface PersonData {
    data: PersonAttributes;
}

export interface PersonAttributes {
    name: string
    surname: string
    gender: string
    birthdate: string
    email: string
    user: UserRaw | number | null,
    image: MediaRaw | number | null
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class PeopleMappingStrapiService implements IBaseMapping<Person> {
    toGenderMapping:any = {
        Masculino:'male',
        Femenino:'female',
        Otros:'other'
    };
    
    fromGenderMapping:any = {
        male:'Masculino',
        female:'Femenino',
        other:'Otros'
    };

    setAdd(data: Person):PersonData {
        return {
            data:{
                name:data.name,
                surname:data.surname,
                email:data.email,
                birthdate:data.birthdate,
                user:data.userId?Number(data.userId):null,
                gender: this.toGenderMapping[data.gender],
                image:data.image?Number(data.image):null

            }
        };
    }
    setUpdate(data: Person):PersonData {
        let toReturn:any = {
            data: {}
        };  
        Object.keys(data).forEach(key=>{
            switch(key){
                case 'name': toReturn.data['name']=data[key];
                break;
                case 'surname': toReturn.data['surname']=data[key];
                break;
                case 'email': toReturn.data['email']=data[key];
                break;
                case 'birthdate': toReturn.data['birthdate']=data[key];
                break;
                case 'gender': toReturn.data['gender']=data[key]=='Masculino'?'male':data[key]=='Femenino'?'female':'other';
                break;
                case 'userId': toReturn.data['userId']=data[key];
                break;
                case 'image': toReturn.data['image']=data[key];
                break;
                default:
            }
        });
        console.log(toReturn)
        return toReturn;
    }
    
    getPaginated(page: number, pageSize: number, pages: number, data: Data[]): Paginated<Person> {
        return {
            page: page,
            pageSize: pageSize,
            pages: pages,
            data: data.map((d: Data | PersonRaw) => this.getOne(d))
        };
    }
    
    getOne(data: Data | PersonRaw): Person {
        console.log(data)
        const isPersonRaw = (data: Data | PersonRaw): data is PersonRaw => 'meta' in data;

        const attributes = isPersonRaw(data) ? data.data.attributes : data.attributes;
        const id = isPersonRaw(data) ? data.data.id : data.id;
      return {
        id: id.toString(),
        name: attributes.name,
        surname: attributes.surname,
        email: attributes.email,
        birthdate: attributes.birthdate,
        gender: this.fromGenderMapping[attributes.gender],
        userId: typeof attributes.user === 'object' ? attributes.user?.data?.id.toString() : undefined,
        image: typeof attributes.image === 'object' ? {
            url: attributes.image?.data?.attributes?.url,
            large: attributes.image?.data?.attributes?.formats?.large?.url || attributes.image?.data?.attributes?.url,
            medium: attributes.image?.data?.attributes?.formats?.medium?.url || attributes.image?.data?.attributes?.url,
            small: attributes.image?.data?.attributes?.formats?.small?.url || attributes.image?.data?.attributes?.url,
            thumbnail: attributes.image?.data?.attributes?.formats?.thumbnail?.url || attributes.image?.data?.attributes?.url,
        } : undefined
      };
    }
  
    getAdded(data: PersonRaw):Person {
        return this.getOne(data.data);
    }
    getUpdated(data: PersonRaw):Person {
        return this.getOne(data.data);
    }
    getDeleted(data: PersonRaw):Person {
        return this.getOne(data.data);
    }
  }
  