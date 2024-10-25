// src/app/core/party.model.ts
import { Model } from "./base.model";

export interface Party extends Model{
    name:string
    location:string
    minAge?:number
    maxAge?:number
    date:string
}