import { Model } from "./base.model";

export interface Person extends Model{
    name:string,
    surname:string,
    age:number,
    username:string,
    email:string,
    gender:string,
    picture?:{
        large:string,
        thumbnail:string
    },
    partyID?:string
}