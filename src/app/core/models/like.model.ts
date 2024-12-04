import { Model } from "./base.model";

export interface Like extends Model {
    partyId: string;
    userId: string;
}