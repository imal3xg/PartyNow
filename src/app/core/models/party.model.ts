import { Model } from "./base.model";

export interface Party extends Model{
    name:string
    country:string
    date:string
    minAge?:number
    city:string
    price:number
    description?:string
    personId:string
}