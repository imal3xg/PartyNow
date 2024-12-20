import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";


export interface PersonRaw {
    id?: string
    nombre: string
    apellidos: string
    email: string
    genero: string
    birthdate:string
}
@Injectable({
    providedIn: 'root'
  })
  export class PeopleMappingJsonServer implements IBaseMapping<Person> {
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

    setAdd(data: Person):PersonRaw {
        return {
            nombre:data.name,
            apellidos:data.surname,
            email:data.email,
            birthdate:data.birthdate,
            genero: this.toGenderMapping[data.gender],
        };
    }
    setUpdate(data: Person):PersonRaw {
        let toReturn:any = {};
        Object.keys(data).forEach(key=>{
            switch(key){
                case 'name': toReturn['nombre']=data[key];
                break;
                case 'surname': toReturn['apellidos']=data[key];
                break;
                case 'birthdate': toReturn['birthdate']=data[key];
                break;
                case 'email': toReturn['email']=data[key];
                break;
                case 'gender': toReturn['genero']=data[key]=='Masculino'?'male':data[key]=='Femenino'?'female':'other';
                break;
                default:
            }
        });
        return toReturn;
    }
    getPaginated(page:number, pageSize: number, pages:number, data:PersonRaw[]): Paginated<Person> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Person>((d:PersonRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: PersonRaw):Person {
        return {
            id:data.id!, 
            name:data.nombre, 
            surname:data.apellidos, 
            birthdate:(data as any)["fecha de nacimiento"]??'',
            email:(data as any)["email"]??'',
            gender:this.fromGenderMapping[data.genero],
            image:(data as any)["picture"]?{
                url:(data as any)["picture"].url,
                large:(data as any)["picture"].large, 
                medium:(data as any)["picture"].medium,
                small:(data as any)["picture"].small,
                thumbnail:(data as any)["picture"].thumbnail
            }: undefined
        };
    }
    
    getAdded(data: PersonRaw):Person {
        return this.getOne(data);
    }
    getUpdated(data: PersonRaw):Person {
        return this.getOne(data);
    }
    getDeleted(data: PersonRaw):Person {
        return this.getOne(data);
    }
  }
  