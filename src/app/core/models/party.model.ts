import { Model } from "./base.model";

export interface Party extends Model{
    name:string
    country:string
    date:string
    minAge?:number
}