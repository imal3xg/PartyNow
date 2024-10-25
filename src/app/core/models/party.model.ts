import { Model } from "./base.model";

export interface Party extends Model{
    name:string
    location:string
    minAge?:number
    date:string
}